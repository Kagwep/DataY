import React from 'react';
import { Shield, Database, DollarSign, Lock, BarChart, Users } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Data Protection",
      description: "Enhanced privacy and security using iExec's trusted computing environment"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Marketplace",
      description: "Buy and sell valuable data assets in a decentralized marketplace"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Monetize Your Data",
      description: "Earn rewards by participating in surveys and sharing data"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Secure Web3 Data Marketplace
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
              Monetize your data through our decentralized marketplace. Participate in surveys,
              earn rewards, and maintain control over your data with advanced privacy protection.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                Start Earning
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-blue-700">
                View Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">$2M+</div>
              <div className="mt-2 text-gray-600">Total Data Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">10k+</div>
              <div className="mt-2 text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">5k+</div>
              <div className="mt-2 text-gray-600">Surveys Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-white">
                Ready to monetize your data?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join our secure marketplace and start earning rewards today.
              </p>
              <button className="mt-8 px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;