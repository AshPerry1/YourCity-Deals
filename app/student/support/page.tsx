import { Suspense } from 'react';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import HelpResources from './components/HelpResources';

export default function SupportPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Get help with your account, sales, and platform questions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <Suspense fallback={<div>Loading FAQ...</div>}>
          <FAQ />
        </Suspense>

        {/* Contact Form */}
        <Suspense fallback={<div>Loading contact form...</div>}>
          <ContactForm />
        </Suspense>
      </div>

      {/* Help Resources */}
      <Suspense fallback={<div>Loading help resources...</div>}>
        <HelpResources />
      </Suspense>
    </div>
  );
}
