'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PurchaseData {
  bookId: string;
  bookTitle: string;
  price: number;
  description: string;
  referralCode?: string;
  schoolName: string;
}

export default function PurchasePage() {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const bookId = searchParams.get('book');
    const referralCode = searchParams.get('ref');
    
    if (!bookId) {
      setError('No book selected');
      return;
    }

    // Fetch book details and referral data
    fetchPurchaseData(bookId, referralCode);
  }, [searchParams]);

  const fetchPurchaseData = async (bookId: string, referralCode?: string | null) => {
    try {
      // In real implementation, fetch from your database
      const mockData: PurchaseData = {
        bookId,
        bookTitle: '2025 Spring Coupon Book',
        price: 2500, // $25.00
        description: 'Over 50 local business discounts and deals',
        referralCode: referralCode || undefined,
        schoolName: 'Mountain Brook High School'
      };

      setPurchaseData(mockData);
    } catch (err: any) {
      setError('Failed to load book details');
    }
  };

  const handlePurchase = async () => {
    if (!purchaseData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: purchaseData.bookId,
          userId: 'temp-user-id', // Will be replaced with actual user ID after signup
          referralCode: purchaseData.referralCode,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        setError(error);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripe failed to load');
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupFirst = () => {
    // Redirect to signup with referral code and return URL
    const returnUrl = `/purchase?book=${purchaseData?.bookId}&ref=${purchaseData?.referralCode}`;
    router.push(`/signup?ref=${purchaseData?.referralCode}&return=${encodeURIComponent(returnUrl)}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            {purchaseData.referralCode && (
              <div className="text-sm text-gray-600">
                Referral: {purchaseData.referralCode}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Purchase Coupon Book
            </h1>
            <p className="text-gray-600">
              {purchaseData.schoolName}
            </p>
          </div>

          {/* Book Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {purchaseData.bookTitle}
                </h2>
                <p className="text-gray-600 mb-4">
                  {purchaseData.description}
                </p>
              </div>
              <button
                onClick={() => router.push(`/books/${purchaseData.bookId}/preview${purchaseData.referralCode ? `?ref=${purchaseData.referralCode}` : ''}`)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Preview Offers →
              </button>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              ${(purchaseData.price / 100).toFixed(2)}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Digital access to all coupons
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Mobile-friendly interface
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Support your school
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Save money at local businesses
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Purchase Now'}
            </button>
            
            <button
              onClick={handleSignupFirst}
              className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors mb-3"
            >
              Create Account First
            </button>
            
            <button
              onClick={() => router.push(`/quick-signup?book=${purchaseData.bookId}&ref=${purchaseData.referralCode || ''}&return=${encodeURIComponent('/purchase?book=' + purchaseData.bookId)}`)}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Quick Signup (Phone/Email)
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Secure payment powered by Stripe</p>
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
