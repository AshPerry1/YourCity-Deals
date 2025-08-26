'use client';

import { useState } from 'react';

export default function StudentHeader() {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Student Portal</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <span>•</span>
            <span>Welcome back, Emma!</span>
            <span>•</span>
            <span>Lincoln High School</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.83 10.83a4 4 0 118.66 0A7.97 7.97 0 0112 14a7.97 7.97 0 01-3.17.83 4 4 0 11-8.66 0z" />
            </svg>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Messages */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">E</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Emma Davis</p>
              <p className="text-xs text-gray-600">Student Seller</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
