'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export default function BookPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [book, setBook] = useState<CouponBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookId, setBookId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Handle async params
    const getParams = async () => {
      const resolvedParams = await params;
      setBookId(resolvedParams.id);
      checkAuthStatus();
      fetchBookData(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const fetchBookData = async (id: string) => {
    try {
      // Try to load from localStorage first
      const savedBooks = localStorage.getItem('yourcitydeals_books');
      
      if (savedBooks) {
        const books = JSON.parse(savedBooks);
        const foundBook = books.find((b: any) => b.id === id);
        
        if (foundBook) {
          // Convert to CouponBook format
          const couponBook: CouponBook = {
            id: foundBook.id,
            title: foundBook.title,
            description: foundBook.description,
            price: foundBook.price,
            school: foundBook.school,
            totalOffers: foundBook.offersCount || 8,
            validFrom: '2025-01-01',
            validTo: '2025-12-31',
            featured: foundBook.featured || false,
            category: foundBook.category || 'high',
            purchased: false
          };
          
          setBook(couponBook);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to default data if not found
      const defaultBook: CouponBook = {
        id,
        title: 'Lincoln High School 2025 Coupon Book',
        description: 'Amazing discounts at the best local businesses. Save money while supporting your school!',
        price: 25,
        school: 'Lincoln High School',
        totalOffers: 8,
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        featured: true,
        category: 'high',
        purchased: false
      };
      
      setBook(defaultBook);
    } catch (error) {
      console.error('Error fetching book data:', error);
      setError('Book not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    // Redirect to purchase flow
    router.push(`/purchase?book=${bookId}`);
  };

  const handleSignup = () => {
    // Redirect to signup
    router.push(`/signup`);
  };

  const handleLogin = () => {
    // Redirect to login
    router.push(`/login`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">This coupon book could not be found or may have been removed.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                YourCity Deals
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.firstName}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLogin}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Sign In
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={handleSignup}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Preview: {book.title}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Book Card */}
            <div className="group mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/30 overflow-hidden">
                {/* Card Header with Organization Logo */}
                <div className="relative h-32 bg-gray-100">
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700">
                      School
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight bg-white/80 px-2 py-1 rounded">{book.title}</h3>
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
                      Valid until Dec 30, 2025
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${(book.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Offers */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sample Offers</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Local Restaurant - 20% Off</h4>
                  </div>
                  <p className="text-sm text-gray-600">Valid for dine-in or takeout. Cannot be combined with other offers.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Coffee Shop - Buy One Get One Free</h4>
                  </div>
                  <p className="text-sm text-gray-600">Any size drink. Valid Monday-Friday before 3pm.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Movie Theater - $5 Off</h4>
                  </div>
                  <p className="text-sm text-gray-600">Any movie, any time. Valid for up to 4 tickets per visit.</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Purchase?
              </h3>
              <p className="text-gray-600 mb-6">
                Get access to all {book.totalOffers} amazing offers and support local community initiatives!
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Close Preview
                </button>
                <button
                  onClick={handlePurchase}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up to Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
