'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  terms: string;
  isActive: boolean;
}

interface CouponBook {
  id: string;
  title: string;
  description: string;
  price: string;
  school: string;
  class: string;
  validFrom: string;
  validTo: string;
  totalOffers: number;
  isActive: boolean;
  offers: Offer[];
  totalSales?: number;
  revenue?: number;
}

export default function PreviewCouponBook() {
  const params = useParams();
  const bookId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [bookData, setBookData] = useState<CouponBook>({
    id: '',
    title: '',
    description: '',
    price: '',
    school: '',
    class: '',
    validFrom: '',
    validTo: '',
    totalOffers: 0,
    isActive: true,
    offers: []
  });

  useEffect(() => {
    // Simulate fetching book data
    const fetchBookData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data - in real app, fetch from API using bookId
        const mockBook: CouponBook = {
          id: bookId,
          title: 'Lincoln High School 2025 Coupon Book',
          description: 'Amazing deals from local businesses to support our school fundraising efforts. This digital coupon book features exclusive offers from your favorite local restaurants, services, and retailers.',
          price: '25.00',
          school: 'Lincoln High School',
          class: 'Senior Class of 2025',
          validFrom: '2025-01-01',
          validTo: '2025-12-31',
          totalOffers: 8,
          isActive: true,
          totalSales: 156,
          revenue: 3900,
          offers: [
            {
              id: '1',
              title: '20% Off Pizza',
              description: 'Get 20% off any pizza order from our local pizzeria. Perfect for family dinners or group events.',
              discount: '20% Off',
              terms: 'Valid until December 31, 2025. Cannot be combined with other offers. Valid for dine-in, takeout, and delivery.',
              isActive: true
            },
            {
              id: '2',
              title: 'Buy 1 Get 1 Free Coffee',
              description: 'Purchase any coffee and get a second one free at our local coffee shop.',
              discount: 'Buy 1 Get 1 Free',
              terms: 'Valid Monday-Friday. Excludes holidays. Valid for any size coffee, hot or iced.',
              isActive: true
            },
            {
              id: '3',
              title: '15% Off Oil Change',
              description: 'Save 15% on your next oil change service at our trusted auto repair shop.',
              discount: '15% Off',
              terms: 'Valid for standard oil changes only. Cannot be combined with other discounts. Valid until December 31, 2025.',
              isActive: true
            },
            {
              id: '4',
              title: 'Free Appetizer',
              description: 'Get a free appetizer with any entrée purchase at our local restaurant.',
              discount: 'Free Appetizer',
              terms: 'Valid for dine-in only. Cannot be combined with other offers. Valid until December 31, 2025.',
              isActive: true
            },
            {
              id: '5',
              title: '25% Off Haircut',
              description: 'Save 25% on any haircut service at our local salon.',
              discount: '25% Off',
              terms: 'Valid for new customers only. Cannot be combined with other offers. Valid until December 31, 2025.',
              isActive: true
            },
            {
              id: '6',
              title: '10% Off Groceries',
              description: 'Get 10% off your total grocery purchase at our local supermarket.',
              discount: '10% Off',
              terms: 'Valid for purchases over $50. Cannot be combined with other offers. Valid until December 31, 2025.',
              isActive: true
            },
            {
              id: '7',
              title: 'Free Car Wash',
              description: 'Get a free car wash with any gas purchase over $30.',
              discount: 'Free Car Wash',
              terms: 'Valid for basic car wash only. Cannot be combined with other offers. Valid until December 31, 2025.',
              isActive: true
            },
            {
              id: '8',
              title: '50% Off Movie Tickets',
              description: 'Save 50% on movie tickets at our local theater.',
              discount: '50% Off',
              terms: 'Valid for regular showings only. Cannot be combined with other offers. Valid until December 31, 2025.',
              isActive: true
            }
          ]
        };
        
        setBookData(mockBook);
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/books"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Preview Coupon Book</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {bookId}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/books/edit/${bookId}`}
                className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit Book
              </Link>
              <Link
                href="/admin/books"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Book Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{bookData.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">{bookData.description}</p>
            
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">${bookData.price}</div>
                <div className="text-sm text-gray-600">Book Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{bookData.totalOffers}</div>
                <div className="text-sm text-gray-600">Total Offers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{bookData.offers.filter(o => o.isActive).length}</div>
                <div className="text-sm text-gray-600">Active Offers</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{bookData.school}</span>
              </div>
              {bookData.class && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{bookData.class}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Valid From</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(bookData.validFrom)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Valid Until</div>
                <div className="text-lg font-semibold text-gray-900">{formatDate(bookData.validTo)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  bookData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {bookData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Offers & Coupons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookData.offers.map((offer, index) => (
              <div key={offer.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-700">{offer.discount}</div>
                    <div className="text-xs text-blue-600">Special Offer</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Terms & Conditions:</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{offer.terms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        {bookData.totalSales && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{bookData.totalSales}</div>
                <div className="text-sm text-blue-700">Books Sold</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">${bookData.revenue?.toLocaleString()}</div>
                <div className="text-sm text-green-700">Total Revenue</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {bookData.totalSales ? Math.round((bookData.revenue || 0) / bookData.totalSales) : 0}
                </div>
                <div className="text-sm text-purple-700">Avg. Revenue per Sale</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <Link
            href={`/admin/books/edit/${bookId}`}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Edit This Book
          </Link>
          <Link
            href="/admin/books"
            className="px-8 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold"
          >
            Back to Books List
          </Link>
        </div>
      </div>
    </div>
  );
}
