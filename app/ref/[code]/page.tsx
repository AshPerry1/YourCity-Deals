'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReferralData {
  code: string;
  studentName?: string;
  schoolId: string;
  schoolName: string;
  books: Array<{
    id: string;
    title: string;
    price: number;
    description: string;
  }>;
}

export default function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Handle async params
    const getParams = async () => {
      const resolvedParams = await params;
      setCode(resolvedParams.code);
      fetchReferralData(resolvedParams.code);
    };
    getParams();
  }, [params]);

  const fetchReferralData = async (code: string) => {
    try {
      // In real implementation, fetch from your database
      // For now, simulate the data
      const mockData: ReferralData = {
        code,
        studentName: 'John Smith',
        schoolId: 'school-1',
        schoolName: 'Mountain Brook High School',
        books: [
          {
            id: 'book-1',
            title: '2025 Spring Coupon Book',
            price: 2500, // $25.00
            description: 'Over 50 local business discounts and deals'
          },
          {
            id: 'book-2',
            title: 'Premium Coupon Book',
            price: 3500, // $35.00
            description: 'Premium deals with exclusive offers'
          }
        ]
      };

      setReferralData(mockData);
    } catch (err: any) {
      setError('Invalid referral link');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (bookId: string) => {
    // Redirect to purchase flow with referral data
    router.push(`/purchase?ref=${code}&book=${bookId}`);
  };

  const handleSignup = () => {
    // Redirect to signup with referral code
    router.push(`/signup?ref=${code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your referral...</p>
        </div>
      </div>
    );
  }

  if (error || !referralData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Referral Link</h1>
          <p className="text-gray-600 mb-6">This referral link appears to be invalid or has expired.</p>
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
            <div className="text-sm text-gray-600">
              Referral: {code}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {referralData.schoolName}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've been invited to join our digital coupon book program. 
            Purchase a coupon book and start saving at local businesses while supporting your school.
          </p>
        </div>

        {/* Coupon Books */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {referralData.books.map((book) => (
            <div key={book.id} className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/30 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
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
                      {referralData.schoolName}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      Multiple offers available
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
                      ${(book.price / 100).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handlePurchase(book.id)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Create your account to track your purchases and access your digital coupons.
            </p>
            <button
              onClick={handleSignup}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200"
            >
              Create Account & Purchase
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Questions? Contact us at support@yourcitydeals.com</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
