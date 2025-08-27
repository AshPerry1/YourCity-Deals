'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import ApprovalModeBanner from '../components/ApprovalModeBanner';

interface Business {
  id: string;
  name: string;
  approval_mode: 'manual' | 'self_serve';
  email: string;
  phone: string;
  category: string;
}

interface OfferStats {
  total_offers: number;
  pending_offers: number;
  approved_offers: number;
  rejected_offers: number;
  total_book_placements: number;
  pending_placements: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';
  created_at: string;
  approved_at?: string;
  rejection_reason?: string;
}

export default function MerchantDashboard() {
  const router = useRouter();

  
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<OfferStats | null>(null);
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchantData();
  }, []);

  const fetchMerchantData = async () => {
    try {
      // Get current user's business
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's business profile
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile?.business_id) {
        setError('No business associated with this account');
        return;
      }

      // Get business details
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', userProfile.business_id)
        .single();

      if (businessError) throw businessError;
      setBusiness(businessData);

      // Get offer statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_merchant_stats', { p_merchant_id: userProfile.business_id });

      if (statsError) throw statsError;
      setStats(statsData);

      // Get recent offers
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', userProfile.business_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (offersError) throw offersError;
      setRecentOffers(offersData || []);

    } catch (err) {
      console.error('Error fetching merchant data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      pending_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const canPublishImmediately = () => {
    return business?.approval_mode === 'self_serve';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load dashboard'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Approval Mode Banner */}
      <ApprovalModeBanner businessId={business.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {business.name}</h1>
          <p className="mt-2 text-gray-600">
            Manage your offers and track your performance
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/merchant/offers/new')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Offer
              </button>
              
              <button
                onClick={() => router.push('/merchant/offers')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View All Offers
              </button>
              
              <button
                onClick={() => router.push('/merchant/analytics')}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Offers</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_offers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending_offers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.approved_offers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Book Placements</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_book_placements}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Offers */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Offers</h2>
          </div>
          <div className="overflow-hidden">
            {recentOffers.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first offer.</p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/merchant/offers/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Create Offer
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentOffers.map((offer) => (
                  <div key={offer.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{offer.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{offer.description}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          {getStatusBadge(offer.status)}
                          <span className="text-xs text-gray-400">
                            Created {new Date(offer.created_at).toLocaleDateString()}
                          </span>
                          {offer.approved_at && (
                            <span className="text-xs text-green-600">
                              Approved {new Date(offer.approved_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {offer.rejection_reason && (
                          <p className="text-xs text-red-600 mt-1">
                            Rejection reason: {offer.rejection_reason}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/merchant/offers/${offer.id}`)}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                        >
                          View
                        </button>
                        {offer.status === 'draft' && (
                          <button
                            onClick={() => router.push(`/merchant/offers/${offer.id}/edit`)}
                            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Approval Mode Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval Mode Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Mode: {business.approval_mode === 'manual' ? 'Manual' : 'Self-Serve'}</h3>
              <p className="text-sm text-gray-600">
                {business.approval_mode === 'manual' 
                  ? 'Your offers require admin approval before going live. This ensures quality control and prevents inappropriate content.'
                  : 'You can publish offers immediately without waiting for admin approval. This allows for faster updates and reduced admin workload.'
                }
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What this means:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {business.approval_mode === 'manual' ? (
                  <>
                    <li>• All new offers go to "Pending Review"</li>
                    <li>• Book placements require admin approval</li>
                    <li>• You'll be notified when offers are approved/rejected</li>
                    <li>• Quality control is maintained</li>
                  </>
                ) : (
                  <>
                    <li>• Offers can be published immediately</li>
                    <li>• Book placements may auto-approve</li>
                    <li>• Faster publishing process</li>
                    <li>• Reduced admin workload</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
