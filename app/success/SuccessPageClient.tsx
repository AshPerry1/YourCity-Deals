'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPageClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="glassCard">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase! Your coupon book has been unlocked and is now available in your account.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">
                Session ID: <span className="font-mono text-xs">{sessionId}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link href="/purchaser" className="btn-primary w-full">
              Browse More Books
            </Link>
            
            <Link href="/purchaser" className="btn-secondary w-full">
              View My Books
            </Link>
          </div>

          <div className="mt-8 p-4 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-primary-700 space-y-1 text-left">
              <li>• Check your email for a confirmation</li>
              <li>• Access your coupons in your account</li>
              <li>• Start redeeming discounts at local businesses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
