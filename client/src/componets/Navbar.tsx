import React, { useState } from 'react';
import { Menu, X, Lock, Bell, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigationItems = [
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Surveys', href: '/surveys' },
    { name: 'Annotation', href: '/annotation' },
    { name: 'Earn', href: '/earn' },
    { name: 'About', href: '/about' },
  ];

  const notifications = [
    'New Survey Available',
    'Data Request',
    'Payment Received'
  ];

  const profileMenuItems = [
    { name: 'Your Profile', href: '#profile' },
    { name: 'Settings', href: '#settings' },
    { name: 'Disconnect', action: () => setIsConnected(false) }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Lock className="h-8 w-8 text-blue-600" />
              <Link to={'/'}><span className="ml-2 text-xl font-bold text-gray-900">DataY</span></Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navigationItems.map((item) => (
                <Link key={item.name} to={item.href}>
                <a
                  className="px-3 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  {item.name}
                </a>
               </Link>         
              ))}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50"
              >
                <Bell className="h-6 w-6" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {notifications.map((notification, index) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowNotifications(false);
                      }}
                    >
                      {notification}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            {isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                >
                  <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {profileMenuItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.action) item.action();
                          setShowProfileMenu(false);
                        }}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsConnected(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            >
              {item.name}
            </a>
          ))}

          {/* Mobile Notifications */}
          <div className="px-3 py-2 text-base font-medium text-gray-500">
            <div className="font-medium">Notifications</div>
            <div className="mt-2 space-y-1">
              {notifications.map((notification, index) => (
                <div key={index} className="py-1 text-sm text-gray-700">
                  {notification}
                </div>
              ))}
            </div>
          </div>
          
          {!isConnected && (
            <button
              onClick={() => setIsConnected(true)}
              className="w-full mt-4 px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile menu footer */}
        {isConnected && (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">0x1234...5678</div>
                <div className="text-xs text-gray-500">Connected</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {profileMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.action) item.action();
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;