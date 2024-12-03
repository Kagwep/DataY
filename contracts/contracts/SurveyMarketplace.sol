// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SurveyMarketplace is Ownable, ReentrancyGuard {
    
    // Break down Survey into smaller components
    struct SurveyMetadata {
        string title;
        string category;
        string description;
        string[] requirements;
        uint256 timeEstimate; // in minutes
    }

    struct SurveyFinancials {
        uint256 rewardPerResponse; // in Wei
        uint256 budget; // Total budget in Wei
        uint256 remainingBudget;
    }

    struct SurveyStats {
        uint256 participantsNeeded;
        uint256 participantsCompleted;
        uint256 deadline;
        bool verified;
        bool urgent;
        bool active;
    }

    struct Survey {
        uint256 id;
        address creator;
        SurveyMetadata metadata;
        SurveyFinancials financials;
        SurveyStats stats;
        mapping(address => bool) respondents;
        mapping(address => bool) approvedResponses;
        mapping(address => bool) claimedRewards;
    }

    // Input struct for creating surveys
    struct CreateSurveyParams {
        SurveyMetadata metadata;
        uint256 rewardPerResponse;
        uint256 participantsNeeded;
        uint256 deadline;
    }

    struct Category {
        string id;
        string name;
        uint256 count;
        bool active;
    }

    // Break down UserStats into components
    struct UserActivity {
        uint256 surveysCompleted;
        uint256 activeStreak;
        uint256 lastResponseTime;
    }

    struct UserRewards {
        uint256 totalEarned;
        uint256 pendingRewards;
        string rank;
    }

    struct UserStats {
        UserActivity activity;
        UserRewards rewards;
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
        require(surveys[_surveyId].stats.active, "Survey is not active");
        require(block.timestamp < surveys[_surveyId].stats.deadline, "Survey deadline passed");
        require(surveys[_surveyId].stats.participantsCompleted < surveys[_surveyId].stats.participantsNeeded, "Survey full");
        _;
    }

    constructor() Ownable(msg.sender) ReentrancyGuard() {
        _addCategory("all", "All Surveys");
        _addCategory("market", "Market Research");
        _addCategory("product", "Product Feedback");
        _addCategory("academic", "Academic Research");
        _addCategory("user", "User Experience");
    }

    function createSurvey(CreateSurveyParams calldata params) external payable {
        require(bytes(params.metadata.title).length > 0, "Title required");
        require(params.participantsNeeded > 0, "Need participants");
        require(params.rewardPerResponse > 0, "Reward required");
        require(msg.value >= params.rewardPerResponse * params.participantsNeeded, "Insufficient budget");

        uint256 surveyId = nextSurveyId++;
        Survey storage newSurvey = surveys[surveyId];
        
        newSurvey.id = surveyId;
        newSurvey.creator = msg.sender;
        newSurvey.metadata = params.metadata;
        
        newSurvey.financials = SurveyFinancials({
            rewardPerResponse: params.rewardPerResponse,
            budget: msg.value,
            remainingBudget: msg.value
        });
        
        newSurvey.stats = SurveyStats({
            participantsNeeded: params.participantsNeeded,
            participantsCompleted: 0,
            deadline: block.timestamp + params.deadline,
            verified: false,
            urgent: false,
            active: true
        });

        categories[params.metadata.category].count++;

        emit SurveyCreated(
            surveyId,
            msg.sender,
            params.metadata.title,
            params.rewardPerResponse,
            params.participantsNeeded
        );
    }

    function submitResponse(uint256 _surveyId) 
        external 
        surveyExists(_surveyId) 
        surveyActive(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(!survey.respondents[msg.sender], "Already responded");
        
        survey.respondents[msg.sender] = true;
        survey.stats.participantsCompleted++;
        userResponses[msg.sender].push(_surveyId);
        
        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        if (block.timestamp - stats.activity.lastResponseTime <= 1 days) {
            stats.activity.activeStreak++;
        } else {
            stats.activity.activeStreak = 1;
        }
        stats.activity.lastResponseTime = block.timestamp;

        emit ResponseSubmitted(_surveyId, msg.sender);

        // Auto-close survey if full
        if (survey.stats.participantsCompleted >= survey.stats.participantsNeeded) {
            survey.stats.active = false;
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
        userStats[_respondent].rewards.pendingRewards += survey.financials.rewardPerResponse;

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
        survey.stats.participantsCompleted--;
        survey.stats.active = true; // Reopen for new responses
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
        require(survey.financials.remainingBudget >= survey.financials.rewardPerResponse, "Insufficient survey budget");

        survey.claimedRewards[msg.sender] = true;
        survey.financials.remainingBudget -= survey.financials.rewardPerResponse;
        
        stats.rewards.totalEarned += survey.financials.rewardPerResponse;
        stats.activity.surveysCompleted++;
        stats.rewards.pendingRewards -= survey.financials.rewardPerResponse;
        
        // Update rank based on completed surveys
        if (stats.activity.surveysCompleted >= 50) stats.rewards.rank = "Gold";
        else if (stats.activity.surveysCompleted >= 25) stats.rewards.rank = "Silver";
        else stats.rewards.rank = "Bronze";

        payable(msg.sender).transfer(survey.financials.rewardPerResponse);

        emit RewardClaimed(_surveyId, msg.sender, survey.financials.rewardPerResponse);
    }

    function withdrawUnusedBudget(uint256 _surveyId) 
        external 
        surveyExists(_surveyId) 
    {
        Survey storage survey = surveys[_surveyId];
        require(msg.sender == survey.creator, "Not survey creator");
        require(!survey.stats.active || block.timestamp >= survey.stats.deadline, "Survey still active");
        
        uint256 amount = survey.financials.remainingBudget;
        require(amount > 0, "No budget to withdraw");
        
        survey.financials.remainingBudget = 0;
        payable(msg.sender).transfer(amount);
    }

    // View functions
    function getSurveyDetails(uint256 _surveyId) 
        external 
        view 
        returns (
            SurveyMetadata memory metadata,
            uint256 rewardPerResponse,
            uint256 participantsNeeded,
            uint256 participantsCompleted,
            uint256 remainingBudget,
            bool active,
            bool verified
        ) 
    {
        Survey storage survey = surveys[_surveyId];
        return (
            survey.metadata,
            survey.financials.rewardPerResponse,
            survey.stats.participantsNeeded,
            survey.stats.participantsCompleted,
            survey.financials.remainingBudget,
            survey.stats.active,
            survey.stats.verified
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