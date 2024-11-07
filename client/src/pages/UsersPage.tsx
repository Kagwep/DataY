import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  BarChart,
  Image as ImageIcon,
  Users,
  Star,
  Activity,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface UserProfile {
  address: string;
  username: string;
  joinedDate: string;
  reputation: 'Novice' | 'Expert' | 'Master';
  totalEarned: string;
  accuracyScore: number;
  tasksCompleted: number;
  activeStreak: number;
  pendingRewards: string;
  specializations: string[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
}

interface TaskHistory {
  id: number;
  title: string;
  type: string;
  completedDate: string;
  reward: string;
  accuracyScore: number;
  status: 'completed' | 'pending' | 'rejected';
}

interface EarningHistory {
  date: string;
  amount: string;
  taskCount: number;
  avgAccuracy: number;
}

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'earnings' | 'achievements'>('overview');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [earningHistory, setEarningHistory] = useState<EarningHistory[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API/contract calls
    setUserProfile({
      address: '0x1234...5678',
      username: 'DataMaster',
      joinedDate: '2024-01-15',
      reputation: 'Expert',
      totalEarned: '5.45 ETH',
      accuracyScore: 94,
      tasksCompleted: 156,
      activeStreak: 12,
      pendingRewards: '0.25 ETH',
      specializations: ['Object Detection', 'Segmentation', 'Classification'],
      achievements: [
        {
          id: '1',
          title: 'Accuracy Master',
          description: 'Maintained 95%+ accuracy over 100 tasks',
          earnedDate: '2024-03-01',
          icon: 'award'
        },
        // Add more achievements
      ]
    });

    setTaskHistory([
      {
        id: 1,
        title: 'Medical Image Classification',
        type: 'Classification',
        completedDate: '2024-03-10',
        reward: '0.15 ETH',
        accuracyScore: 96,
        status: 'completed'
      },
      // Add more task history
    ]);

    setEarningHistory([
      {
        date: '2024-03',
        amount: '1.25 ETH',
        taskCount: 45,
        avgAccuracy: 93
      },
      // Add more earning history
    ]);
  }, []);

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{userProfile.username}</h1>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">{userProfile.address}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">Joined {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-600 font-medium">{userProfile.reputation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <DollarSign className="w-4 h-4 mr-2" />
              Total Earned
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.totalEarned}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Accuracy Score
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.accuracyScore}%</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Tasks Completed
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.tasksCompleted}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Active Streak
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.activeStreak} days</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              {['overview', 'tasks', 'earnings', 'achievements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Specializations */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.specializations.map((spec) => (
                      <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {taskHistory.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-500">{task.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{task.reward}</div>
                          <div className="text-sm text-gray-500">{task.accuracyScore}% accuracy</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Highlights */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.achievements.slice(0, 4).map((achievement) => (
                      <div key={achievement.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Award className="w-8 h-8 text-yellow-500" />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{achievement.title}</div>
                          <div className="text-sm text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {taskHistory.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{task.type}</span>
                        <span className="mx-2">•</span>
                        <span>{task.completedDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{task.reward}</div>
                      <div className={`text-sm ${
                        task.status === 'completed' ? 'text-green-600' : 
                        task.status === 'pending' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <div className="mb-6">
                  <BarChart className="w-full h-64 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {earningHistory.map((earning) => (
                    <div key={earning.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{earning.date}</h4>
                        <div className="text-sm text-gray-500">{earning.taskCount} tasks completed</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{earning.amount}</div>
                        <div className="text-sm text-gray-500">{earning.avgAccuracy}% avg accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{achievement.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{achievement.description}</div>
                      <div className="text-sm text-gray-400 mt-2">Earned on {achievement.earnedDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;