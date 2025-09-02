'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import PaymentForm from './components/payment/PaymentForm';
import NotificationPreferences from './components/NotificationPreferences';
import NearbyOffers from './components/NearbyOffers';
import CouponSharing from './components/coupons/CouponSharing';
import { useLocationNotifications } from './hooks/useLocationNotifications';
import RoleSwitcher from './components/RoleSwitcher';
import GiftModal from './components/GiftModal';
import ActivationModal from './components/ActivationModal';
import ShareModal from './components/ShareModal';
import PaymentModal from './components/PaymentModal';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface CouponBook {
  id: string;
  title: string;
  description: string;
  price: number;
  school: string;
  totalOffers: number;
  validFrom: string;
  validTo: string;
  coverImage?: string;
  featured: boolean;
  category: 'elementary' | 'middle' | 'high' | 'community';
  purchased: boolean;
  purchaseDate?: string;
}

interface CouponOffer {
  id: string;
  title: string;
  business: string;
  businessAddress: string;
  businessCoordinates: {
    lat: number;
    lng: number;
  };
  discount: string;
  category: string;
  description: string;
  validFrom: string;
  validTo: string;
  bookId: string;
  bookTitle: string;
  school: string;
  redeemed: boolean;
  redeemedDate?: string;
  shared: boolean;
}

