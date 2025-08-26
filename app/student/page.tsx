'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import Link from 'next/link';

interface StudentStats {
  totalSales: number;
  booksSold: number;
  currentGoal: number;
  progress: number;
  referralLinks: number;
  lastSale: string;
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock student stats
      const mockStats: StudentStats = {
        totalSales: 1250,
        booksSold: 25,
        currentGoal: 1500,
        progress: 83,
        referralLinks: 3,
        lastSale: '2025-01-15'
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.STUDENT}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your sales progress and manage referrals</p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Sales</p>
                    <p className="text-3xl font-bold">${stats?.totalSales?.toLocaleString()}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Books Sold</p>
                    <p className="text-3xl font-bold">{stats?.booksSold}</p>
                  </div>
                  <div className="text-4xl">📚</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Goal Progress</p>
                    <p className="text-3xl font-bold">{stats?.progress}%</p>
                  </div>
                  <div className="text-4xl">🎯</div>
                </div>
              </div>
            </div>

            {/* Goal Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
                <span className="text-sm text-gray-500">${stats?.totalSales} / ${stats?.currentGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ${(stats?.currentGoal || 0) - (stats?.totalSales || 0)} left to reach your goal!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/student/referrals"
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                >
                  <div className="text-blue-600 text-2xl mb-2">🔗</div>
                  <p className="font-medium text-gray-900">Manage Referral Links</p>
                  <p className="text-sm text-gray-600">{stats?.referralLinks} active links</p>
                </Link>
                
                <Link 
                  href="/student/books"
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                >
                  <div className="text-green-600 text-2xl mb-2">📚</div>
                  <p className="font-medium text-gray-900">View Available Books</p>
                  <p className="text-sm text-gray-600">Browse and share deals</p>
                </Link>
                
                <Link 
                  href="/student/sales"
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                >
                  <div className="text-purple-600 text-2xl mb-2">📊</div>
                  <p className="font-medium text-gray-900">Sales History</p>
                  <p className="text-sm text-gray-600">View your sales records</p>
                </Link>
                
                <Link 
                  href="/student/support"
                  className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
                >
                  <div className="text-orange-600 text-2xl mb-2">❓</div>
                  <p className="font-medium text-gray-900">Get Help</p>
                  <p className="text-sm text-gray-600">Support and resources</p>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Book sold - Lincoln High School 2025</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">New referral link created</span>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Goal milestone reached - 75%</span>
                  </div>
                  <span className="text-xs text-gray-500">3 days ago</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Success</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Share your referral links on social media and with family</p>
                <p>• Follow up with potential customers after sharing links</p>
                <p>• Track your progress and celebrate milestones</p>
                <p>• Ask for help from teachers or parents if needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
