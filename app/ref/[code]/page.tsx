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
            <div key={book.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-4">{book.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${(book.price / 100).toFixed(2)}
                </span>
                <button
                  onClick={() => handlePurchase(book.id)}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Purchase
                </button>
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
