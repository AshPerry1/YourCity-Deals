import { Suspense } from 'react';
import SalesOverview from './components/SalesOverview';
import SalesHistory from './components/SalesHistory';
import PointsBreakdown from './components/PointsBreakdown';

export default function SalesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales & Points</h1>
            <p className="text-gray-600">Track your sales performance and points earned</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">2,450</p>
            <p className="text-sm text-gray-600">Total Points</p>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <Suspense fallback={<div>Loading sales overview...</div>}>
        <SalesOverview />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales History */}
        <Suspense fallback={<div>Loading sales history...</div>}>
          <SalesHistory />
        </Suspense>

        {/* Points Breakdown */}
        <Suspense fallback={<div>Loading points breakdown...</div>}>
          <PointsBreakdown />
        </Suspense>
      </div>
    </div>
  );
}
