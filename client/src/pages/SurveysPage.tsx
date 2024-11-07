import React, { useState } from 'react';
import {
  Clock,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  BarChart,
  Filter,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SurveysPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('reward');

  // Mock user stats
  const userStats = {
    totalEarned: "2.45 ETH",
    surveysCompleted: 12,
    activeStreak: 5,
    rank: "Silver",
    pendingRewards: "0.15 ETH"
  };

  // Mock survey categories
  const categories = [
    { id: 'all', name: 'All Surveys', count: 24 },
    { id: 'market', name: 'Market Research', count: 8 },
    { id: 'product', name: 'Product Feedback', count: 6 },
    { id: 'academic', name: 'Academic Research', count: 5 },
    { id: 'user', name: 'User Experience', count: 5 }
  ];

  // Mock survey data
  const surveys = [
    {
      id: 1,
      title: "DeFi User Experience Study",
      category: "user",
      reward: "0.25 ETH",
      timeEstimate: "15-20 min",
      participantsNeeded: 100,
      participantsCompleted: 67,
      deadline: "2 days",
      description: "Share your experience with various DeFi platforms and help improve user interfaces.",
      requirements: ["Must have used at least 3 DeFi platforms", "Active wallet for 6+ months"],
      verified: true,
      urgent: true
    },
    {
      id: 2,
      title: "NFT Market Analysis",
      category: "market",
      reward: "0.15 ETH",
      timeEstimate: "10-15 min",
      participantsNeeded: 200,
      participantsCompleted: 145,
      deadline: "5 days",
      description: "Provide insights about your NFT trading experiences and preferences.",
      requirements: ["NFT trading experience", "Minimum 10 transactions"],
      verified: true,
      urgent: false
    },
    {
      id: 3,
      title: "Blockchain Gaming Survey",
      category: "product",
      reward: "0.2 ETH",
      timeEstimate: "20-25 min",
      participantsNeeded: 150,
      participantsCompleted: 58,
      deadline: "1 week",
      description: "Help shape the future of blockchain gaming by sharing your gaming preferences and experiences.",
      requirements: ["Played at least 2 blockchain games", "Active gaming wallet"],
      verified: true,
      urgent: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Banner */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Total Earned</div>
              <div className="text-xl font-bold text-blue-900">{userStats.totalEarned}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Surveys Completed</div>
              <div className="text-xl font-bold text-green-900">{userStats.surveysCompleted}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600 mb-1">Active Streak</div>
              <div className="text-xl font-bold text-yellow-900">{userStats.activeStreak} days</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Current Rank</div>
              <div className="text-xl font-bold text-purple-900">{userStats.rank}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-indigo-600 mb-1">Pending Rewards</div>
              <div className="text-xl font-bold text-indigo-900">{userStats.pendingRewards}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              
              {/* Category Filters */}
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Reward Range */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Minimum Reward</h4>
                <input
                  type="range"
                  className="w-full"
                  min="0"
                  max="0.5"
                  step="0.05"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 ETH</span>
                  <span>0.5 ETH</span>
                </div>
              </div>

              {/* Time Commitment */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Time Commitment</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Under 10 min</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">10-20 min</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Over 20 min</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

           {/* Sort Controls - Updated with Add Survey button */}
           <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <h2 className="text-xl font-bold text-gray-900">Available Surveys</h2>
                  <Link to="create-survey">
                  <button 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Survey
                  </button>
                  </Link>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white w-full sm:w-auto"
                >
                  <option value="reward">Highest Reward</option>
                  <option value="time">Shortest Time</option>
                  <option value="deadline">Ending Soon</option>
                  <option value="completion">Completion Rate</option>
                </select>
              </div>
            </div>

            {/* Survey Listings */}
            <div className="space-y-6">
              {surveys.map((survey) => (
                <div key={survey.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{survey.title}</h3>
                          {survey.verified && (
                            <CheckCircle className="ml-2 h-5 w-5 text-blue-500" />
                          )}
                          {survey.urgent && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{survey.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{survey.reward}</div>
                        <div className="text-sm text-gray-500">{survey.timeEstimate}</div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                      <ul className="mt-2 space-y-1">
                        {survey.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Progress and Stats */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(survey.participantsCompleted / survey.participantsNeeded) * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {survey.participantsCompleted}/{survey.participantsNeeded} participants
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Ends in {survey.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end space-x-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Start Survey
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveysPage;