// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SurveyMarketplace is Ownable, ReentrancyGuard {
    

    struct Survey {
        uint256 id;
        address creator;
        string title;
        string category;
        uint256 rewardPerResponse; // in Wei
        uint256 timeEstimate; // in minutes
        uint256 participantsNeeded;
        uint256 participantsCompleted;
        uint256 deadline;
        string description;
        string[] requirements;
        bool verified;
        bool urgent;
        bool active;
        uint256 budget; // Total budget in Wei
        uint256 remainingBudget;
        mapping(address => bool) respondents;
        mapping(address => bool) approvedResponses;
        mapping(address => bool) claimedRewards;
    }

    struct Category {
        string id;
        string name;
        uint256 count;
        bool active;
    }

    struct UserStats {
        uint256 totalEarned;
        uint256 surveysCompleted;
        uint256 activeStreak;
        string rank;
        uint256 pendingRewards;
        uint256 lastResponseTime;
    }

    // State variables
    mapping(uint256 => Survey) public surveys;
    mapping(string => Category) public categories;
    mapping(address => UserStats) public userStats;
    mapping(address => uint256[]) public userResponses;
    
    uint256 public nextSurveyId = 1;
    string[] public categoryIds;

    // Events
    event SurveyCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 reward,
        uint256 participantsNeeded
    );
    event ResponseSubmitted(uint256 indexed surveyId, address indexed respondent);
    event ResponseApproved(uint256 indexed surveyId, address indexed respondent);
    event RewardClaimed(uint256 indexed surveyId, address indexed respondent, uint256 amount);
    event SurveyClosed(uint256 indexed surveyId);

    // Modifiers
    modifier surveyExists(uint256 _surveyId) {
        require(surveys[_surveyId].creator != address(0), "Survey does not exist");
        _;
    }

    modifier surveyActive(uint256 _surveyId) {
        require(surveys[_surveyId].active, "Survey is not active");
        require(block.timestamp < surveys[_surveyId].deadline, "Survey deadline passed");
        require(surveys[_surveyId].participantsCompleted < surveys[_surveyId].participantsNeeded, "Survey full");
        _;
    }

    constructor() Ownable(msg.sender) ReentrancyGuard() {
        // Initialize categories
        _addCategory("all", "All Surveys");
        _addCategory("market", "Market Research");
        _addCategory("product", "Product Feedback");
        _addCategory("academic", "Academic Research");
        _addCategory("user", "User Experience");
    }

    function createSurvey(
        string memory _title,
        string memory _category,
        uint256 _rewardPerResponse,
        uint256 _timeEstimate,
        uint256 _participantsNeeded,
        uint256 _deadline,
        string memory _description,
        string[] memory _requirements
    ) external payable {
        require(bytes(_title).length > 0, "Title required");
        require(_participantsNeeded > 0, "Need participants");
        require(_rewardPerResponse > 0, "Reward required");
        require(msg.value >= _rewardPerResponse * _participantsNeeded, "Insufficient budget");

        uint256 surveyId = nextSurveyId++;
        Survey storage newSurvey = surveys[surveyId];
        
        newSurvey.id = surveyId;
        newSurvey.creator = msg.sender;
        newSurvey.title = _title;
        newSurvey.category = _category;
        newSurvey.rewardPerResponse = _rewardPerResponse;
        newSurvey.timeEstimate = _timeEstimate;
        newSurvey.participantsNeeded = _participantsNeeded;
        newSurvey.participantsCompleted = 0;
        newSurvey.deadline = block.timestamp + _deadline;
        newSurvey.description = _description;
        newSurvey.requirements = _requirements;
        newSurvey.verified = false;
        newSurvey.urgent = false;
        newSurvey.active = true;
        newSurvey.budget = msg.value;
        newSurvey.remainingBudget = msg.value;

        categories[_category].count++;

        emit SurveyCreated(surveyId, msg.sender, _title, _rewardPerResponse, _participantsNeeded);
    }

    function submitResponse(uint256 _surveyId, string memory _responseHash) 
        external 
        surveyExists(_surveyId) 
        surveyActive(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(!survey.respondents[msg.sender], "Already responded");
        
        survey.respondents[msg.sender] = true;
        survey.participantsCompleted++;
        userResponses[msg.sender].push(_surveyId);
        
        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        if (block.timestamp - stats.lastResponseTime <= 1 days) {
            stats.activeStreak++;
        } else {
            stats.activeStreak = 1;
        }
        stats.lastResponseTime = block.timestamp;

        emit ResponseSubmitted(_surveyId, msg.sender);

        // Auto-close survey if full
        if (survey.participantsCompleted >= survey.participantsNeeded) {
            survey.active = false;
            emit SurveyClosed(_surveyId);
        }
    }

    function approveResponse(uint256 _surveyId, address _respondent) 
        external 
        surveyExists(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(msg.sender == survey.creator, "Not survey creator");
        require(survey.respondents[_respondent], "No response submitted");
        require(!survey.approvedResponses[_respondent], "Already approved");
        
        survey.approvedResponses[_respondent] = true;
        userStats[_respondent].pendingRewards += survey.rewardPerResponse;

        emit ResponseApproved(_surveyId, _respondent);
    }

    function rejectResponse(uint256 _surveyId, address _respondent) 
        external 
        surveyExists(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(msg.sender == survey.creator, "Not survey creator");
        require(survey.respondents[_respondent], "No response submitted");
        require(!survey.approvedResponses[_respondent], "Already approved");
        
        survey.respondents[_respondent] = false;
        survey.participantsCompleted--;
        survey.active = true; // Reopen for new responses
    }

    function claimReward(uint256 _surveyId) 
        external 
        nonReentrant 
        surveyExists(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        UserStats storage stats = userStats[msg.sender];
        
        require(survey.approvedResponses[msg.sender], "Response not approved");
        require(!survey.claimedRewards[msg.sender], "Reward already claimed");
        require(survey.remainingBudget >= survey.rewardPerResponse, "Insufficient survey budget");

        survey.claimedRewards[msg.sender] = true;
        survey.remainingBudget -= survey.rewardPerResponse;
        
        stats.totalEarned += survey.rewardPerResponse;
        stats.surveysCompleted++;
        stats.pendingRewards -= survey.rewardPerResponse;
        
        // Update rank based on completed surveys
        if (stats.surveysCompleted >= 50) stats.rank = "Gold";
        else if (stats.surveysCompleted >= 25) stats.rank = "Silver";
        else stats.rank = "Bronze";

        payable(msg.sender).transfer(survey.rewardPerResponse);

        emit RewardClaimed(_surveyId, msg.sender, survey.rewardPerResponse);
    }

    function withdrawUnusedBudget(uint256 _surveyId) 
        external 
        surveyExists(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(msg.sender == survey.creator, "Not survey creator");
        require(!survey.active || block.timestamp >= survey.deadline, "Survey still active");
        
        uint256 amount = survey.remainingBudget;
        require(amount > 0, "No budget to withdraw");
        
        survey.remainingBudget = 0;
        payable(msg.sender).transfer(amount);
    }

    // View functions
    function getSurveyDetails(uint256 _surveyId) 
        external 
        view 
        returns (
            string memory title,
            string memory category,
            uint256 rewardPerResponse,
            uint256 participantsNeeded,
            uint256 participantsCompleted,
            uint256 remainingBudget,
            bool active,
            bool verified,
            string[] memory requirements
        ) 
    {
        Survey storage survey = surveys[_surveyId];
        return (
            survey.title,
            survey.category,
            survey.rewardPerResponse,
            survey.participantsNeeded,
            survey.participantsCompleted,
            survey.remainingBudget,
            survey.active,
            survey.verified,
            survey.requirements
        );
    }

    function getUserSurveys(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userResponses[_user];
    }

    function _addCategory(string memory _id, string memory _name) internal {
        categories[_id] = Category({
            id: _id,
            name: _name,
            count: 0,
            active: true
        });
        categoryIds.push(_id);
    }
}