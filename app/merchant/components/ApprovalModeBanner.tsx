'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

interface ApprovalModeBannerProps {
  businessId: string;
}

interface Business {
  id: string;
  name: string;
  approval_mode: 'manual' | 'self_serve';
}

export default function ApprovalModeBanner({ businessId }: ApprovalModeBannerProps) {
  const supabase = createClient();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, approval_mode')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (err) {
      console.error('Error fetching business data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return null;
  }

  const isManualMode = business.approval_mode === 'manual';

  return (
    <div className={`border-b ${
      isManualMode 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-green-50 border-green-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${
              isManualMode ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {isManualMode ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                isManualMode ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {isManualMode ? 'Manual Mode Active' : 'Self-Serve Mode Active'}
              </h3>
              <p className={`text-sm ${
                isManualMode ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {isManualMode 
                  ? 'All new offers and book placements require admin approval before going live.'
                  : 'Your offers can be published immediately. Book placements may auto-approve depending on book settings.'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isManualMode 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isManualMode ? 'Manual' : 'Self-Serve'}
            </span>
            
            {isManualMode && (
              <div className="text-xs text-yellow-600">
                <svg className="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Review Required
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
