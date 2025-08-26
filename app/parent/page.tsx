'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';

interface Student {
  id: string;
  name: string;
  grade: string;
  sales: number;
  booksSold: number;
  progress: number;
  lastActivity: string;
}

interface ClassStats {
  totalStudents: number;
  totalSales: number;
  totalBooksSold: number;
  averageProgress: number;
  topPerformer: string;
}

export default function ParentTeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock student data
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: '10th Grade',
          sales: 1250,
          booksSold: 25,
          progress: 85,
          lastActivity: '2025-01-15'
        },
        {
          id: '2',
          name: 'Michael Chen',
          grade: '10th Grade',
          sales: 980,
          booksSold: 19,
          progress: 72,
          lastActivity: '2025-01-14'
        },
        {
          id: '3',
          name: 'Sarah Williams',
          grade: '10th Grade',
          sales: 1450,
          booksSold: 29,
          progress: 92,
          lastActivity: '2025-01-15'
        },
        {
          id: '4',
          name: 'David Rodriguez',
          grade: '10th Grade',
          sales: 750,
          booksSold: 15,
          progress: 60,
          lastActivity: '2025-01-13'
        },
        {
          id: '5',
          name: 'Lisa Thompson',
          grade: '10th Grade',
          sales: 1100,
          booksSold: 22,
          progress: 78,
          lastActivity: '2025-01-15'
        }
      ];

      const mockClassStats: ClassStats = {
        totalStudents: 5,
        totalSales: 5530,
        totalBooksSold: 110,
        averageProgress: 77.4,
        topPerformer: 'Sarah Williams'
      };

      setStudents(mockStudents);
      setClassStats(mockClassStats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Class Overview', icon: '📊' },
    { id: 'students', name: 'Student Progress', icon: '👥' },
    { id: 'analytics', name: 'Detailed Analytics', icon: '📈' },
  ];

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
    <ProtectedRoute requiredRole={UserRole.PARENT_TEACHER}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Parent/Teacher Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor student progress and class performance</p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Class Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100">Total Students</p>
                            <p className="text-3xl font-bold">{classStats?.totalStudents}</p>
                          </div>
                          <div className="text-4xl">👥</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100">Total Sales</p>
                            <p className="text-3xl font-bold">${classStats?.totalSales?.toLocaleString()}</p>
                          </div>
                          <div className="text-4xl">💰</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100">Books Sold</p>
                            <p className="text-3xl font-bold">{classStats?.totalBooksSold}</p>
                          </div>
                          <div className="text-4xl">📚</div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-100">Avg Progress</p>
                            <p className="text-3xl font-bold">{classStats?.averageProgress}%</p>
                          </div>
                          <div className="text-4xl">📈</div>
                        </div>
                      </div>
                    </div>

                    {/* Top Performer */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performer</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🏆</span>
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">{classStats?.topPerformer}</p>
                          <p className="text-gray-600">Leading the class with outstanding performance</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
                          <div className="text-blue-600 text-2xl mb-2">📧</div>
                          <p className="font-medium text-gray-900">Send Encouragement</p>
                          <p className="text-sm text-gray-600">Motivate students</p>
                        </button>
                        <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                          <div className="text-green-600 text-2xl mb-2">📊</div>
                          <p className="font-medium text-gray-900">Generate Report</p>
                          <p className="text-sm text-gray-600">Export progress data</p>
                        </button>
                        <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                          <div className="text-purple-600 text-2xl mb-2">🎯</div>
                          <p className="font-medium text-gray-900">Set Goals</p>
                          <p className="text-sm text-gray-600">Define targets</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'students' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">Export</button>
                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send Report</button>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {student.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${student.sales.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.booksSold}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${student.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-500">{student.progress}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(student.lastActivity).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Detailed Analytics</h3>
                    
                    {/* Performance Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Sales Trend</h4>
                        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Chart placeholder - Sales over time</p>
                        </div>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Progress Distribution</h4>
                        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Chart placeholder - Student progress distribution</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Performance Insights</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600">📈</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">Class is performing above average</p>
                              <p className="text-xs text-gray-500">77.4% average progress vs 65% target</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600">🎯</span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">3 students need encouragement</p>
                              <p className="text-xs text-gray-500">Below 70% progress threshold</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
