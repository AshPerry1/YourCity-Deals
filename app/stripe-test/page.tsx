import StripeTest from '@/app/components/payment/StripeTest';

export default function StripeTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stripe Integration Test
          </h1>
          <p className="text-gray-600">
            Test your Stripe payment integration with sample payments
          </p>
        </div>

        <StripeTest />

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
            <ol className="space-y-3 text-sm text-gray-600">
              <li>
                <strong>1. Get your Stripe keys</strong> from your Stripe dashboard
              </li>
              <li>
                <strong>2. Update .env.local</strong> with your Stripe publishable and secret keys
              </li>
              <li>
                <strong>3. Set up webhooks</strong> in your Stripe dashboard
              </li>
              <li>
                <strong>4. Test with the button above</strong> using the provided test cards
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
