'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { mockDataService } from '../../lib/mockDataService';

export default function VerifyCoupon() {
  const params = useParams();
  const couponToken = params.couponToken as string;
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    status: 'checking' | 'valid' | 'invalid' | 'used' | 'expired';
  }>({
    valid: false,
    message: '',
    status: 'checking'
  });

  useEffect(() => {
    verifyCoupon();
  }, [couponToken]);

  const verifyCoupon = async () => {
    if (!couponToken) {
      setVerificationResult({
        valid: false,
        message: '❌ Invalid coupon token',
        status: 'invalid'
      });
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock verification logic
    const random = Math.random();
    if (random > 0.7) {
      setVerificationResult({
        valid: true,
        message: '✅ Valid & Redeemed Now',
        status: 'valid'
      });
    } else if (random > 0.5) {
      setVerificationResult({
        valid: false,
        message: '❌ Already Used',
        status: 'used'
      });
    } else {
      setVerificationResult({
        valid: false,
        message: '❌ Expired/Invalid',
        status: 'expired'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Coupon Verification</h1>
            <p className="text-gray-600 mb-6">Verifying coupon: {couponToken}</p>
            
            {verificationResult.status === 'checking' && (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Verifying coupon...</p>
              </div>
            )}
            
            {verificationResult.status !== 'checking' && (
              <div className={`p-6 rounded-lg text-center ${
                verificationResult.status === 'valid' ? 'bg-green-100 text-green-800' :
                verificationResult.status === 'used' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className="text-4xl mb-4">
                  {verificationResult.status === 'valid' ? '✅' :
                   verificationResult.status === 'used' ? '⚠️' : '❌'}
                </div>
                <p className="text-xl font-semibold mb-2">{verificationResult.message}</p>
                <p className="text-sm opacity-75">
                  {verificationResult.status === 'valid' ? 'Coupon has been successfully redeemed.' :
                   verificationResult.status === 'used' ? 'This coupon has already been used.' :
                   'This coupon is not valid or has expired.'}
                </p>
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
