import React, { useState, useEffect } from 'react';
import {
  Tag,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Image as ImageIcon,
  Filter,
  Search,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
//import { useAccount } from 'wagmi';

// Types remain the same
interface AnnotationTask {
  id: number;
  creator: string;
  title: string;
  description: string;
  imageUrl: string;
  imagesCount: number;
  rewardPerImage: string;
  minAnnotators: number;
  maxAnnotators: number;
  annotationType: AnnotationType;
  requiredLabels: string[];
  deadline: number;
  verified: boolean;
  active: boolean;
  budget: string;
  remainingBudget: string;
  validationStrategy: ValidationStrategy;
  consensusThreshold: number;
  currentAnnotators?: number;
  completedImages?: number;
}


interface AnnotatorStats {
    totalAnnotated: number;
    totalEarned: string;
    accuracyScore: number;
    pendingRewards: string;
    reputation: 'Novice' | 'Expert' | 'Master';
  }
  

enum AnnotationType {
    BoundingBox,
    Segmentation,
    KeyPoints,
    Classification,
    Custom
  }
  
  enum ValidationStrategy {
    Manual,
    Consensus,
    ExpertValidation
  }
  
  interface Category {
    id: string;
    name: string;
    count: number;
  }

  interface StatsCardProps {
    title: string;
    value: string;
    icon: React.FC<{ className?: string }>;
    colorClass: string;
  }


  interface TaskCardProps {
    task: AnnotationTask;
  }

const AnnotationMarketplacePage: React.FC = () => {
  const  address  = "useAccount()";

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reward');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userStats, setUserStats] = useState<AnnotatorStats | null>(null);
  const [tasks, setTasks] = useState<AnnotationTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories: Category[] = [
    { id: 'all', name: 'All Tasks', count: 24 },
    { id: 'bounding-box', name: 'Bounding Box', count: 8 },
    { id: 'segmentation', name: 'Segmentation', count: 6 },
    { id: 'classification', name: 'Classification', count: 5 },
    { id: 'keypoints', name: 'Keypoints', count: 5 }
  ];

useEffect(() => {
    if (address) {
      fetchUserStats();
      fetchTasks();
    }
  }, [address]);

  const fetchUserStats = async () => {
    // Implement contract call
    const mockStats: AnnotatorStats = {
      totalAnnotated: 156,
      totalEarned: "2.45 ETH",
      accuracyScore: 92,
      pendingRewards: "0.15 ETH",
      reputation: "Expert"
    };
    setUserStats(mockStats);
  };

  const fetchTasks = async () => {
    // Implement contract call
    setLoading(true);
    try {
      // Mock data for now
      const mockTasks: AnnotationTask[] = [
        {
          id: 1,
          creator: "0x123...",
          title: "Street Scene Object Detection",
          description: "Annotate vehicles and pedestrians in urban environments",
          imageUrl: "ipfs://...",
          imagesCount: 1000,
          rewardPerImage: "0.001 ETH",
          minAnnotators: 3,
          maxAnnotators: 5,
          annotationType: AnnotationType.BoundingBox,
          requiredLabels: ["car", "pedestrian", "bicycle", "traffic_sign"],
          deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
          verified: true,
          active: true,
          budget: "1 ETH",
          remainingBudget: "0.8 ETH",
          validationStrategy: ValidationStrategy.Consensus,
          consensusThreshold: 80,
          currentAnnotators: 3,
          completedImages: 400
        },
        // Add more mock tasks...
      ];
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Banner */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Total Earned
              </div>
              <div className="text-xl font-bold text-blue-900">{userStats?.totalEarned || "0 ETH"}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Tasks Completed
              </div>
              <div className="text-xl font-bold text-green-900">{userStats?.totalAnnotated || "0"}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600 mb-1 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Accuracy Score
              </div>
              <div className="text-xl font-bold text-yellow-900">{userStats?.accuracyScore || "0"}%</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Reputation
              </div>
              <div className="text-xl font-bold text-purple-900">{userStats?.reputation || "Novice"}</div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm text-indigo-600 mb-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Pending Rewards
              </div>
              <div className="text-xl font-bold text-indigo-900">{userStats?.pendingRewards || "0 ETH"}</div>
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

              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Minimum Reward</h4>
                <input
                  type="range"
                  className="w-full"
                  min="0"
                  max="0.01"
                  step="0.0001"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 ETH</span>
                  <span>0.01 ETH</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Validation Strategy</h4>
                <div className="space-y-2">
                  {Object.values(ValidationStrategy).map((strategy) => (
                    <label key={strategy} className="flex items-center">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span className="ml-2 text-sm text-gray-600">{strategy}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white w-full sm:w-auto"
                >
                  <option value="reward">Highest Reward</option>
                  <option value="deadline">Ending Soon</option>
                  <option value="consensus">Highest Consensus</option>
                  <option value="completion">Completion Rate</option>
                </select>
              </div>
            </div>

            {/* Task Listings */}
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                          {task.verified && (
                            <CheckCircle className="ml-2 h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{task.rewardPerImage}</div>
                        <div className="text-sm text-gray-500">per image</div>
                      </div>
                    </div>

                    {/* Required Labels */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {task.requiredLabels.map((label) => (
                        <span key={label} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* Progress and Stats */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(task.completedImages! / task.imagesCount) * 100}%`
                          }}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {task.currentAnnotators}/{task.maxAnnotators} annotators
                        </span>
                        <span className="flex items-center">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          {task.completedImages}/{task.imagesCount} images
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end space-x-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Start Annotating
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

export default AnnotationMarketplacePage;