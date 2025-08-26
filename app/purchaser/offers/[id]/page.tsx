'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CouponSharing from '../../../components/coupons/CouponSharing';

interface CouponOffer {
  id: string;
  title: string;
  business: string;
  businessAddress: string;
  businessCoordinates: {
    lat: number;
    lng: number;
  };
  businessPhone: string;
  businessHours: string;
  businessWebsite?: string;
  discount: string;
  category: string;
  description: string;
  validFrom: string;
  validTo: string;
  originalPrice?: number;
  discountedPrice?: number;
  terms: string[];
  restrictions: string[];
  bookId: string;
  bookTitle: string;
  school: string;
  howToRedeem: string[];
  tips: string[];
}

export default function CouponOfferDetail() {
  const params = useParams();
  const offerId = params.id as string;
  
  const [offer, setOffer] = useState<CouponOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSharing, setShowSharing] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    fetchOfferDetails();
    calculateDistance();
  }, [offerId]);

  const fetchOfferDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock offer data
      const mockOffer: CouponOffer = {
        id: offerId,
        title: '20% Off Any Large Pizza',
        business: 'Pizza Palace',
        businessAddress: '123 Main St, Omaha, NE 68102',
        businessCoordinates: { lat: 41.2565, lng: -95.9345 },
        businessPhone: '(402) 555-0123',
        businessHours: 'Mon-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 9:00 PM',
        businessWebsite: 'https://pizzapalaceomaha.com',
        discount: '20% Off',
        category: 'Food & Dining',
        description: 'Get 20% off any large pizza with any toppings. Perfect for family dinner or group gatherings. Our large pizzas are 16 inches and can feed 4-6 people comfortably.',
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        originalPrice: 25.00,
        discountedPrice: 20.00,
        terms: [
          'Valid on large pizzas only (16 inch)',
          'Cannot be combined with other offers or promotions',
          'Valid for dine-in or carryout orders',
          'Valid any day of the week',
          'Valid during all business hours',
          'One coupon per order',
          'Valid for any toppings (including premium)',
          'Tax and gratuity not included'
        ],
        restrictions: [
          'Not valid on delivery orders',
          'Cannot be used with online ordering',
          'Cannot be combined with happy hour specials',
          'Not valid on holidays (Thanksgiving, Christmas, New Year\'s)',
          'Cannot be used for catering orders',
          'Valid only at Omaha location'
        ],
        bookId: '1',
        bookTitle: 'Lincoln High School 2025 Coupon Book',
        school: 'Lincoln High School',
        howToRedeem: [
          'Present this coupon to your server or cashier',
          'Show the coupon on your phone or print it out',
          'Mention the coupon before placing your order',
          'Ensure the coupon is visible when paying',
          'Keep the coupon until your transaction is complete'
        ],
        tips: [
          'Best time to visit: Weekdays 5-7 PM for quickest service',
          'Call ahead for large orders (8+ pizzas)',
          'Free parking available in the lot behind the restaurant',
          'Ask about their daily specials that can be combined',
          'Join their loyalty program for additional savings',
          'Follow them on social media for flash deals'
        ]
      };
      
      setOffer(mockOffer);
    } catch (error) {
      console.error('Error fetching offer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = () => {
    // In a real app, this would use the user's location
    // For now, we'll simulate a distance
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Calculate distance using Haversine formula
          const R = 3959; // Earth's radius in miles
          const dLat = (offer?.businessCoordinates.lat! - userLat) * Math.PI / 180;
          const dLng = (offer?.businessCoordinates.lng! - userLng) * Math.PI / 180;
          const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(offer?.businessCoordinates.lat! * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const calculatedDistance = R * c;
          
          setDistance(Math.round(calculatedDistance * 10) / 10);
        },
        () => {
          // If location access is denied, set a default distance
          setDistance(2.5);
        }
      );
    } else {
      setDistance(2.5);
    }
  };

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

  const handleShareCoupon = async (shareData: any) => {
    try {
      // Simulate sharing API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Coupon shared:', shareData);
      setShowSharing(false);
      // In real app, would update the coupon as shared
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h1>
            <p className="text-gray-600 mb-6">The coupon offer you're looking for doesn't exist.</p>
            <Link
              href="/purchaser"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showSharing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <CouponSharing
            coupon={offer}
            onShare={handleShareCoupon}
            onCancel={() => setShowSharing(false)}
          />
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(offer.validTo);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={`/purchaser/books/${offer.bookId}`}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Book
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-lg font-medium text-gray-900">Offer Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Offer Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(offer.category)}`}>
                    {offer.category}
                  </span>
                  <span className={`text-sm font-medium ${getExpiryColor(daysUntilExpiry)}`}>
                    {daysUntilExpiry} days left
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{offer.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{offer.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{offer.discount}</div>
                    <div className="text-sm text-gray-600">Discount</div>
                  </div>
                  {offer.originalPrice && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400 line-through">${offer.originalPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Original Price</div>
                    </div>
                  )}
                  {offer.discountedPrice !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${offer.discountedPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Your Price</div>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{offer.school}</div>
                    <div className="text-sm text-gray-600">Supporting</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                    Valid from {formatDate(offer.validFrom)} to {formatDate(offer.validTo)}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Part of {offer.bookTitle}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowSharing(true)}
                      className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Share Coupon
                    </button>
                    
                    <Link
                      href={`https://maps.google.com/?q=${encodeURIComponent(offer.businessAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get Directions
                    </Link>
                    
                    {offer.businessPhone && (
                      <a
                        href={`tel:${offer.businessPhone}`}
                        className="w-full py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call Business
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{offer.business}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {offer.businessAddress}
                  </div>
                  {distance && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {distance} miles away
                    </div>
                  )}
                  {offer.businessPhone && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {offer.businessPhone}
                    </div>
                  )}
                  {offer.businessHours && (
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {offer.businessHours}
                    </div>
                  )}
                  {offer.businessWebsite && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a
                        href={offer.businessWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Redeem</h3>
                <ul className="space-y-2">
                  {offer.howToRedeem.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2 font-medium">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Terms and Restrictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              <ul className="space-y-2">
                {offer.terms.map((term, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {term}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Restrictions</h2>
              <ul className="space-y-2">
                {offer.restrictions.map((restriction, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    {restriction}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pro Tips for Best Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offer.tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2 mt-1">💡</span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
