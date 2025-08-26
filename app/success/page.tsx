import { Suspense } from 'react';
import SuccessPageClient from './SuccessPageClient';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="glassCard">
            <div className="animate-pulse">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SuccessPageClient />
    </Suspense>
  );
}
