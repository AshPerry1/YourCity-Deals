'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

interface PendingItem {
  type: 'offer' | 'book_placement';
  id: string;
  item_name: string;
  merchant_name: string;
  status: string;
  created_at: string;
  submitted_by: string;
  rejection_reason?: string;
}

interface ApprovalStats {
  total_pending: number;
  pending_offers: number;
  pending_placements: number;
  approved_today: number;
  rejected_today: number;
}

export default function ApprovalsQueuePage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [stats, setStats] = useState<ApprovalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'offer' | 'book_placement'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingApprovals();
    fetchStats();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingItems(data || []);
    } catch (err) {
      console.error('Error fetching pending approvals:', err);
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Count pending offers
      const { count: pendingOffers } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_review');

      // Count pending book placements
      const { count: pendingPlacements } = await supabase
        .from('book_offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Count approved today
      const { count: approvedToday } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
        .gte('approved_at', today);

      // Count rejected today
      const { count: rejectedToday } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')
        .gte('approved_at', today);

      setStats({
        total_pending: (pendingOffers || 0) + (pendingPlacements || 0),
        pending_offers: pendingOffers || 0,
        pending_placements: pendingPlacements || 0,
        approved_today: approvedToday || 0,
        rejected_today: rejectedToday || 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleApprove = async (item: PendingItem, reason?: string) => {
    setProcessing(item.id);
    setError(null);

    try {
      if (item.type === 'offer') {
        const { error } = await supabase.rpc('approve_offer', {
          p_offer_id: item.id,
          p_approved: true,
          p_reason: reason
        });
        if (error) throw error;
      } else {
        // Approve book placement
        const { error } = await supabase
          .from('book_offers')
          .update({
            status: 'approved',
            approved_by: (await supabase.auth.getUser()).data.user?.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', item.id);
        if (error) throw error;
      }

      // Refresh data
      await fetchPendingApprovals();
      await fetchStats();
    } catch (err) {
      console.error('Error approving item:', err);
      setError('Failed to approve item');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (item: PendingItem, reason: string) => {
    if (!reason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setProcessing(item.id);
    setError(null);

    try {
      if (item.type === 'offer') {
        const { error } = await supabase.rpc('approve_offer', {
          p_offer_id: item.id,
          p_approved: false,
          p_reason: reason
        });
        if (error) throw error;
      } else {
        // Reject book placement
        const { error } = await supabase
          .from('book_offers')
          .update({
            status: 'removed',
            rejection_reason: reason
          })
          .eq('id', item.id);
        if (error) throw error;
      }

      // Refresh data
      await fetchPendingApprovals();
      await fetchStats();
    } catch (err) {
      console.error('Error rejecting item:', err);
      setError('Failed to reject item');
    } finally {
      setProcessing(null);
    }
  };

  const filteredItems = pendingItems.filter(item => 
    filterType === 'all' || item.type === filterType
  );

  const getTypeBadge = (type: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        type === 'offer' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-purple-100 text-purple-800'
      }`}>
        {type === 'offer' ? 'Offer' : 'Book Placement'}
      </span>
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Approvals Queue</h1>
              <p className="text-sm text-gray-600">Review and manage pending offers and book placements</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Offers</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending_offers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Placements</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending_placements}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Approved Today</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.approved_today}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rejected Today</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.rejected_today}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'offer' | 'book_placement')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Items</option>
              <option value="offer">Offers Only</option>
              <option value="book_placement">Book Placements Only</option>
            </select>
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pending Approvals ({filteredItems.length})
            </h2>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterType !== 'all' 
                  ? `No pending ${filterType === 'offer' ? 'offers' : 'book placements'} found.`
                  : 'All items have been reviewed.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <PendingItemCard
                  key={item.id}
                  item={item}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  processing={processing === item.id}
                  getTypeBadge={getTypeBadge}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pending Item Card Component
interface PendingItemCardProps {
  item: PendingItem;
  onApprove: (item: PendingItem, reason?: string) => void;
  onReject: (item: PendingItem, reason: string) => void;
  processing: boolean;
  getTypeBadge: (type: string) => JSX.Element;
}

function PendingItemCard({ item, onApprove, onReject, processing, getTypeBadge }: PendingItemCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(item, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {getTypeBadge(item.type)}
            <h3 className="text-lg font-medium text-gray-900">{item.item_name}</h3>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Merchant:</strong> {item.merchant_name}</p>
            <p><strong>Submitted by:</strong> {item.submitted_by}</p>
            <p><strong>Submitted:</strong> {new Date(item.created_at).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onApprove(item)}
            disabled={processing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Approve'
            )}
          </button>
          
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={processing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject {item.type === 'offer' ? 'Offer' : 'Book Placement'}</h3>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Please provide a reason for rejection..."
            />
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
