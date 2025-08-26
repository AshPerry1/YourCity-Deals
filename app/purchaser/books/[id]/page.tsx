'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PaymentForm from '../../../components/payment/PaymentForm';

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
  totalValue: number;
  savings: number;
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
  originalPrice?: number;
  discountedPrice?: number;
  terms: string[];
  restrictions: string[];
}

export default function CouponBookDetail() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<CouponBook | null>(null);
  const [offers, setOffers] = useState<CouponOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock book data
      const mockBook: CouponBook = {
        id: bookId,
        title: 'Lincoln High School 2025 Coupon Book',
        description: 'Amazing deals from local businesses to support our school fundraising efforts. This comprehensive coupon book features exclusive offers from Omaha\'s finest restaurants, services, and entertainment venues.',
        price: 25.00,
        school: 'Lincoln High School',
        totalOffers: 8,
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        featured: true,
        category: 'high',
        totalValue: 450.00,
        savings: 425.00
      };

      // Mock offers data
      const mockOffers: CouponOffer[] = [
        {
          id: '1',
          title: '20% Off Any Large Pizza',
          business: 'Pizza Palace',
          businessAddress: '123 Main St, Omaha, NE',
          businessCoordinates: { lat: 41.2565, lng: -95.9345 },
          discount: '20% Off',
          category: 'Food & Dining',
          description: 'Get 20% off any large pizza with any toppings. Perfect for family dinner or group gatherings.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 25.00,
          discountedPrice: 20.00,
          terms: ['Valid on large pizzas only', 'Cannot be combined with other offers', 'Valid for dine-in or carryout'],
          restrictions: ['Not valid on delivery', 'Excludes premium toppings']
        },
        {
          id: '2',
          title: 'Buy 1 Get 1 Free Coffee',
          business: 'Coffee Corner',
          businessAddress: '456 Oak Ave, Omaha, NE',
          businessCoordinates: { lat: 41.2570, lng: -95.9350 },
          discount: 'Buy 1 Get 1 Free',
          category: 'Food & Dining',
          description: 'Purchase any coffee drink and get a second one absolutely free. Great for coffee dates or morning meetings.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 4.50,
          discountedPrice: 4.50,
          terms: ['Valid on any coffee drink', 'Equal or lesser value', 'Valid all day'],
          restrictions: ['Cannot be combined with other offers', 'Valid for same visit only']
        },
        {
          id: '3',
          title: '15% Off Full-Service Oil Change',
          business: 'Quick Lube Express',
          businessAddress: '789 Pine St, Omaha, NE',
          businessCoordinates: { lat: 41.2580, lng: -95.9360 },
          discount: '15% Off',
          category: 'Automotive',
          description: 'Save 15% on our premium full-service oil change package. Includes oil, filter, and multi-point inspection.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 45.00,
          discountedPrice: 38.25,
          terms: ['Valid on full-service package only', 'Includes synthetic oil', 'Multi-point inspection included'],
          restrictions: ['Not valid on basic oil change', 'Cannot be combined with other offers']
        },
        {
          id: '4',
          title: 'Free Haircut with Color Service',
          business: 'Hair Studio Pro',
          businessAddress: '321 Elm St, Omaha, NE',
          businessCoordinates: { lat: 41.2590, lng: -95.9370 },
          discount: 'Free Haircut',
          category: 'Beauty & Wellness',
          description: 'Get a free haircut when you book any color service. Transform your look with professional styling.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 35.00,
          discountedPrice: 0.00,
          terms: ['Valid with any color service', 'Professional stylists only', 'Consultation included'],
          restrictions: ['Haircut only, styling extra', 'Cannot be combined with other offers']
        },
        {
          id: '5',
          title: '25% Off Movie Tickets',
          business: 'Cinema Center',
          businessAddress: '654 Maple Ave, Omaha, NE',
          businessCoordinates: { lat: 41.2600, lng: -95.9380 },
          discount: '25% Off',
          category: 'Entertainment',
          description: 'Enjoy 25% off any movie ticket. Perfect for date nights or family entertainment.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 12.00,
          discountedPrice: 9.00,
          terms: ['Valid on any movie', 'Valid any day of the week', 'Standard seating only'],
          restrictions: ['Not valid on premium seating', 'Cannot be combined with other offers']
        },
        {
          id: '6',
          title: '30% Off Dry Cleaning',
          business: 'Clean & Press',
          businessAddress: '987 Cedar St, Omaha, NE',
          businessCoordinates: { lat: 41.2610, lng: -95.9390 },
          discount: '30% Off',
          category: 'Services',
          description: 'Save 30% on all dry cleaning services. Keep your clothes looking fresh and professional.',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 20.00,
          discountedPrice: 14.00,
          terms: ['Valid on all dry cleaning', 'Same-day service available', 'Professional quality'],
          restrictions: ['Not valid on alterations', 'Cannot be combined with other offers']
        },
        {
          id: '7',
          title: 'Buy 2 Get 1 Free Ice Cream',
          business: 'Sweet Treats',
          businessAddress: '147 Birch St, Omaha, NE',
          businessCoordinates: { lat: 41.2620, lng: -95.9400 },
          discount: 'Buy 2 Get 1 Free',
          category: 'Food & Dining',
          description: 'Purchase any two ice cream items and get a third one absolutely free. Perfect for families!',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 15.00,
          discountedPrice: 15.00,
          terms: ['Valid on any ice cream items', 'Equal or lesser value', 'Valid all day'],
          restrictions: ['Cannot be combined with other offers', 'Valid for same visit only']
        },
        {
          id: '8',
          title: '20% Off Gym Membership',
          business: 'FitLife Center',
          businessAddress: '258 Spruce St, Omaha, NE',
          businessCoordinates: { lat: 41.2630, lng: -95.9410 },
          discount: '20% Off',
          category: 'Health & Fitness',
          description: 'Get 20% off your first month of gym membership. Start your fitness journey today!',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          originalPrice: 50.00,
          discountedPrice: 40.00,
          terms: ['Valid on first month only', 'All facilities included', 'Personal trainer consultation'],
          restrictions: ['New members only', 'Cannot be combined with other offers']
        }
      ];
      
      setBook(mockBook);
      setOffers(mockOffers);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.business.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Automotive': 'bg-blue-100 text-blue-800',
      'Beauty & Wellness': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Services': 'bg-gray-100 text-gray-800',
      'Health & Fitness': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading coupon book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Coupon Book Not Found</h1>
            <p className="text-gray-600 mb-6">The coupon book you're looking for doesn't exist.</p>
            <Link
              href="/purchaser"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <PaymentForm
            amount={book.price}
            bookTitle={book.title}
            onPaymentSuccess={(paymentData) => {
              console.log('Payment successful:', paymentData);
              setShowPayment(false);
              // Redirect to success page or update user's books
            }}
            onPaymentError={(error) => {
              console.error('Payment failed:', error);
              setShowPayment(false);
            }}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Book Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(offers.map(offer => offer.category))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/purchaser"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Deals
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-lg font-medium text-gray-900">Coupon Book Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Book Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(book.category)}`}>
                    {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                  </span>
                  {book.featured && (
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{book.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{book.totalOffers}</div>
                    <div className="text-sm text-gray-600">Total Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${book.totalValue.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">${book.savings.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Potential Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{getDaysUntilExpiry(book.validTo)}</div>
                    <div className="text-sm text-gray-600">Days Left</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {book.school}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Valid from {formatDate(book.validFrom)} to {formatDate(book.validTo)}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">${book.price.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">One-time purchase</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {book.totalOffers} exclusive offers
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ${book.savings.toFixed(0)}+ potential savings
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Valid for full year
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Support local schools
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Purchase Now
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Secure payment • Instant access • No recurring fees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
                    placeholder="Search offers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Offers Grid */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Offers ({filteredOffers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => {
                const daysUntilExpiry = getDaysUntilExpiry(offer.validTo);
                
                return (
                  <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(offer.category)}`}>
                          {offer.category}
                        </span>
                        <span className={`text-xs font-medium ${getExpiryColor(daysUntilExpiry)}`}>
                          {daysUntilExpiry} days left
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{offer.business}</p>
                      <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {offer.businessAddress}
                        </div>
                        {offer.originalPrice && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 line-through">${offer.originalPrice.toFixed(2)}</span>
                            <span className="text-green-600 font-medium">${offer.discountedPrice?.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-blue-600">{offer.discount}</div>
                        <Link
                          href={`/purchaser/offers/${offer.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                      
                      {offer.terms.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Terms:</h4>
                          <ul className="space-y-1">
                            {offer.terms.slice(0, 2).map((term, index) => (
                              <li key={index} className="text-xs text-gray-600 flex items-start">
                                <span className="text-blue-600 mr-1">•</span>
                                {term}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
