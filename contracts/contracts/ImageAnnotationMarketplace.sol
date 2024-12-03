// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ImageAnnotationMarketplace is Ownable, ReentrancyGuard {
 // Replace Counter with simple uint256
     uint256 private _currentTaskId;

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

    // Break down AnnotationTask into smaller components
    struct TaskMetadata {
        string title;
        string description;
        string imageUrl;        // IPFS hash of the image
        string[] requiredLabels; // Predefined labels/classes
        AnnotationType annotationType;
    }

    struct TaskRequirements {
        uint256 imagesCount;    
        uint256 minAnnotators;  
        uint256 maxAnnotators;  
        uint256 deadline;
        ValidationStrategy validationStrategy;
        uint256 consensusThreshold;
    }

    struct TaskFinancials {
        uint256 rewardPerImage;
        uint256 budget;
        uint256 remainingBudget;
    }

    struct TaskStatus {
        bool verified;
        bool active;
    }

    struct AnnotationTask {
        uint256 id;
        address creator;
        TaskMetadata metadata;
        TaskRequirements requirements;
        TaskFinancials financials;
        TaskStatus status;
    }

    // Break down Annotation into core and status
    struct AnnotationData {
        address annotator;
        string annotationData;  // IPFS hash of annotation data
        uint256 timestamp;
    }

    struct AnnotationStatus {
        bool approved;
        bool rejected;
        bool consensusReached;
        uint256 agreementScore;
    }

    struct Annotation {
        AnnotationData data;
        AnnotationStatus status;
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

    // Break down AnnotatorStats into activity and rewards
    struct AnnotatorActivity {
        uint256 totalAnnotated;
        uint256 lastAnnotationTime;
        uint256 accuracyScore;   // 0-100
    }

    struct AnnotatorRewards {
        uint256 totalEarned;
        uint256 pendingRewards;
        string reputation;       // "Novice", "Expert", "Master"
    }

    struct AnnotatorStats {
        AnnotatorActivity activity;
        AnnotatorRewards rewards;
    }

    // State variables
    mapping(uint256 => AnnotationTask) public tasks;
    mapping(uint256 => mapping(uint256 => ImageMetadata)) public imageMetadata;
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
        require(tasks[_taskId].status.active, "Task not active");
        require(block.timestamp < tasks[_taskId].requirements.deadline, "Task deadline passed");
        _;
    }

    constructor() Ownable(msg.sender) ReentrancyGuard() {}

    // Define input struct for task creation to avoid stack too deep
    struct CreateTaskParams {
        TaskMetadata metadata;
        TaskRequirements requirements;
        uint256 rewardPerImage;
    }

    function createAnnotationTask(CreateTaskParams calldata params) external payable {
        require(params.requirements.imagesCount > 0, "Need images");
        require(params.rewardPerImage > 0, "Need reward");
        require(params.requirements.minAnnotators > 0, "Need annotators");
        require(params.requirements.maxAnnotators >= params.requirements.minAnnotators, "Invalid annotator range");
        require(params.requirements.consensusThreshold <= 100, "Invalid threshold");

        uint256 totalBudgetNeeded = params.requirements.imagesCount * params.rewardPerImage * params.requirements.maxAnnotators;
        require(msg.value >= totalBudgetNeeded, "Insufficient budget");

        _currentTaskId++;
        uint256 taskId = _currentTaskId;

        tasks[taskId] = AnnotationTask({
            id: taskId,
            creator: msg.sender,
            metadata: params.metadata,
            requirements: params.requirements,
            financials: TaskFinancials({
                rewardPerImage: params.rewardPerImage,
                budget: msg.value,
                remainingBudget: msg.value
            }),
            status: TaskStatus({
                verified: false,
                active: true
            })
        });

        emit TaskCreated(taskId, msg.sender, params.metadata.title);
    }

    function submitAnnotation(
        uint256 _taskId,
        uint256 _imageIndex,
        string memory _annotationData
    ) external taskExists(_taskId) taskActive(_taskId) {
        AnnotationTask storage task = tasks[_taskId];
        ImageMetadata storage metadata = imageMetadata[_taskId][_imageIndex];

        require(!metadata.hasAnnotated[msg.sender], "Already annotated");
        require(metadata.annotationsCount < task.requirements.maxAnnotators, "Max annotators reached");
        
        Annotation memory newAnnotation = Annotation({
            data: AnnotationData({
                annotator: msg.sender,
                annotationData: _annotationData,
                timestamp: block.timestamp
            }),
            status: AnnotationStatus({
                approved: false,
                rejected: false,
                consensusReached: false,
                agreementScore: 0
            })
        });

        metadata.annotations.push(newAnnotation);
        metadata.annotationsCount++;
        metadata.hasAnnotated[msg.sender] = true;

        AnnotatorStats storage stats = annotatorStats[msg.sender];
        stats.activity.totalAnnotated++;
        stats.activity.lastAnnotationTime = block.timestamp;

        if (task.requirements.validationStrategy == ValidationStrategy.Consensus) {
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
            (task.requirements.validationStrategy == ValidationStrategy.ExpertValidation && 
             expertValidators[_taskId][msg.sender]),
            "Not authorized"
        );

        ImageMetadata storage metadata = imageMetadata[_taskId][_imageIndex];
        
        for (uint i = 0; i < metadata.annotations.length; i++) {
            if (metadata.annotations[i].data.annotator == _annotator) {
                metadata.annotations[i].status.approved = _approved;
                metadata.annotations[i].status.rejected = !_approved;

                if (_approved) {
                    // Update annotator stats and pending rewards
                    AnnotatorStats storage stats = annotatorStats[_annotator];
                    stats.rewards.pendingRewards += task.financials.rewardPerImage;
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

        if (metadata.annotationsCount >= task.requirements.minAnnotators) {
            // Implement consensus checking logic based on annotation type
            // This is a simplified example
            uint256 agreementCount = 0;
            string memory mostCommonAnnotation = metadata.annotations[0].data.annotationData;

            for (uint i = 0; i < metadata.annotations.length; i++) {
                if (keccak256(bytes(metadata.annotations[i].data.annotationData)) == 
                    keccak256(bytes(mostCommonAnnotation))) {
                    agreementCount++;
                }
            }

            uint256 agreementPercentage = (agreementCount * 100) / metadata.annotationsCount;

            if (agreementPercentage >= task.requirements.consensusThreshold) {
                metadata.consensusReached = true;
                
                // Approve annotations that match consensus
                for (uint i = 0; i < metadata.annotations.length; i++) {
                    if (keccak256(bytes(metadata.annotations[i].data.annotationData)) == 
                        keccak256(bytes(mostCommonAnnotation))) {
                        metadata.annotations[i].status.approved = true;
                        metadata.annotations[i].status.consensusReached = true;
                        
                        // Update rewards
                        address annotator = metadata.annotations[i].data.annotator;
                        annotatorStats[annotator].rewards.pendingRewards += task.financials.rewardPerImage;
                    }
                }

                emit ConsensusReached(_taskId, _imageIndex);
            }
        }
    }

function claimRewards(uint256 _taskId) external nonReentrant {
        AnnotatorStats storage stats = annotatorStats[msg.sender];
        require(stats.rewards.pendingRewards > 0, "No pending rewards");

        uint256 amount = stats.rewards.pendingRewards;
        stats.rewards.pendingRewards = 0;
        stats.rewards.totalEarned += amount;

        payable(msg.sender).transfer(amount);
        emit RewardClaimed(_taskId, msg.sender, amount);
    }

    function updateAnnotatorReputation(address _annotator) internal {
        AnnotatorStats storage stats = annotatorStats[_annotator];
        
        if (stats.activity.totalAnnotated >= 1000 && stats.activity.accuracyScore >= 90) {
            stats.rewards.reputation = "Master";
        } else if (stats.activity.totalAnnotated >= 100 && stats.activity.accuracyScore >= 80) {
            stats.rewards.reputation = "Expert";
        } else {
            stats.rewards.reputation = "Novice";
        }
    }

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
            task.metadata.title,
            task.metadata.description,
            task.requirements.imagesCount,
            task.financials.rewardPerImage,
            task.financials.remainingBudget,
            task.status.active,
            task.metadata.annotationType,
            task.metadata.requiredLabels
        );
    }

        function getCurrentTaskId() external view returns (uint256) {
        return _currentTaskId;
    }
}