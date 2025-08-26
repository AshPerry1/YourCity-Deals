'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StripeTest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test with a sample book ID
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: 'test-book-id',
          userId: 'test-user-id',
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Stripe Integration Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Test your Stripe integration with a sample payment:
        </p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Success: 4242 4242 4242 4242</li>
          <li>• Decline: 4000 0000 0000 0002</li>
          <li>• 3D Secure: 4000 0025 0000 3155</li>
        </ul>
      </div>

      <button
        onClick={handleTestPayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Test Payment'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Make sure your Stripe keys are configured in .env.local</p>
      </div>
    </div>
  );
}
