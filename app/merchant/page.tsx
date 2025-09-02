'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';

// Merchant Owner Dashboard
function MerchantOwnerDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@restaurant.com', pin: '1234', role: 'Cashier' },
    { id: 2, name: 'Mike Chen', email: 'mike@restaurant.com', pin: '5678', role: 'Manager' },
  ]);

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'staff', name: 'Staff Management', icon: '👥' },
    { id: 'redemptions', name: 'Recent Redemptions', icon: '🎫' },
  ];

  return (
    <div className="space-y-6">
      {/* Content sections only - header is provided by UniversalPortalLayout */}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Create New Offer</h3>
              <p className="text-purple-100 mb-4">Build coupons for your customers</p>
              <a
                href="/merchant/offers/new"
                className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span className="mr-2">➕</span>
                Create Offer
              </a>
            </div>
                            <div className="text-4xl">
                  <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Verify Coupons</h3>
              <p className="text-green-100 mb-4">Scan or manually verify redemptions</p>
              <a
                href="/merchant/verify"
                className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <span className="mr-2">🎫</span>
                Verify Now
              </a>
            </div>
            <div className="text-4xl">📱</div>
          </div>
        </div>
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
                    ? 'border-purple-500 text-purple-600'
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
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Redemptions</p>
                      <p className="text-3xl font-bold">1,247</p>
                    </div>
                    <div className="text-4xl">🎫</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Revenue Generated</p>
                      <p className="text-3xl font-bold">$12,450</p>
                    </div>
                    <div className="text-4xl">💰</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Active Offers</p>
                      <p className="text-3xl font-bold">15</p>
                    </div>
                    <div className="text-4xl">🏷️</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Coupon redeemed - 50% off meal</span>
                    </div>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">New staff member added</span>
                    </div>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
                <button className="btn-primary">Add Staff Member</button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {staffMembers.map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.pin}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'redemptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Redemptions</h3>
                <a
                  href="/merchant/verify"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span className="mr-2">🎫</span>
                  Verify New Coupon
                </a>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">50% off meal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@email.com</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sarah Johnson</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-01-15</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Verified</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Merchant Staff Dashboard (Simplified)
function MerchantStaffDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupon Verification</h1>
        <p className="text-gray-600 mt-2">Verify customer coupons quickly and securely</p>
      </div>

      {/* Quick Verification */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verify Coupon</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              placeholder="Enter 8-digit code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="btn-primary w-full">Verify Coupon</button>
        </div>
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Verifications</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">50% off meal</p>
              <p className="text-sm text-gray-500">Code: ABC12345</p>
            </div>
            <span className="text-xs text-gray-500">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Free dessert</p>
              <p className="text-sm text-gray-500">Code: XYZ67890</p>
            </div>
            <span className="text-xs text-gray-500">15 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Merchant Page with Role Detection
export default function MerchantPage() {
  const userRole = UserRole.MERCHANT_OWNER; // Simplified for demo mode

  return (
    <div className="p-6">
      {userRole === UserRole.MERCHANT_OWNER ? (
        <MerchantOwnerDashboard />
      ) : (
        <MerchantStaffDashboard />
      )}
    </div>
  );
}
