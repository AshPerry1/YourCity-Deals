'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  const [invite, setInvite] = useState<any>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'pwa' | 'phone' | 'verification' | 'profile' | 'ready_for_review' | 'success'>('pwa');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    zipCode: '',
    profilePicture: null as string | null
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sellerAccount, setSellerAccount] = useState<any>(null);

  useEffect(() => {
    console.log('Loading invite for token:', token);
    
    const loadInvite = async () => {
      try {
        console.log('Starting invite load process...');
        // Check for existing authentication
        const savedAuth = localStorage.getItem('yourcitydeals_seller_auth');
        if (savedAuth) {
          const auth = JSON.parse(savedAuth);
          if (auth.isAuthenticated && auth.sellerData) {
            setIsAuthenticated(true);
            setSellerAccount(auth.sellerData);
            console.log('Found existing authentication:', auth.sellerData);
          }
        }
        
        console.log('Loading invite from Supabase for token:', token);
        // Try to load from Supabase first
        const { data: supabaseInvite, error } = await supabase
          .from('seller_invites')
          .select('*')
          .eq('token', token)
          .single();

        console.log('Supabase response:', { data: supabaseInvite, error });
        
        if (supabaseInvite && !error) {
          console.log('Found invite in Supabase:', supabaseInvite);
          setInvite(supabaseInvite);
          setLoading(false);
          return;
        }

        console.log('No invite found in Supabase, checking localStorage...');
        // Fallback to localStorage
        const savedInvites = localStorage.getItem('yourcitydeals_seller_invites');
        console.log('Saved invites from localStorage:', savedInvites);
        if (savedInvites) {
          const invites = JSON.parse(savedInvites);
          const foundInvite = invites.find((inv: any) => inv.token === token);
          console.log('Found invite from localStorage:', foundInvite);
          
          if (foundInvite) {
            console.log('Setting found invite:', foundInvite);
            setInvite(foundInvite);
            setLoading(false);
            return;
          }
        }
        
        // For testing: TEST123 is always valid - create fallback invite
        if (token === 'TEST123') {
          console.log('TEST123 token detected, creating fallback invite');
          const fallbackInvite = {
            id: 'test-invite',
            first_name: 'Ash',
            last_name: 'Perry',
            email: 'adperry18@gmail.com',
            token: 'TEST123',
            status: 'pending',
            organizationHub: 'Mountain Brook High School',
            couponBook: 'Birmingham Restaurant Deals',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          console.log('Setting fallback invite:', fallbackInvite);
          setInvite(fallbackInvite);
          setLoading(false);
          return;
        }
        
        console.log('No invite found, setting loading to false');
        setLoading(false);
      } catch (error) {
        console.error('Error loading invite:', error);
        console.error('Error details:', error.message);
        setLoading(false);
      }
    };
    
    loadInvite();
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
    console.log('Verification attempt:', {
      verificationCode,
      expectedCode: '123456',
      invite: invite,
      phone: phone,
      step: step
    });

    if (verificationCode === '123456') {
      console.log('Code verified successfully, proceeding to profile setup');
      
      // Save seller data to localStorage
      const sellerData = {
        id: Date.now().toString(),
        inviteId: invite.id,
        phone: phone,
        firstName: invite.firstName,
        lastName: invite.lastName,
        status: 'ready_for_review',
        createdAt: new Date().toISOString()
      };

      console.log('Seller data to save:', sellerData);

      try {
        const savedSellers = localStorage.getItem('yourcitydeals_sellers');
        const sellers = savedSellers ? JSON.parse(savedSellers) : [];
        sellers.push(sellerData);
        localStorage.setItem('yourcitydeals_sellers', JSON.stringify(sellers));
        console.log('Seller data saved successfully');

        // Update invite status
        const savedInvites = localStorage.getItem('yourcitydeals_invites');
        if (savedInvites) {
          const invites = JSON.parse(savedInvites);
          const updatedInvites = invites.map((inv: any) => 
            inv.id === invite.id ? { ...inv, status: 'accepted', acceptedAt: new Date().toISOString() } : inv
          );
          localStorage.setItem('yourcitydeals_invites', JSON.stringify(updatedInvites));
          console.log('Invite status updated successfully');
        }

        // Pre-fill profile data
        setProfileData({
          firstName: invite.firstName,
          lastName: invite.lastName,
          zipCode: '',
          profilePicture: null
        });

        console.log('Setting step to profile');
        setStep('profile');
        console.log('Step set to profile successfully');
      } catch (error) {
        console.error('Error during verification:', error);
        alert('There was an error processing your verification. Please try again.');
      }
    } else {
      console.log('Invalid code entered:', verificationCode);
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

  const handleCompleteProfile = async () => {
    console.log('Starting profile completion...');
    console.log('Profile data:', profileData);
    console.log('Phone:', phone);
    console.log('Invite:', invite);
    
    if (!profileData.firstName || !profileData.lastName || !profileData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      console.log('Creating profile data to save...');
      // Create or update seller profile in Supabase
      const profileDataToSave = {
        invite_id: invite.id || 'test-invite',
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: invite.email,
        phone: phone,
        zip_code: profileData.zipCode,
        profile_picture_url: profileData.profilePicture,
        status: 'ready_for_review' as const,
        profile_completed_at: new Date().toISOString()
      };
      console.log('Profile data to save:', profileDataToSave);

      // Save profile to Supabase
      const { data: profile, error: profileError } = await supabase
        .from('seller_profiles')
        .upsert(profileDataToSave, { 
          onConflict: 'invite_id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error saving profile to Supabase:', profileError);
        throw profileError;
      }

      console.log('Profile saved to Supabase:', profile);

      // Update invite status in Supabase
      const { error: inviteError } = await supabase
        .from('seller_invites')
        .update({
          status: 'ready_for_review',
          updated_at: new Date().toISOString(),
          profile_completed_at: new Date().toISOString(),
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: phone,
          zip_code: profileData.zipCode,
          profile_picture_url: profileData.profilePicture,
          profile_completed: true
        })
        .eq('token', token);

      if (inviteError) {
        console.error('Error updating invite in Supabase:', inviteError);
        throw inviteError;
      }

      console.log('Invite updated in Supabase');

      // Also save to localStorage as fallback
      console.log('Saving to localStorage as fallback...');
      const savedProfiles = localStorage.getItem('yourcitydeals_seller_profiles');
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
      const existingProfile = profiles.find((p: any) => p.invite_id === (invite.id || 'test-invite'));
      
      if (existingProfile) {
        const updatedProfiles = profiles.map((p: any) => 
          p.invite_id === (invite.id || 'test-invite') ? { ...p, ...profileDataToSave, updated_at: new Date().toISOString() } : p
        );
        localStorage.setItem('yourcitydeals_seller_profiles', JSON.stringify(updatedProfiles));
      } else {
        const newProfile = {
          id: Date.now().toString(),
          ...profileDataToSave,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        profiles.push(newProfile);
        localStorage.setItem('yourcitydeals_seller_profiles', JSON.stringify(profiles));
      }

      // Update invite in localStorage
      const savedInvites = localStorage.getItem('yourcitydeals_seller_invites');
      if (savedInvites) {
        const invites = JSON.parse(savedInvites);
        const updatedInvites = invites.map((inv: any) => 
          inv.id === (invite.id || 'test-invite') ? { 
            ...inv, 
            status: 'ready_for_review', 
            updated_at: new Date().toISOString(),
            profile_completed_at: new Date().toISOString(),
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            phone: phone,
            zip_code: profileData.zipCode,
            profile_picture_url: profileData.profilePicture
          } : inv
        );
        localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify(updatedInvites));
      } else {
        const newInvite = {
          ...invite,
          status: 'ready_for_review',
          updated_at: new Date().toISOString(),
          profile_completed_at: new Date().toISOString(),
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: phone,
          zip_code: profileData.zipCode,
          profile_picture_url: profileData.profilePicture
        };
        localStorage.setItem('yourcitydeals_seller_invites', JSON.stringify([newInvite]));
      }

      console.log('Updating local state...');
      // Update local state for immediate UI feedback
      const updatedInvite = { 
        ...invite, 
        status: 'ready_for_review',
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: phone,
        zip_code: profileData.zipCode,
        profile_picture_url: profileData.profilePicture,
        profile_completed_at: new Date().toISOString()
      };
      setInvite(updatedInvite);

      console.log('Setting authentication...');
      // Sign in the seller
      setIsAuthenticated(true);
      setSellerAccount(updatedInvite);
      
      // Save authentication state
      localStorage.setItem('yourcitydeals_seller_auth', JSON.stringify({
        isAuthenticated: true,
        sellerId: updatedInvite.id,
        sellerData: updatedInvite
      }));

      console.log('Profile completed successfully!');
      setStep('ready_for_review');
      
    } catch (error) {
      console.error('Error completing profile:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      alert('Failed to complete profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setSellerAccount(null);
    localStorage.removeItem('yourcitydeals_seller_auth');
    setStep('pwa'); // Reset to beginning
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to YourCity Deals!</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Hi {invite?.first_name || 'there'}, you've been invited to become a seller!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-600">
              {step === 'pwa' ? 'Step 1 of 6' : step === 'phone' ? 'Step 2 of 6' : step === 'verification' ? 'Step 3 of 6' : step === 'profile' ? 'Step 4 of 6' : step === 'ready_for_review' ? 'Step 5 of 6' : 'Step 6 of 6'}
            </span>
            <span className="text-sm text-gray-500">
              {step === 'pwa' ? 'Add to Home Screen' : step === 'phone' ? 'Phone Verification' : step === 'verification' ? 'Code Verification' : step === 'profile' ? 'Profile Setup' : step === 'ready_for_review' ? 'Ready for Review' : 'Complete'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ 
              width: step === 'pwa' ? '16.67%' : step === 'phone' ? '33.33%' : step === 'verification' ? '50%' : step === 'profile' ? '66.67%' : step === 'ready_for_review' ? '83.33%' : '100%' 
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {step === 'pwa' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Add YourCity Deals to Your Home Screen</h2>
                <p className="text-gray-600 mb-6">
                  For the best seller experience, add our app to your home screen. This gives you quick access to manage your sales, track earnings, and receive important notifications.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">How to Add to Home Screen:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                      <p className="text-sm text-blue-800">Tap the <strong>Share</strong> button in your browser</p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <p className="text-sm text-blue-800">Select <strong>"Add to Home Screen"</strong></p>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <p className="text-sm text-blue-800">Tap <strong>"Add"</strong> to confirm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800">
                    <strong>Benefits:</strong> Faster access, offline capabilities, and push notifications for sales updates.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('phone')}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  Continue Setup
                </button>
              </div>
            </div>
          )}

                  {step === 'phone' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Verify Your Phone</h2>
                <p className="text-gray-600 mb-4">
                  Great! We're excited to have you join our seller community. First, let's verify your phone number so we can keep you updated on your sales and important notifications.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Why we need this:</strong> We'll send you verification codes, sales updates, and important notifications about your seller account.
                  </p>
                </div>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Verification Code</h2>
                <p className="text-gray-600 mb-4">
                  Perfect! We've sent a verification code to your phone. This helps us ensure your account is secure and you're ready to start selling.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Test Mode:</strong> For testing purposes, use code <strong className="text-green-600">123456</strong>
                  </p>
                </div>
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
                  onClick={() => {
                    console.log('Verify button clicked!');
                    handleVerifyCode();
                  }}
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
                        Upload or Take Photo
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

          {step === 'ready_for_review' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for completing your seller profile! Your application is now under review by our team.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-yellow-900 font-semibold text-lg mb-3">What happens next?</h3>
                <div className="space-y-3 text-sm text-yellow-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-yellow-800 text-xs font-bold">1</span>
                    </div>
                    <p>Our team will review your application within 24-48 hours</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-yellow-800 text-xs font-bold">2</span>
                    </div>
                    <p>You'll receive an email notification with the decision</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-yellow-800 text-xs font-bold">3</span>
                    </div>
                    <p>If approved, you'll get access to create your seller account</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 font-semibold mb-2">Application Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <strong>Name:</strong> {profileData.firstName} {profileData.lastName}
                  </div>
                  <div>
                    <strong>Phone:</strong> {phone}
                  </div>
                  <div>
                    <strong>ZIP Code:</strong> {profileData.zipCode}
                  </div>
                  <div>
                    <strong>Submitted:</strong> {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-blue-900 font-semibold mb-3">What to expect next:</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Check your email for our decision within 24-48 hours
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You'll receive approval or feedback via email
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your account will be activated only after approval
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  You can close this page now. We'll contact you via email with the next steps.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to YourCity Deals!</h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! Your seller profile has been completed successfully. We're excited to have you join our community!
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-green-900 font-semibold text-lg mb-3">Application Submitted Successfully!</h3>
                <p className="text-green-700 text-sm mb-4">
                  Your seller account is now pending review. Our team will review your application and get back to you within 24-48 hours.
                </p>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You'll receive an email notification when approved
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Once approved, you can start creating and selling deals
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    We'll help you get set up with your first campaign
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-blue-900 font-semibold mb-3">Important: Check Your Email</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Check your email for our decision within 24-48 hours
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your account will be activated only after approval
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You'll receive approval or feedback via email
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  You can close this page now. We'll contact you via email with the next steps.
                </p>
                
                <p className="text-sm text-gray-500">
                  Questions? Contact us at <a href="mailto:support@yourcitydeals.com" className="text-green-600 hover:text-green-700">support@yourcitydeals.com</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
