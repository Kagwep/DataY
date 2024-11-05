import React, { useState } from 'react';
import { Search, Filter, Tag, Clock, Database, DollarSign, Star, Shield } from 'lucide-react';

const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data categories
  const categories = [
    { id: 'all', name: 'All Data', count: 156 },
    { id: 'financial', name: 'Financial', count: 45 },
    { id: 'healthcare', name: 'Healthcare', count: 32 },
    { id: 'retail', name: 'Retail', count: 28 },
    { id: 'social', name: 'Social Media', count: 51 }
  ];

  // Mock data listings
  const dataListings = [
    {
      id: 1,
      title: "Consumer Behavior Dataset 2024",
      category: "retail",
      price: "2.5 ETH",
      size: "1.2GB",
      records: "50k",
      rating: 4.8,
      reviews: 124,
      verified: true,
      description: "Comprehensive consumer behavior data including purchase patterns, preferences, and demographic information.",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Healthcare Analytics Bundle",
      category: "healthcare",
      price: "4.0 ETH",
      size: "2.8GB",
      records: "100k",
      rating: 4.9,
      reviews: 89,
      verified: true,
      description: "Anonymous healthcare records with treatment outcomes and patient demographics for research purposes.",
      lastUpdated: "5 days ago"
    },
    {
      id: 3,
      title: "Financial Market Trends",
      category: "financial",
      price: "3.2 ETH",
      size: "800MB",
      records: "25k",
      rating: 4.7,
      reviews: 156,
      verified: true,
      description: "Historical financial market data with advanced analytics and trend indicators.",
      lastUpdated: "1 week ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Data Marketplace
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Discover and purchase high-quality datasets from verified providers
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                <Database className="h-4 w-4 mr-2" />
                List Your Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
              
              {/* Categories */}
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

              {/* Price Range */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Price Range</h4>
                <input
                  type="range"
                  className="w-full"
                  min="0"
                  max="10"
                  step="0.1"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 ETH</span>
                  <span>10 ETH</span>
                </div>
              </div>

              {/* Data Size */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Data Size</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Under 1GB</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">1GB - 5GB</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Over 5GB</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Data Listings */}
            <div className="space-y-6">
              {dataListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {listing.title}
                          {listing.verified && (
                            <Shield className="inline-block ml-2 h-4 w-4 text-blue-500" />
                          )}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">{listing.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{listing.price}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Database className="h-4 w-4 mr-1" />
                        {listing.size}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="h-4 w-4 mr-1" />
                        {listing.records} records
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {listing.rating} ({listing.reviews} reviews)
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated {listing.lastUpdated}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Preview Data
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                        Purchase Access
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

export default MarketplacePage;