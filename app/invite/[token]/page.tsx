'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const [invite, setInvite] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'phone' | 'verification' | 'profile'>('phone');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Load invite from localStorage
    const savedInvites = localStorage.getItem('yourcitydeals_invites');
    if (savedInvites) {
      const invites = JSON.parse(savedInvites);
      const foundInvite = invites.find((inv: any) => inv.inviteToken === token);
      setInvite(foundInvite);
    }
    setLoading(false);
  }, [token]);

  const handleSendVerification = () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    // Mock Twilio SMS - always send "123456"
    console.log(`SMS sent to ${phone}: Your verification code is 123456`);
    setShowVerification(true);
    setStep('verification');
  };

  const handleVerifyCode = () => {
    if (verificationCode === '123456') {
      // Save seller data to localStorage
      const sellerData = {
        id: Date.now().toString(),
        inviteId: invite.id,
        phone: phone,
        firstName: invite.firstName,
        lastName: invite.lastName,
        status: 'pending_review',
        createdAt: new Date().toISOString()
      };

      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      const sellers = savedSellers ? JSON.parse(savedSellers) : [];
      sellers.push(sellerData);
      localStorage.setItem('yourcitydeals_sellers', JSON.stringify(sellers));

      // Update invite status
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      const invites = JSON.parse(savedInvites);
      const updatedInvites = invites.map((inv: any) => 
        inv.id === invite.id ? { ...inv, status: 'accepted', acceptedAt: new Date().toISOString() } : inv
      );
      localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));

      setStep('profile');
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Invite</h1>
          <p className="text-gray-600 mb-6">This invite link is invalid or has expired.</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to YourCity Deals!</h1>
          <p className="mt-2 text-gray-600">
            Hi {invite.firstName}, you've been invited to become a seller!
          </p>
        </div>

        {step === 'phone' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Phone Verification</h2>
            <p className="text-gray-600 mb-4">
              We'll send you a verification code to confirm your phone number.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleSendVerification}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Verification Code
              </button>
            </div>
          </div>
        )}

        {step === 'verification' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Enter Verification Code</h2>
            <p className="text-gray-600 mb-4">
              We sent a verification code to {phone}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Test code: <strong>123456</strong>
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                onClick={handleVerifyCode}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Verify Code
              </button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Complete Your Profile</h2>
            <p className="text-gray-600 mb-4">
              Your account is being reviewed. You'll be notified when it's approved.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-900 font-semibold">Account Created Successfully!</h3>
              <p className="text-green-700 text-sm mt-1">
                Your seller account is now pending review. You'll receive an email when it's approved.
              </p>
            </div>
            
            <div className="mt-4">
              <a href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ← Back to Marketplace
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
