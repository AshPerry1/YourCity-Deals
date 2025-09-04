'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SellerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  profilePicture: string | null;
  status: 'pending_review' | 'ready_for_review' | 'edit_requested' | 'approved' | 'rejected' | 'active';
  createdAt: string;
  inviteId: string;
}

export default function SellerDashboard() {
  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for seller authentication
    const savedAuth = localStorage.getItem('yourcitydeals_seller_auth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      if (auth.isAuthenticated && auth.sellerData) {
        setSellerData(auth.sellerData);
        setIsAuthenticated(true);
      }
    }

    // If not authenticated, check if there's a seller with completed profile
    if (!isAuthenticated) {
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      if (savedSellers) {
        const sellers = JSON.parse(savedSellers);
        const completedSeller = sellers.find((seller: any) => 
          seller.status === 'pending_review' || seller.status === 'approved' || seller.status === 'active'
        );
        if (completedSeller) {
          setSellerData(completedSeller);
          setIsAuthenticated(true);
        }
      }
    }

    setLoading(false);
  }, [isAuthenticated]);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setSellerData(null);
    localStorage.removeItem('yourcitydeals_seller_auth');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !sellerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller Access Required</h1>
          <p className="text-gray-600 mb-6">Please complete your seller profile to access the dashboard.</p>
          <Link 
            href="/invite/TEST123" 
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Complete Seller Setup
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'bg-orange-100 text-orange-800';
      case 'ready_for_review':
        return 'bg-blue-100 text-blue-800';
      case 'edit_requested':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'Pending Review';
      case 'ready_for_review':
        return 'Ready for Review';
      case 'edit_requested':
        return 'Edit Requested';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'active':
        return 'Active';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {sellerData.firstName}!</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {sellerData.profilePicture ? (
                <img 
                  src={sellerData.profilePicture} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {sellerData.firstName} {sellerData.lastName}
                </h2>
                <p className="text-sm text-gray-600">{sellerData.email}</p>
                <p className="text-sm text-gray-600">{sellerData.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sellerData.status)}`}>
                {getStatusText(sellerData.status)}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Member since {new Date(sellerData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Status-specific content */}
        {sellerData.status === 'ready_for_review' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">Profile Complete - Ready for Review!</h3>
                <p className="text-blue-700 mt-2">
                  Excellent! Your seller profile has been completed successfully and is now ready for our team to review. 
                  This typically takes 24-48 hours, and you'll receive an email notification once your application has been processed.
                </p>
                <div className="mt-4 space-y-2 text-sm text-blue-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Profile submitted on {new Date(sellerData.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Currently in review queue
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email notification will be sent upon completion
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {sellerData.status === 'edit_requested' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-orange-800">Profile Update Requested</h3>
                <p className="text-orange-700 mt-2">
                  We've reviewed your application and would like you to make some changes before we can approve it.
                </p>
                <div className="mt-4 p-4 bg-orange-100 rounded-lg">
                  <h4 className="text-orange-900 font-semibold mb-2">Requested Changes:</h4>
                  <p className="text-orange-800 text-sm">
                    {sellerData.editRequest || 'Please review your profile information and make any necessary updates.'}
                  </p>
                </div>
                <div className="mt-4">
                  <a 
                    href="/invite/TEST123" 
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {sellerData.status === 'pending_review' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">Application Under Review</h3>
                <p className="text-yellow-700 mt-2">
                  Your seller application is currently being reviewed by our team. This typically takes 24-48 hours. 
                  You'll receive an email notification once your application has been processed.
                </p>
                <div className="mt-4 space-y-2 text-sm text-yellow-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Application submitted on {new Date(sellerData.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Review typically takes 24-48 hours
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email notification will be sent upon completion
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {sellerData.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-800">Application Approved!</h3>
                <p className="text-green-700 mt-2">
                  Congratulations! Your seller application has been approved. You can now start creating and managing your deals.
                </p>
                <div className="mt-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Start Creating Deals
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {sellerData.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Application Not Approved</h3>
                <p className="text-red-700 mt-2">
                  We're sorry, but your seller application was not approved at this time. Please contact support for more information.
                </p>
                <div className="mt-4">
                  <a 
                    href="mailto:support@yourcitydeals.com" 
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {sellerData.status === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Deals</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Earned</span>
                  <span className="font-semibold">$0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Create New Deal
                </button>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  View Analytics
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  Manage Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start creating deals to see activity here</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Need help? Contact us at <a href="mailto:support@yourcitydeals.com" className="text-green-600 hover:text-green-700">support@yourcitydeals.com</a></p>
        </div>
      </div>
    </div>
  );
}
