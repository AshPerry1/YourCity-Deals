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
    
    // For testing: TEST123 is always valid - but we need to find the actual invite
    if (token === 'TEST123' && !invite) {
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      if (savedInvites) {
        const invites = JSON.parse(savedInvites);
        const testInvite = invites.find((inv: any) => inv.inviteToken === 'TEST123');
        if (testInvite) {
          setInvite(testInvite);
        } else {
          // Fallback if no TEST123 invite exists
          setInvite({
            id: 'test-invite',
            firstName: 'Test',
            lastName: 'Seller',
            email: 'test@example.com',
            inviteToken: 'TEST123',
            status: 'pending'
          });
        }
      } else {
        // Fallback if no invites exist
        setInvite({
          id: 'test-invite',
          firstName: 'Test',
          lastName: 'Seller',
          email: 'test@example.com',
          inviteToken: 'TEST123',
          status: 'pending'
        });
      }
    }
    
    setLoading(false);
  }, [token]);

  const handleSendVerification = () => {
    if (!phone) {
      alert('Please enter your phone number');
      return;
    }

    // For TEST123, skip duplicate checks for testing purposes
    if (token === 'TEST123') {
      // Mock Twilio SMS - always send "123456"
      console.log(`SMS sent to ${phone}: Your verification code is 123456`);
      setShowVerification(true);
      setStep('verification');
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

    // Check if this specific invite has already been used with a different phone
    if (invite && invite.id) {
      const savedSellers = localStorage.getItem('yourcitydeals_sellers');
      if (savedSellers) {
        const sellers = JSON.parse(savedSellers);
        const existingInviteUsage = sellers.find((seller: any) => seller.inviteId === invite.id);
        if (existingInviteUsage) {
          alert('This invite has already been used. Please contact support if you need a new invite.');
          return;
        }
      }
    }

    // Check for duplicate email - only if we have a real invite with email
    if (invite && invite.email && invite.email !== 'test@example.com') {
      const savedInvites = localStorage.getItem('yourcitydeals_invites');
      if (savedInvites) {
        const invites = JSON.parse(savedInvites);
        const existingInvite = invites.find((inv: any) => 
          inv.email === invite.email && 
          inv.status === 'accepted' && 
          inv.id !== invite.id
        );
        if (existingInvite) {
          alert('This email is already registered. Please use a different email or contact support if you need help.');
          return;
        }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to YourCity Deals!</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Hi {invite?.firstName || 'there'}, you've been invited to become a seller!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-600">
              {step === 'phone' ? 'Step 1 of 3' : step === 'verification' ? 'Step 2 of 3' : 'Step 3 of 3'}
            </span>
            <span className="text-sm text-gray-500">
              {step === 'phone' ? 'Phone Verification' : step === 'verification' ? 'Code Verification' : 'Profile Setup'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ 
              width: step === 'phone' ? '33%' : step === 'verification' ? '66%' : '100%' 
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

                  {step === 'phone' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Verification</h2>
                <p className="text-gray-600">
                  We'll send you a verification code to confirm your phone number.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <button
                  onClick={handleSendVerification}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Send Verification Code
                </button>
              </div>
            </div>
          )}

                  {step === 'verification' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
                <p className="text-gray-600">
                  We sent a verification code to {phone}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Test code: <strong className="text-green-600">123456</strong>
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <button
                  onClick={handleVerifyCode}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verify Code
                </button>
              </div>
            </div>
          )}

                  {step === 'profile' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Seller Profile</h2>
                <p className="text-gray-600">
                  You're almost ready to start selling! Let's get your profile set up so we can review your application and get you started.
                </p>
              </div>

              <div className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This information helps us verify your identity and connect you with local opportunities.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter your ZIP code"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We use this to connect you with local businesses and opportunities in your area.
                    </p>
                  </div>
                </div>

                {/* Profile Picture Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Profile Picture (Optional)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add a professional photo to help build trust with your customers. This is optional but recommended.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleTakePhoto}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Take Photo with Camera
                    </button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload Photo from Device
                      </button>
                    </div>
                  </div>
                  
                  {profileData.profilePicture && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <img 
                          src={profileData.profilePicture} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-green-800">Photo uploaded successfully!</p>
                          <p className="text-xs text-green-600">Your profile picture is ready.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Steps Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• We'll review your application within 24-48 hours</li>
                    <li>• You'll receive an email notification when approved</li>
                    <li>• Once approved, you can start creating and selling deals</li>
                    <li>• We'll help you get set up with your first campaign</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCompleteProfile}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Profile & Submit Application
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to YourCity Deals!</h2>
                <p className="text-gray-600">
                  Your profile has been completed successfully.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-900 font-semibold">Application Submitted!</h3>
                <p className="text-green-700 text-sm mt-1">
                  Your seller account is now pending review. We'll review your application and notify you via email when it's approved.
                </p>
              </div>
              
              <div className="text-center">
                <a href="/" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  ← Back to Marketplace
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
