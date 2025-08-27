'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Business {
  id: string;
  name: string;
  approval_mode: 'manual' | 'self_serve';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

interface ApprovalHistory {
  id: string;
  action: string;
  new_values: any;
  created_at: string;
  user_email?: string;
}

export default function ApprovalModePage() {
  const params = useParams();
  const router = useRouter();

  
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const businessId = params.id as string;

  useEffect(() => {
    fetchBusinessData();
    fetchApprovalHistory();
  }, [businessId]);

  const fetchBusinessData = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          id,
          name,
          approval_mode,
          approved_by,
          approved_at,
          created_at
        `)
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (err) {
      setError('Failed to load business data');
      console.error('Error fetching business:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          id,
          action,
          new_values,
          created_at,
          user_id
        `)
        .eq('table_name', 'businesses')
        .eq('record_id', businessId)
        .in('action', ['SET_APPROVAL_MODE', 'UPDATE'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails for the history
      const userIds = Array.from(new Set(data?.map(item => item.user_id).filter(Boolean) || []));
      const { data: users } = await supabase
        .from('auth.users')
        .select('id, email')
        .in('id', userIds);

      const userMap = new Map(users?.map(u => [u.id, u.email]) || []);

      setApprovalHistory(
        data?.map(item => ({
          ...item,
          user_email: userMap.get(item.user_id) || 'Unknown User'
        })) || []
      );
    } catch (err) {
      console.error('Error fetching approval history:', err);
    }
  };

  const toggleApprovalMode = async () => {
    if (!business) return;

    setUpdating(true);
    setError(null);

    try {
      const newMode = business.approval_mode === 'manual' ? 'self_serve' : 'manual';
      
      const { error } = await supabase.rpc('set_merchant_approval_mode', {
        p_business_id: businessId,
        p_mode: newMode
      });

      if (error) throw error;

      // Refresh data
      await fetchBusinessData();
      await fetchApprovalHistory();
      
    } catch (err) {
      setError('Failed to update approval mode');
      console.error('Error updating approval mode:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getModeDescription = (mode: string) => {
    return mode === 'manual' 
      ? 'All offers and book placements require admin approval before going live.'
      : 'Offers can be published immediately. Book placements may auto-approve depending on book settings.';
  };

  const getModeBenefits = (mode: string) => {
    return mode === 'manual' 
      ? ['Quality control', 'Content review', 'Prevents inappropriate content']
      : ['Faster publishing', 'Reduced admin workload', 'Immediate updates'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business data...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Go Back
          </button>
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
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Approval Mode: {business.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Mode Card */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Current Mode</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  business.approval_mode === 'manual' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {business.approval_mode === 'manual' ? 'Manual' : 'Self-Serve'}
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {getModeDescription(business.approval_mode)}
              </p>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h3>
                <ul className="space-y-1">
                  {getModeBenefits(business.approval_mode).map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={toggleApprovalMode}
                disabled={updating}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  business.approval_mode === 'manual'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  `Switch to ${business.approval_mode === 'manual' ? 'Self-Serve' : 'Manual'} Mode`
                )}
              </button>
            </div>
          </div>

          {/* Mode Comparison */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mode Comparison</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Manual Mode</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• All offers require admin approval</li>
                    <li>• Book placements need review</li>
                    <li>• Quality control maintained</li>
                    <li>• Slower publishing process</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Self-Serve Mode</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Offers can publish immediately</li>
                    <li>• Book placements may auto-approve</li>
                    <li>• Faster publishing process</li>
                    <li>• Reduced admin workload</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval History */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h2>
            
            {approvalHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No approval history found.</p>
            ) : (
              <div className="space-y-4">
                {approvalHistory.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.action === 'SET_APPROVAL_MODE' 
                            ? `Mode changed to ${item.new_values?.approval_mode || 'unknown'}`
                            : 'Business updated'
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          by {item.user_email} • {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
