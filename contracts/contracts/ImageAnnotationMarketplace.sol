// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ImageAnnotationMarketplace is Ownable, ReentrancyGuard {
 // Replace Counter with simple uint256
    uint256 private _currentTaskId;

    struct AnnotationTask {
        uint256 id;
        address creator;
        string title;
        string description;
        string imageUrl;        // IPFS hash of the image
        uint256 imagesCount;    // Number of images in the batch
        uint256 rewardPerImage; // Reward per image in Wei
        uint256 minAnnotators;  // Minimum annotators per image
        uint256 maxAnnotators;  // Maximum annotators per image
        AnnotationType annotationType;
        string[] requiredLabels; // Predefined labels/classes
        uint256 deadline;
        bool verified;
        bool active;
        uint256 budget;
        uint256 remainingBudget;
        ValidationStrategy validationStrategy;
        uint256 consensusThreshold; // Required agreement percentage (0-100)
    }

    // [Previous struct definitions remain the same]
    struct Annotation {
        address annotator;
        string annotationData;  // IPFS hash of annotation data
        uint256 timestamp;
        bool approved;
        bool rejected;
        bool consensusReached;
        uint256 agreementScore;
    }

    struct ImageMetadata {
        uint256 taskId;
        uint256 imageIndex;
        uint256 annotationsCount;
        mapping(address => bool) hasAnnotated;
        Annotation[] annotations;
        bool completed;
        bool consensusReached;
    }

    struct AnnotatorStats {
        uint256 totalAnnotated;
        uint256 totalEarned;
        uint256 accuracyScore;   // 0-100
        uint256 pendingRewards;
        uint256 lastAnnotationTime;
        string reputation;       // "Novice", "Expert", "Master"
    }

    enum AnnotationType {
        BoundingBox,
        Segmentation,
        KeyPoints,
        Classification,
        Custom
    }

    enum ValidationStrategy {
        Manual,           // Task creator manually validates
        Consensus,        // Majority agreement
        ExpertValidation  // Specific addresses can validate
    }

    // State variables
    mapping(uint256 => AnnotationTask) public tasks;
    mapping(uint256 => mapping(uint256 => ImageMetadata)) public imageMetadata; // taskId => imageIndex => metadata
    mapping(address => AnnotatorStats) public annotatorStats;
    mapping(uint256 => address[]) public taskAnnotators;
    mapping(uint256 => mapping(address => bool)) public expertValidators;

    // Events
    event TaskCreated(uint256 indexed taskId, address indexed creator, string title);
    event AnnotationSubmitted(uint256 indexed taskId, uint256 imageIndex, address indexed annotator);
    event AnnotationValidated(uint256 indexed taskId, uint256 imageIndex, address indexed annotator, bool approved);
    event ConsensusReached(uint256 indexed taskId, uint256 imageIndex);
    event RewardClaimed(uint256 indexed taskId, address indexed annotator, uint256 amount);

    modifier taskExists(uint256 _taskId) {
        require(tasks[_taskId].creator != address(0), "Task does not exist");
        _;
    }

    modifier taskActive(uint256 _taskId) {
        require(tasks[_taskId].active, "Task not active");
        require(block.timestamp < tasks[_taskId].deadline, "Task deadline passed");
        _;
    }

    constructor() Ownable(msg.sender) ReentrancyGuard() {}

    function createAnnotationTask(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _imagesCount,
        uint256 _rewardPerImage,
        uint256 _minAnnotators,
        uint256 _maxAnnotators,
        AnnotationType _annotationType,
        string[] memory _requiredLabels,
        uint256 _deadline,
        ValidationStrategy _validationStrategy,
        uint256 _consensusThreshold
    ) external payable {
        require(_imagesCount > 0, "Need images");
        require(_rewardPerImage > 0, "Need reward");
        require(_minAnnotators > 0, "Need annotators");
        require(_maxAnnotators >= _minAnnotators, "Invalid annotator range");
        require(_consensusThreshold <= 100, "Invalid threshold");

        uint256 totalBudgetNeeded = _imagesCount * _rewardPerImage * _maxAnnotators;
        require(msg.value >= totalBudgetNeeded, "Insufficient budget");

        // Replace Counter increment with simple increment
        _currentTaskId++;
        uint256 taskId = _currentTaskId;

        tasks[taskId] = AnnotationTask({
            id: taskId,
            creator: msg.sender,
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            imagesCount: _imagesCount,
            rewardPerImage: _rewardPerImage,
            minAnnotators: _minAnnotators,
            maxAnnotators: _maxAnnotators,
            annotationType: _annotationType,
            requiredLabels: _requiredLabels,
            deadline: block.timestamp + _deadline,
            verified: false,
            active: true,
            budget: msg.value,
            remainingBudget: msg.value,
            validationStrategy: _validationStrategy,
            consensusThreshold: _consensusThreshold
        });

        emit TaskCreated(taskId, msg.sender, _title);
    }

    function submitAnnotation(
        uint256 _taskId,
        uint256 _imageIndex,
        string memory _annotationData
    ) external taskExists(_taskId) taskActive(_taskId) {
        AnnotationTask storage task = tasks[_taskId];
        ImageMetadata storage metadata = imageMetadata[_taskId][_imageIndex];

        require(!metadata.hasAnnotated[msg.sender], "Already annotated");
        require(metadata.annotationsCount < task.maxAnnotators, "Max annotators reached");
        
        // Create annotation
        Annotation memory newAnnotation = Annotation({
            annotator: msg.sender,
            annotationData: _annotationData,
            timestamp: block.timestamp,
            approved: false,
            rejected: false,
            consensusReached: false,
            agreementScore: 0
        });

        metadata.annotations.push(newAnnotation);
        metadata.annotationsCount++;
        metadata.hasAnnotated[msg.sender] = true;

        // Update annotator stats
        AnnotatorStats storage stats = annotatorStats[msg.sender];
        stats.totalAnnotated++;
        stats.lastAnnotationTime = block.timestamp;

        // Check for consensus if applicable
        if (task.validationStrategy == ValidationStrategy.Consensus) {
            checkConsensus(_taskId, _imageIndex);
        }

        emit AnnotationSubmitted(_taskId, _imageIndex, msg.sender);
    }

    function validateAnnotation(
        uint256 _taskId,
        uint256 _imageIndex,
        address _annotator,
        bool _approved
    ) external taskExists(_taskId) {
        AnnotationTask storage task = tasks[_taskId];
        require(
            msg.sender == task.creator ||
            (task.validationStrategy == ValidationStrategy.ExpertValidation && 
             expertValidators[_taskId][msg.sender]),
            "Not authorized"
        );

        ImageMetadata storage metadata = imageMetadata[_taskId][_imageIndex];
        
        for (uint i = 0; i < metadata.annotations.length; i++) {
            if (metadata.annotations[i].annotator == _annotator) {
                metadata.annotations[i].approved = _approved;
                metadata.annotations[i].rejected = !_approved;

                if (_approved) {
                    // Update annotator stats and pending rewards
                    AnnotatorStats storage stats = annotatorStats[_annotator];
                    stats.pendingRewards += task.rewardPerImage;
                    updateAnnotatorReputation(_annotator);
                }

                emit AnnotationValidated(_taskId, _imageIndex, _annotator, _approved);
                break;
            }
        }
    }

    function checkConsensus(uint256 _taskId, uint256 _imageIndex) internal {
        AnnotationTask storage task = tasks[_taskId];
        ImageMetadata storage metadata = imageMetadata[_taskId][_imageIndex];

        if (metadata.annotationsCount >= task.minAnnotators) {
            // Implement consensus checking logic based on annotation type
            // This is a simplified example
            uint256 agreementCount = 0;
            string memory mostCommonAnnotation = metadata.annotations[0].annotationData;

            for (uint i = 0; i < metadata.annotations.length; i++) {
                if (keccak256(bytes(metadata.annotations[i].annotationData)) == 
                    keccak256(bytes(mostCommonAnnotation))) {
                    agreementCount++;
                }
            }

            uint256 agreementPercentage = (agreementCount * 100) / metadata.annotationsCount;

            if (agreementPercentage >= task.consensusThreshold) {
                metadata.consensusReached = true;
                
                // Approve annotations that match consensus
                for (uint i = 0; i < metadata.annotations.length; i++) {
                    if (keccak256(bytes(metadata.annotations[i].annotationData)) == 
                        keccak256(bytes(mostCommonAnnotation))) {
                        metadata.annotations[i].approved = true;
                        metadata.annotations[i].consensusReached = true;
                        
                        // Update rewards
                        address annotator = metadata.annotations[i].annotator;
                        annotatorStats[annotator].pendingRewards += task.rewardPerImage;
                    }
                }

                emit ConsensusReached(_taskId, _imageIndex);
            }
        }
    }

    function claimRewards(uint256 _taskId) external nonReentrant {
        AnnotatorStats storage stats = annotatorStats[msg.sender];
        require(stats.pendingRewards > 0, "No pending rewards");

        uint256 amount = stats.pendingRewards;
        stats.pendingRewards = 0;
        stats.totalEarned += amount;

        payable(msg.sender).transfer(amount);
        emit RewardClaimed(_taskId, msg.sender, amount);
    }

    function updateAnnotatorReputation(address _annotator) internal {
        AnnotatorStats storage stats = annotatorStats[_annotator];
        
        if (stats.totalAnnotated >= 1000 && stats.accuracyScore >= 90) {
            stats.reputation = "Master";
        } else if (stats.totalAnnotated >= 100 && stats.accuracyScore >= 80) {
            stats.reputation = "Expert";
        } else {
            stats.reputation = "Novice";
        }
    }

    // View functions
    function getTaskDetails(uint256 _taskId) 
        external 
        view 
        returns (
            string memory title,
            string memory description,
            uint256 imagesCount,
            uint256 rewardPerImage,
            uint256 remainingBudget,
            bool active,
            AnnotationType annotationType,
            string[] memory requiredLabels
        ) 
    {
        AnnotationTask storage task = tasks[_taskId];
        return (
            task.title,
            task.description,
            task.imagesCount,
            task.rewardPerImage,
            task.remainingBudget,
            task.active,
            task.annotationType,
            task.requiredLabels
        );
    }

        function getCurrentTaskId() external view returns (uint256) {
        return _currentTaskId;
    }
}