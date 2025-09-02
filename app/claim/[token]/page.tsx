'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockDataService } from '../../../lib/mockDataService';

export default function ClaimCoupon() {
  const params = useParams();
  const router = useRouter();
  const claimToken = params.token as string;
  const [claimResult, setClaimResult] = useState<{
    success: boolean;
    message: string;
    status: 'checking' | 'success' | 'error' | 'expired' | 'already-claimed';
  }>({
    success: false,
    message: '',
    status: 'checking'
  });

  useEffect(() => {
    claimCoupon();
  }, [claimToken]);

  const claimCoupon = async () => {
    if (!claimToken) {
      setClaimResult({
        success: false,
        message: 'Invalid claim token',
        status: 'error'
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock claim logic
    const random = Math.random();
    if (random > 0.8) {
      setClaimResult({
        success: true,
        message: '🎉 Coupon claimed successfully!',
        status: 'success'
      });
    } else if (random > 0.6) {
      setClaimResult({
        success: false,
        message: '⏰ This claim link has expired',
        status: 'expired'
      });
    } else {
      setClaimResult({
        success: false,
        message: '❌ This coupon has already been claimed',
        status: 'already-claimed'
      });
    }
  };

  const goToApp = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim Your Coupon</h1>
            <p className="text-gray-600 mb-6">Processing your claim...</p>
            
            {claimResult.status === 'checking' && (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Processing claim...</p>
              </div>
            )}
            
            {claimResult.status !== 'checking' && (
              <div className={`p-6 rounded-lg text-center ${
                claimResult.status === 'success' ? 'bg-green-100 text-green-800' :
                claimResult.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className="text-4xl mb-4">
                  {claimResult.status === 'success' ? '🎉' :
                   claimResult.status === 'expired' ? '⏰' : '❌'}
                </div>
                <p className="text-xl font-semibold mb-2">{claimResult.message}</p>
                <p className="text-sm opacity-75 mb-6">
                  {claimResult.status === 'success' ? 'Your coupon has been added to your wallet.' :
                   claimResult.status === 'expired' ? 'This claim link has expired. Please request a new one.' :
                   'This coupon has already been claimed by someone else.'}
                </p>
                
                {claimResult.status === 'success' && (
                  <button
                    onClick={goToApp}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to YourCity Deals
                  </button>
                )}
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Powered by YourCity Deals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
