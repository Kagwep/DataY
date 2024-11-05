import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  Clock,
  Gift,
  Shield,
  Database,
  ChartBar,
  Activity,
  Star,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const EarnPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user earnings data
  const earningsData = {
    totalEarned: "4.85 ETH",
    thisMonth: "0.85 ETH",
    pendingRewards: "0.32 ETH",
    rank: "Gold",
    multiplier: "1.5x",
    streak: 15
  };

  // Mock earnings opportunities
  const opportunities = [
    {
      id: 1,
      type: "Survey",
      title: "DeFi User Research",
      reward: "0.25 ETH",
      timeEstimate: "20 min",
      difficulty: "Easy",
      status: "Available",
      endTime: "2 days",
      requirements: ["DeFi experience", "10+ transactions"]
    },
    {
      id: 2,
      type: "Data Set",
      title: "Trading History Data",
      reward: "0.5 ETH/month",
      timeEstimate: "Passive",
      difficulty: "Medium",
      status: "Active",
      endTime: "Ongoing",
      requirements: ["6+ months trading", "Regular activity"]
    },
    {
      id: 3,
      type: "Analysis",
      title: "Market Sentiment Study",
      reward: "0.35 ETH",
      timeEstimate: "30 min",
      difficulty: "Medium",
      status: "Available",
      endTime: "1 week",
      requirements: ["Trading experience", "Analysis skills"]
    }
  ];

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: "Data Pioneer",
      description: "Shared first dataset",
      reward: "0.1 ETH",
      completed: true
    },
    {
      id: 2,
      title: "Survey Master",
      description: "Complete 10 surveys",
      reward: "0.2 ETH",
      progress: 8,
      total: 10
    },
    {
      id: 3,
      title: "Consistent Contributor",
      description: "30-day activity streak",
      reward: "0.5 ETH",
      progress: 15,
      total: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Earnings Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Earnings</p>
                  <h3 className="text-3xl font-bold mt-1">{earningsData.totalEarned}</h3>
                </div>
                <DollarSign className="h-12 w-12 opacity-20" />
              </div>
              <div className="mt-4 text-blue-100">
                This month: {earningsData.thisMonth}
              </div>
            </div>

            {/* Rank Card */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Current Rank</p>
                  <h3 className="text-3xl font-bold mt-1">{earningsData.rank}</h3>
                </div>
                <Award className="h-12 w-12 opacity-20" />
              </div>
              <div className="mt-4 text-purple-100">
                Reward Multiplier: {earningsData.multiplier}
              </div>
            </div>

            {/* Streak Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Activity Streak</p>
                  <h3 className="text-3xl font-bold mt-1">{earningsData.streak} Days</h3>
                </div>
                <Activity className="h-12 w-12 opacity-20" />
              </div>
              <div className="mt-4 text-green-100">
                Pending Rewards: {earningsData.pendingRewards}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`pb-4 px-2 text-sm font-medium ${
              activeTab === 'opportunities'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-4 px-2 text-sm font-medium ${
              activeTab === 'achievements'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Achievements
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earning Methods */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ways to Earn</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Database className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">Share Data</h4>
                      <p className="text-sm text-gray-500">Monetize your data by sharing it securely</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ChartBar className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">Complete Surveys</h4>
                      <p className="text-sm text-gray-500">Participate in research and earn rewards</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">Special Tasks</h4>
                      <p className="text-sm text-gray-500">Earn bonuses through featured opportunities</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="ml-2 text-sm text-gray-600">Survey Completed</span>
                    </div>
                    <span className="text-sm text-gray-500">+0.15 ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">Data Shared</span>
                    </div>
                    <span className="text-sm text-gray-500">+0.25 ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-purple-500" />
                      <span className="ml-2 text-sm text-gray-600">Achievement Unlocked</span>
                    </div>
                    <span className="text-sm text-gray-500">+0.1 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full
                            ${opportunity.type === 'Survey' ? 'bg-blue-100 text-blue-800' :
                              opportunity.type === 'Data Set' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'}`}>
                            {opportunity.type}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          Difficulty: {opportunity.difficulty}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{opportunity.reward}</div>
                        <div className="text-sm text-gray-500">{opportunity.timeEstimate}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                      <ul className="mt-2 space-y-1">
                        {opportunity.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {opportunity.endTime}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Start Earning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{achievement.title}</h3>
                    <Award className={`h-6 w-6 ${achievement.completed ? 'text-yellow-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{achievement.description}</p>
                  <div className="mt-4">
                    {achievement.completed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <div className="mt-4 text-sm font-medium text-gray-900">
                      Reward: {achievement.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarnPage;