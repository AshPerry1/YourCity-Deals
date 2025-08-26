'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import PaymentForm from '../components/payment/PaymentForm';
import NotificationPreferences from '../components/NotificationPreferences';
import NearbyOffers from '../components/NearbyOffers';
import CouponSharing from '../components/coupons/CouponSharing';
import { useLocationNotifications } from '../hooks/useLocationNotifications';

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

export default function PurchaserPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [showPayment, setShowPayment] = useState<CouponBook | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSharing, setShowSharing] = useState<CouponOffer | null>(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                YourCity Deals
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
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
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl"
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
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Discover Deals
            </button>
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
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Discover Amazing Deals
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                  Support local schools while saving money on dining, services, and entertainment. 
                  Every purchase helps fund education and community programs.
                </p>
                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setShowAuth('signup')}
                      className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </button>
                    <button
                      onClick={() => setShowAuth('login')}
                      className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all duration-200"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search coupon books..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="all">All Categories</option>
                    <option value="elementary">Elementary</option>
                    <option value="middle">Middle School</option>
                    <option value="high">High School</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Coupon Books */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Coupon Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(book.category)}`}>
                          {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                        </span>
                        {book.featured && (
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{book.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {book.school}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          {book.totalOffers} offers
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Valid {formatDate(book.validFrom)} - {formatDate(book.validTo)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">${book.price.toFixed(2)}</div>
                        {isAuthenticated ? (
                          <button
                            onClick={() => handlePurchaseBook(book)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                          >
                            Buy Now
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowAuth('signup')}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                          >
                            Sign Up to Buy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
