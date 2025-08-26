'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import { TargetingRule, CouponTargetingRule, UserProfile } from '@/lib/types';
import { TargetingEngine } from '@/lib/targeting';
import Link from 'next/link';

export default function TargetingManagementPage() {
  const [targetingRules, setTargetingRules] = useState<CouponTargetingRule[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock targeting rules
      const mockRules: CouponTargetingRule[] = [
        {
          id: '1',
          name: 'New Users Welcome',
          description: 'Free coffee for first-time users',
          conditions: {
            any: [
              { field: 'signup_date', operator: 'greater_than', value: '2025-01-01' }
            ]
          },
          active: true,
          created_at: '2025-01-10',
          updated_at: '2025-01-10',
          coupon_id: 'coffee-coupon-1',
          max_grants: 100,
          current_grants: 45,
          auto_run: true,
          run_frequency: 'daily',
          last_run: '2025-01-15',
          next_run: '2025-01-16'
        },
        {
          id: '2',
          name: 'Local Area Promotion',
          description: 'Restaurant deals for nearby zip codes',
          conditions: {
            any: [
              { field: 'zip_code', operator: 'in', value: ['35223', '35213', '35214'] }
            ]
          },
          active: true,
          created_at: '2025-01-08',
          updated_at: '2025-01-08',
          coupon_id: 'restaurant-coupon-1',
          max_grants: 200,
          current_grants: 78,
          auto_run: true,
          run_frequency: 'weekly',
          last_run: '2025-01-12',
          next_run: '2025-01-19'
        },
        {
          id: '3',
          name: 'Referral Rewards',
          description: 'Bonus for users with referral codes',
          conditions: {
            any: [
              { field: 'referrer_code', operator: 'not_in', value: [''] }
            ]
          },
          active: false,
          created_at: '2025-01-05',
          updated_at: '2025-01-05',
          coupon_id: 'referral-bonus-1',
          max_grants: 50,
          current_grants: 12,
          auto_run: false,
          run_frequency: 'once',
          last_run: '2025-01-05'
        }
      ];

      // Mock users
      const mockUsers: UserProfile[] = [
        {
          id: '1',
          user_id: 'user1',
          email: 'john@email.com',
          name: 'John Doe',
          zip_code: '35223',
          school_id: 'school1',
          grade: '10',
          signup_date: '2025-01-15',
          last_activity: '2025-01-15'
        },
        {
          id: '2',
          user_id: 'user2',
          email: 'jane@email.com',
          name: 'Jane Smith',
          zip_code: '35213',
          school_id: 'school1',
          grade: '11',
          referrer_code: 'STU_ABC123',
          signup_date: '2025-01-10',
          last_activity: '2025-01-14'
        },
        {
          id: '3',
          user_id: 'user3',
          email: 'bob@email.com',
          name: 'Bob Johnson',
          zip_code: '35225',
          school_id: 'school2',
          grade: '9',
          signup_date: '2024-12-20',
          last_activity: '2025-01-13'
        }
      ];

      setTargetingRules(mockRules);
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'rules', name: 'Targeting Rules', icon: '🎯' },
    { id: 'performance', name: 'Performance', icon: '📊' },
    { id: 'users', name: 'User Profiles', icon: '👥' },
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
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Coupon Targeting Management</h1>
          <p className="text-gray-600 mt-2">Manage targeted coupon distribution based on user data</p>
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
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Targeting Rules</h3>
                  <Link
                    href="/admin/targeting/create"
                    className="btn-primary"
                  >
                    Create New Rule
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {targetingRules.map((rule) => (
                    <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{rule.name}</h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rule.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.active ? 'Active' : 'Inactive'}
                          </span>
                          <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{rule.current_grants}</p>
                          <p className="text-xs text-gray-500">Grants Used</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{rule.max_grants || '∞'}</p>
                          <p className="text-xs text-gray-500">Max Grants</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{rule.run_frequency}</p>
                          <p className="text-xs text-gray-500">Frequency</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {rule.auto_run ? 'Auto' : 'Manual'}
                          </p>
                          <p className="text-xs text-gray-500">Run Mode</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Last run: {rule.last_run ? new Date(rule.last_run).toLocaleDateString() : 'Never'}
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Preview
                          </button>
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                            Run Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Targeting Performance</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Targeted Grants</p>
                        <p className="text-3xl font-bold">1,247</p>
                      </div>
                      <div className="text-4xl">🎯</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Conversion Rate</p>
                        <p className="text-3xl font-bold">23.4%</p>
                      </div>
                      <div className="text-4xl">📈</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Revenue Generated</p>
                        <p className="text-3xl font-bold">$12,450</p>
                      </div>
                      <div className="text-4xl">💰</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Performance by Grant Type</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Purchased</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">45.2% conversion</p>
                        <p className="text-xs text-gray-500">$8,750 revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Targeted</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">23.4% conversion</p>
                        <p className="text-xs text-gray-500">$2,450 revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-gray-900">Gifted</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">18.7% conversion</p>
                        <p className="text-xs text-gray-500">$1,250 revenue</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">User Profiles</h3>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.name?.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.zip_code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.grade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.referrer_code ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {user.referrer_code}
                              </span>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.signup_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
