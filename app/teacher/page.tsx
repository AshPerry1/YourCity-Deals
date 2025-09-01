'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';

interface TeacherStats {
  totalStudents: number;
  booksSold: number;
  totalRaised: number;
  classRanking: number;
  activeStudents: number;
  completionRate: number;
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock teacher stats
      const mockStats: TeacherStats = {
        totalStudents: 28,
        booksSold: 156,
        totalRaised: 3120,
        classRanking: 2,
        activeStudents: 24,
        completionRate: 86
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.TEACHER}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your classroom fundraising and track student progress</p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Total Students</p>
                    <p className="text-3xl font-bold">{stats?.totalStudents}</p>
                  </div>
                  <div className="text-4xl">👥</div>
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
                    <p className="text-purple-100">Total Raised</p>
                    <p className="text-3xl font-bold">${stats?.totalRaised?.toLocaleString()}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>
            </div>

            {/* Class Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Class Completion Rate</h3>
                <span className="text-sm text-gray-500">{stats?.activeStudents} / {stats?.totalStudents} active</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${stats?.completionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {stats?.completionRate}% of students are actively participating in the campaign
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/teacher/students"
                  className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
                >
                  <div className="text-orange-600 text-2xl mb-2">👨‍🎓</div>
                  <p className="font-medium text-gray-900">Manage Students</p>
                  <p className="text-sm text-gray-600">{stats?.activeStudents} students active</p>
                </Link>
                
                <Link 
                  href="/teacher/analytics"
                  className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-left"
                >
                  <div className="text-red-600 text-2xl mb-2">📊</div>
                  <p className="font-medium text-gray-900">Class Analytics</p>
                  <p className="text-sm text-gray-600">Performance insights</p>
                </Link>
                
                <Link 
                  href="/teacher/communication"
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                >
                  <div className="text-green-600 text-2xl mb-2">📧</div>
                  <p className="font-medium text-gray-900">Communication</p>
                  <p className="text-sm text-gray-600">Email parents and students</p>
                </Link>
                
                <Link 
                  href="/teacher/rewards"
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                >
                  <div className="text-purple-600 text-2xl mb-2">🏆</div>
                  <p className="font-medium text-gray-900">Manage Rewards</p>
                  <p className="text-sm text-gray-600">Set up student incentives</p>
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
                    <span className="text-sm text-gray-600">Student Emma sold 2 books</span>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Class reached 75% of goal</span>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Marcus earned top seller badge</span>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}