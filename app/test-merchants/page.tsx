'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface TestMerchant {
  id: string;
  name: string;
  approval_mode: 'manual' | 'self_serve';
  offers: TestOffer[];
}

interface TestOffer {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

export default function TestMerchantsPage() {
  const [merchants, setMerchants] = useState<TestMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'manual' | 'self_serve'>('manual');
  const supabase = createClient();

  useEffect(() => {
    fetchTestMerchants();
  }, []);

  const fetchTestMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          id,
          name,
          approval_mode,
          offers (
            id,
            title,
            status,
            created_at
          )
        `)
        .in('id', [
          '550e8400-e29b-41d4-a716-446655440001',
          '550e8400-e29b-41d4-a716-446655440002'
        ]);

      if (error) throw error;
      setMerchants(data || []);
    } catch (err) {
      console.error('Error fetching merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'archived': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.draft}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getApprovalModeDescription = (mode: string) => {
    if (mode === 'manual') {
      return {
        title: 'Manual Approval Required',
        description: 'All offers must be reviewed and approved by an admin before going live.',
        benefits: [
          'Quality control and brand consistency',
          'Prevents inappropriate content',
          'Ensures compliance with guidelines'
        ],
        workflow: [
          'Merchant creates offer',
          'Offer goes to "Pending Review"',
          'Admin reviews and approves/rejects',
          'Offer goes live or is rejected with reason'
        ]
      };
    } else {
      return {
        title: 'Self-Serve Publishing',
        description: 'Merchants can publish offers immediately without admin review.',
        benefits: [
          'Faster time to market',
          'Reduced admin workload',
          'More merchant autonomy'
        ],
        workflow: [
          'Merchant creates offer',
          'Offer is published immediately',
          'Admin can review and modify later if needed',
          'Real-time publishing'
        ]
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test merchants...</p>
        </div>
      </div>
    );
  }

  const manualMerchant = merchants.find(m => m.approval_mode === 'manual');
  const selfServeMerchant = merchants.find(m => m.approval_mode === 'self_serve');
  const currentMode = getApprovalModeDescription(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Merchant Approval Workflow Test</h1>
            <p className="mt-2 text-gray-600">
              Compare Manual vs Self-Serve approval modes with real test data
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mode Toggle */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Mode Comparison</h2>
            
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'manual'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manual Mode
              </button>
              <button
                onClick={() => setActiveTab('self_serve')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'self_serve'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Self-Serve Mode
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Mode Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{currentMode.title}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  activeTab === 'manual' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {activeTab === 'manual' ? 'Manual' : 'Self-Serve'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{currentMode.description}</p>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Benefits:</h4>
                <ul className="space-y-2">
                  {currentMode.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Workflow:</h4>
                <ol className="space-y-2">
                  {currentMode.workflow.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Test Merchant Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {activeTab === 'manual' ? 'Downtown Coffee Shop' : 'Tech Startup Hub'}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Approval Mode:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === 'manual' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {activeTab === 'manual' ? 'Manual' : 'Self-Serve'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Contact:</span>
                  <span className="text-sm text-gray-600">
                    {activeTab === 'manual' ? 'merchant1@downtowncoffee.com' : 'merchant2@techhub.com'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <span className="text-sm text-gray-600">
                    {activeTab === 'manual' ? 'Downtown, CA' : 'Tech District, CA'}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Offers:</h4>
                <div className="space-y-3">
                  {(activeTab === 'manual' ? manualMerchant?.offers : selfServeMerchant?.offers)?.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{offer.title}</h5>
                        {getStatusBadge(offer.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(offer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Admin Actions</h4>
                <div className="space-y-2">
                  <a 
                    href="/admin/approvals" 
                    className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    View Approvals Queue
                  </a>
                  <a 
                    href="/admin/businesses" 
                    className="block w-full text-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Manage Businesses
                  </a>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Merchant Actions</h4>
                <div className="space-y-2">
                  <a 
                    href="/merchant/dashboard" 
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Merchant Dashboard
                  </a>
                  <a 
                    href="/merchant/offers/new" 
                    className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create New Offer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Differences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-yellow-800">Manual Mode</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Offers require admin approval before going live</li>
                  <li>• Admins receive notifications for new pending items</li>
                  <li>• Quality control and content moderation</li>
                  <li>• Slower time to market but higher quality</li>
                  <li>• Better for new or unverified merchants</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 text-green-800">Self-Serve Mode</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Offers publish immediately without review</li>
                  <li>• Faster time to market</li>
                  <li>• Reduced admin workload</li>
                  <li>• More merchant autonomy</li>
                  <li>• Better for trusted, established merchants</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