export default function YourCityDealsApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [showPayment, setShowPayment] = useState<CouponBook | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSharing, setShowSharing] = useState<CouponOffer | null>(null);
  const [showGiftModal, setShowGiftModal] = useState<CouponBook | null>(null);
  const [activatedCoupon, setActivatedCoupon] = useState<CouponOffer | null>(null);
  const [activationTimer, setActivationTimer] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-books' | 'my-coupons' | 'nearby'>('discover');
  const [couponBooks, setCouponBooks] = useState<CouponBook[]>([]);
  const [userCoupons, setUserCoupons] = useState<CouponOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const {
    userLocation,
    locationPermission,
    nearbyBusinesses,
    notificationPreferences,
    isTracking,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    updateNotificationPreference,
    calculateDistance,
    sendNotification
  } = useLocationNotifications();

  useEffect(() => {
    checkAuthStatus();
    fetchData();
  }, []);

  // Timer effect for activated coupon
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activatedCoupon && activationTimer > 0) {
      interval = setInterval(() => {
        setActivationTimer(prev => {
          if (prev <= 1) {
            deactivateCoupon();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activatedCoupon, activationTimer]);

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBooks: CouponBook[] = [
        {
          id: '1',
          title: 'Lincoln High School 2025 Coupon Book',
          description: 'Amazing deals from local businesses to support our school fundraising efforts.',
          price: 25.00,
          school: 'Lincoln High School',
          totalOffers: 8,
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          featured: true,
          category: 'high',
          purchased: false
        },
        {
          id: '2',
          title: 'Washington Middle School Fundraiser',
          description: 'Support our middle school with great local business deals.',
          price: 20.00,
          school: 'Washington Middle School',
          totalOffers: 6,
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          featured: true,
          category: 'middle',
          purchased: false
        },
        {
          id: '3',
          title: 'Elementary School Community Book',
          description: 'Building community through local business partnerships.',
          price: 15.00,
          school: 'Elementary School',
          totalOffers: 4,
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          featured: false,
          category: 'elementary',
          purchased: false
        }
      ];

      const mockUserCoupons: CouponOffer[] = [
        {
          id: '1',
          title: '20% Off Pizza',
          business: 'Pizza Palace',
          businessAddress: '123 Main St, Omaha, NE',
          businessCoordinates: { lat: 41.2565, lng: -95.9345 },
          discount: '20% Off',
          category: 'Food & Dining',
          description: 'Get 20% off any large pizza, any toppings',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          bookId: '1',
          bookTitle: 'Lincoln High School 2025 Coupon Book',
          school: 'Lincoln High School',
          redeemed: false,
          shared: false
        },
        {
          id: '2',
          title: 'Buy 1 Get 1 Free Coffee',
          business: 'Coffee Corner',
          businessAddress: '456 Oak Ave, Omaha, NE',
          businessCoordinates: { lat: 41.2570, lng: -95.9350 },
          discount: 'Buy 1 Get 1 Free',
          category: 'Food & Dining',
          description: 'Purchase any coffee and get a second one free',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          bookId: '1',
          bookTitle: 'Lincoln High School 2025 Coupon Book',
          school: 'Lincoln High School',
          redeemed: false,
          shared: false
        }
      ];
      
      setCouponBooks(mockBooks);
      setUserCoupons(mockUserCoupons);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: email,
        phone: '555-0123'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setShowAuth(null);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: '1',
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      setShowAuth(null);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const handlePurchaseBook = (book: CouponBook) => {
    setShowPayment(book);
  };

  const handlePreviewBook = (book: CouponBook) => {
    // Show a modal with book details and sample offers
    setShowGiftModal(book); // Temporarily use gift modal for preview
  };

  const activateCoupon = (coupon: CouponOffer) => {
    setActivatedCoupon(coupon);
    setActivationTimer(180); // 3 minutes = 180 seconds
  };

  const deactivateCoupon = () => {
    setActivatedCoupon(null);
    setActivationTimer(0);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setCouponBooks(prev => prev.map(book => 
      book.id === showPayment?.id 
        ? { ...book, purchased: true, purchaseDate: new Date().toISOString() }
        : book
    ));
    
    setShowPayment(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

  const handleShareCoupon = async (shareData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserCoupons(prev => prev.map(coupon => 
        coupon.id === shareData.couponId 
          ? { ...coupon, shared: true }
          : coupon
      ));
      
      setShowSharing(null);
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const filteredBooks = couponBooks
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.school.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'elementary':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'middle':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'high':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'community':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (validTo: string) => {
    const today = new Date();
    const expiry = new Date(validTo);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 30) return 'text-orange-600';
    return 'text-emerald-600';
  };

  // Show authentication forms
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showAuth === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setShowAuth('signup')}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => setShowAuth('login')}
            />
          )}
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAuth(null)}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to Deals
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show payment form
  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <PaymentForm
            amount={showPayment.price}
            bookTitle={showPayment.title}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => setShowPayment(null)}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to Deals
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show notification preferences
  if (showNotifications) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <NotificationPreferences
            couponBookId="1"
            offers={userCoupons}
            onPreferencesChange={(preferences) => {
              preferences.forEach(pref => {
                updateNotificationPreference(pref.couponId, pref);
              });
            }}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Back to My Coupons
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show coupon sharing
  if (showSharing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CouponSharing
            coupon={showSharing}
            onShare={handleShareCoupon}
            onCancel={() => setShowSharing(null)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading amazing deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo/Branding */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  YourCity Deals
                </h1>
              </div>
              
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Portal Links */}
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <Link href="/about" className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                  About
                </Link>
                <Link href="/about-us" className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                  Our Story
                </Link>
              </div>
              
              {isAuthenticated ? (
                <>
                  <RoleSwitcher />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuth('login')}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuth('signup')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveTab('my-books')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'my-books'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Books
                </button>
                <button
                  onClick={() => setActiveTab('my-coupons')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'my-coupons'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Coupons
                </button>
                <button
                  onClick={() => setActiveTab('nearby')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'nearby'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Nearby Offers
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                  Discover Amazing Deals
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Support local schools while saving money on dining, services, and entertainment. 
                  Every purchase helps fund education and community programs.
                </p>
                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowAuth('signup')}
                      className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => setShowAuth('login')}
                      className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search coupon books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-4 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg appearance-none pr-10"
                    >
                      <option value="all">All Categories</option>
                      <option value="elementary">Elementary School</option>
                      <option value="middle">Middle School</option>
                      <option value="high">High School</option>
                      <option value="community">Community</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Trust Indicators */}
                  
                </div>
              </div>
            </div>

            {/* Available Coupon Books */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Coupon Books</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="group">
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/30 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      {/* Card Header with Gradient */}
                      <div className="relative h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-white/20 bg-white/20 backdrop-blur-sm text-white`}>
                            {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                          </span>
                          {book.featured && (
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                              ⭐ Featured
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white leading-tight">{book.title}</h3>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{book.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            {book.school}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                            </div>
                            {book.totalOffers} amazing offers
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            Valid until {formatDate(book.validTo)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ${book.price.toFixed(2)}
                          </div>
                          {isAuthenticated ? (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setShowGiftModal(book)}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Gift
                              </button>
                              <button
                                onClick={() => handlePurchaseBook(book)}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Buy Now
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handlePreviewBook(book)}
                                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => setShowAuth('signup')}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Sign Up to Buy
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* PWA Installation Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Install YourCity Deals App</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get quick access to your coupons and deals! Install YourCity Deals on your phone or desktop for the best experience.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">iOS (iPhone/iPad)</h3>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Open Safari browser (not Chrome)</li>
                    <li>2. Tap the Share button (square with arrow up) at bottom</li>
                    <li>3. Scroll down and tap 'Add to Home Screen'</li>
                    <li>4. Tap 'Add' to confirm</li>
                  </ol>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Android</h3>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Open Chrome browser</li>
                    <li>2. Tap the three dots menu (:) at top right</li>
                    <li>3. Tap 'Add to Home screen'</li>
                    <li>4. Tap 'Add' to confirm</li>
                  </ol>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Desktop (Chrome/Edge)</h3>
                  </div>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Look for the install icon (+) in address bar</li>
                    <li>2. Click the install icon when it appears</li>
                    <li>3. Click 'Install' in the popup</li>
                    <li>4. App will install and appear on desktop</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-blue-800 text-sm"><strong>Pro Tip:</strong> After installation, the app will work just like a native app with its own icon, full-screen experience, and offline functionality!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Books Tab */}
        {activeTab === 'my-books' && isAuthenticated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Coupon Books</h2>
            </div>
            
            {couponBooks.filter(book => book.purchased).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books purchased yet</h3>
                <p className="text-gray-600 mb-4">Start by discovering and purchasing coupon books</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium"
                >
                  Discover Deals
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {couponBooks.filter(book => book.purchased).map((book) => (
                  <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(book.category)}`}>
                        {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Purchased {formatDate(book.purchaseDate!)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{book.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        {book.totalOffers} offers
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                        Valid until {formatDate(book.validTo)}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('my-coupons')}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium"
                    >
                      View Coupons
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Coupons Tab */}
        {activeTab === 'my-coupons' && isAuthenticated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Coupons</h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-200 text-sm font-medium shadow-lg"
                >
                  Notification Settings
                </button>
                {locationPermission === 'granted' && (
                  <button
                    onClick={isTracking ? stopLocationTracking : startLocationTracking}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg ${
                      isTracking 
                        ? 'bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
                    }`}
                  >
                    {isTracking ? 'Stop Tracking' : 'Start Location Tracking'}
                  </button>
                )}
              </div>
            </div>
            
            {userCoupons.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
                <p className="text-gray-600 mb-4">Purchase a coupon book to get started</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCoupons.map((coupon) => {
                  const daysUntilExpiry = getDaysUntilExpiry(coupon.validTo);
                  
                  return (
                    <div key={coupon.id} className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border bg-blue-50 text-blue-700 border-blue-200`}>
                          {coupon.category}
                        </span>
                        <span className={`text-xs font-medium ${getExpiryColor(daysUntilExpiry)}`}>
                          {daysUntilExpiry} days left
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{coupon.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{coupon.business}</p>
                      <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {coupon.businessAddress}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {coupon.bookTitle}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-blue-600">{coupon.discount}</div>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          coupon.redeemed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {coupon.redeemed ? 'Redeemed' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => activateCoupon(coupon)}
                          disabled={coupon.redeemed || activatedCoupon?.id === coupon.id}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg"
                        >
                          {activatedCoupon?.id === coupon.id ? 'Activated' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setShowSharing(coupon)}
                          disabled={coupon.shared || coupon.redeemed}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-lg"
                        >
                          Share
                        </button>
                        <Link
                          href={`https://maps.google.com/?q=${coupon.businessAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-medium shadow-lg"
                        >
                          Directions
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Nearby Offers Tab */}
        {activeTab === 'nearby' && isAuthenticated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Nearby Offers</h2>
              {locationPermission !== 'granted' && (
                <button
                  onClick={requestLocationPermission}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-sm font-medium shadow-lg"
                >
                  Enable Location
                </button>
              )}
            </div>
            
            <NearbyOffers
              userLocation={userLocation}
              offers={userCoupons.map(coupon => ({
                ...coupon,
                distance: userLocation ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  coupon.businessCoordinates.lat,
                  coupon.businessCoordinates.lng
                ) : 0
              }))}
              onLocationRequest={requestLocationPermission}
            />
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <GiftModal
          book={showGiftModal}
          onClose={() => setShowGiftModal(null)}
          onGiftSent={(recipientEmail, recipientPhone) => {
            console.log('Gift sent to:', { recipientEmail, recipientPhone });
            setShowGiftModal(null);
            // In real app, this would trigger the gift purchase flow
          }}
        />
      )}

      {/* Activation Modal */}
      {activatedCoupon && (
        <ActivationModal
          coupon={activatedCoupon}
          timer={activationTimer}
          onClose={deactivateCoupon}
          onVerify={() => {
            console.log('Coupon verified:', activatedCoupon.id);
            deactivateCoupon();
            // In real app, this would mark the coupon as redeemed
          }}
        />
      )}

      {/* Share Modal */}
      {showSharing && (
        <ShareModal
          coupon={showSharing}
          onClose={() => setShowSharing(null)}
          onShare={(recipientEmail, recipientPhone) => {
            console.log('Coupon shared to:', { recipientEmail, recipientPhone });
            setShowSharing(null);
            // In real app, this would transfer the coupon and create claim link
          }}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          book={showPayment}
          onClose={() => setShowPayment(null)}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
}
