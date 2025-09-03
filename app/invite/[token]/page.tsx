'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const [invite, setInvite] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'phone' | 'verification' | 'profile' | 'success'>('phone');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    zipCode: '',
    profilePicture: null as string | null
  });

  useEffect(() => {
    // Load invite from localStorage
    const savedInvites = localStorage.getItem('yourcitydeals_invites');
    if (savedInvites) {
      const invites = JSON.parse(savedInvites);
      const foundInvite = invites.find((inv: any) => inv.inviteToken === token);
      setInvite(foundInvite);
    }
    
    // For testing: TEST123 is always valid
    if (token === 'TEST123' && !invite) {
      setInvite({
        id: 'test-invite',
        firstName: 'Test',
        lastName: 'Seller',
        email: 'test@example.com',
        inviteToken: 'TEST123',
        status: 'pending'
      });
    }
    
    setLoading(false);
  }, [token]);

  const handleSendVerification = () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    // Check for duplicate phone number
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    if (savedSellers) {
      const sellers = JSON.parse(savedSellers);
      const existingSeller = sellers.find((seller: any) => seller.phone === phone);
      if (existingSeller) {
        alert('This phone number is already registered. Please use a different phone number or contact support if you need help.');
        return;
      }
    }

    // Check for duplicate email
    const savedInvites = localStorage.getItem('yourcitydeals_invites');
    if (savedInvites) {
      const invites = JSON.parse(savedInvites);
      const existingInvite = invites.find((inv: any) => inv.email === invite.email && inv.status === 'accepted');
      if (existingInvite) {
        alert('This email is already registered. Please use a different email or contact support if you need help.');
        return;
      }
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

      // Pre-fill profile data
      setProfileData({
        firstName: invite.firstName,
        lastName: invite.lastName,
        zipCode: '',
        profilePicture: null
      });

      setStep('profile');
    } else {
      alert('Invalid verification code. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create canvas to capture photo
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.addEventListener('loadeddata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL('image/jpeg');
        setProfileData({ ...profileData, profilePicture: photoData });
        
        stream.getTracks().forEach(track => track.stop());
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please try uploading a file instead.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileData({ ...profileData, profilePicture: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteProfile = () => {
    if (!profileData.firstName || !profileData.lastName || !profileData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    // Update seller data with profile information
    const savedSellers = localStorage.getItem('yourcitydeals_sellers');
    const sellers = JSON.parse(savedSellers);
    const updatedSellers = sellers.map((seller: any) => 
      seller.phone === phone ? { 
        ...seller, 
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        zipCode: profileData.zipCode,
        profilePicture: profileData.profilePicture,
        status: 'pending_review'
      } : seller
    );
    localStorage.setItem('yourcitydeals_sellers', JSON.stringify(updatedSellers));

    console.log('Profile completed:', profileData);
    setStep('success');
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
              Let's get your profile set up so we can review your application.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={profileData.zipCode}
                  onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your ZIP code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture (Optional)
                </label>
                <div className="space-y-2">
                  <button
                    onClick={handleTakePhoto}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Take Photo with Camera
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                      Upload Photo from Device
                    </button>
                  </div>
                </div>
                {profileData.profilePicture && (
                  <div className="mt-2">
                    <img 
                      src={profileData.profilePicture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                    <p className="text-sm text-green-600 mt-1">Photo uploaded successfully!</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleCompleteProfile}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Welcome to YourCity Deals!</h2>
            <p className="text-gray-600 mb-4">
              Your profile has been completed successfully.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-900 font-semibold">Application Submitted!</h3>
              <p className="text-green-700 text-sm mt-1">
                Your seller account is now pending review. We'll review your application and notify you via email when it's approved.
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
