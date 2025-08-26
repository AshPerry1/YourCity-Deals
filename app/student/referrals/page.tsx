import { Suspense } from 'react';
import ReferralLinks from './components/ReferralLinks';
import ReferralStats from './components/ReferralStats';
import ReferralHistory from './components/ReferralHistory';

export default function ReferralsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Referrals</h1>
            <p className="text-gray-600">Manage your referral links and track their performance</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-gray-600">Total Clicks</p>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <ReferralStats />
      </Suspense>

      {/* Referral Links */}
      <Suspense fallback={<div>Loading referral links...</div>}>
        <ReferralLinks />
      </Suspense>

      {/* Referral History */}
      <Suspense fallback={<div>Loading history...</div>}>
        <ReferralHistory />
      </Suspense>
    </div>
  );
}
