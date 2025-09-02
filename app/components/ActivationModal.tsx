'use client';

import React, { useEffect, useState } from 'react';

interface CouponOffer {
  id: string;
  title: string;
  business: string;
  discount: string;
  description: string;
  businessAddress: string;
}

interface ActivationModalProps {
  coupon: CouponOffer;
  timer: number;
  onClose: () => void;
  onVerify: () => void;
}

export default function ActivationModal({ coupon, timer, onClose, onVerify }: ActivationModalProps) {
  const [qrCode, setQrCode] = useState('');
  const [shortCode, setShortCode] = useState('');

  useEffect(() => {
    // Generate mock QR code and short code
    const mockQrCode = `https://yourcitydeals.com/verify/${coupon.id}-${Date.now()}`;
    const mockShortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setQrCode(mockQrCode);
    setShortCode(mockShortCode);
  }, [coupon.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds: number) => {
    if (seconds > 60) return 'text-green-600';
    if (seconds > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Show to Cashier</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold ${getTimerColor(timer)} mb-2`}>
              {formatTime(timer)}
            </div>
            <p className="text-sm text-gray-600">
              {timer > 60 ? 'Time remaining' : 'Expiring soon!'}
            </p>
          </div>

          {/* Coupon Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-1">{coupon.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{coupon.business}</p>
            <div className="text-2xl font-bold text-blue-600">{coupon.discount}</div>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
            </div>
          </div>

          {/* Short Code */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">Or enter this code:</p>
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-2xl font-mono font-bold text-gray-900">{shortCode}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to redeem:</p>
                <ul className="space-y-1">
                  <li>• Show this screen to the cashier</li>
                  <li>• They'll scan the QR code or enter the short code</li>
                  <li>• Coupon will be automatically redeemed</li>
                  <li>• Timer will reset if not verified within 3 minutes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onVerify}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-colors"
            >
              Mark as Used
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
