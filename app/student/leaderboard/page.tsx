import { Suspense } from 'react';
import LeaderboardTable from './components/LeaderboardTable';
import LeaderboardFilters from './components/LeaderboardFilters';
import LeaderboardStats from './components/LeaderboardStats';

export default function LeaderboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">See how you rank against other student sellers</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">#3</p>
            <p className="text-sm text-gray-600">Your Rank</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <LeaderboardStats />
      </Suspense>

      {/* Filters */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <LeaderboardFilters />
      </Suspense>

      {/* Leaderboard Table */}
      <Suspense fallback={<div>Loading leaderboard...</div>}>
        <LeaderboardTable />
      </Suspense>
    </div>
  );
}
