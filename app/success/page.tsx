'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface PurchaseDetails {
  id: string;
  book_id: string;
  amount_cents: number;
  ref_code?: string;
  created_at: string;
  book: {
    name: string;
    description?: string;
  };
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (sessionId) {
      fetchPurchaseDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchPurchaseDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          book_id,
          amount_cents,
          ref_code,
          created_at,
          coupon_books (
            name,
            description
          )
        `)
        .eq('stripe_checkout_session_id', sessionId)
        .single();

      if (error) throw error;

      if (data) {
        setPurchase({
          id: data.id,
          book_id: data.book_id,
          amount_cents: data.amount_cents,
          ref_code: data.ref_code,
          created_at: data.created_at,
          book: data.coupon_books
        });
      }
    } catch (err) {
      console.error('Error fetching purchase details:', err);
      setError('Unable to load purchase details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your purchase details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Purchase</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Purchase Successful!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your purchase. Your coupon book is now available.
          </p>
        </div>

        {/* Purchase Details */}
        {purchase && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
            </div>
            
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{purchase.id}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(purchase.created_at)}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Coupon Book</dt>
                  <dd className="mt-1 text-sm text-gray-900">{purchase.book.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-semibold">{formatPrice(purchase.amount_cents)}</dd>
                </div>
                
                {purchase.ref_code && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Referral Code Used</dt>
                    <dd className="mt-1 text-sm text-gray-900">{purchase.ref_code}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">What's Next?</h2>
          </div>
          
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                    <span className="text-sm font-medium text-purple-600">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Access Your Coupons</h3>
                  <p className="text-sm text-gray-500">
                    Your coupon book has been added to your account. You can view and use your coupons anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                    <span className="text-sm font-medium text-purple-600">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Visit Local Businesses</h3>
                  <p className="text-sm text-gray-500">
                    Show your digital coupons to participating merchants to redeem your savings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100">
                    <span className="text-sm font-medium text-purple-600">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Share with Friends</h3>
                  <p className="text-sm text-gray-500">
                    Earn points by sharing your referral link with friends and family.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/student/books"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View My Books
          </Link>
          
          <Link
            href="/student/coupons"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            My Coupons
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Return Home
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@yourcitydeals.com" className="text-purple-600 hover:text-purple-500">
              support@yourcitydeals.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
