'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '../../lib/roleContext';
import { mockDataService } from '../../lib/mockDataService';
import { Referral, Book } from '../../lib/types';

export default function SellerPortal() {
  const { currentRole, isAuthenticated, currentUser, availableRoles, switchRole } = useRole();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'referrals' | 'earnings' | 'leaderboard'>('dashboard');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (currentRole === 'seller') {
      fetchData();
    }
  }, [currentRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockReferrals: Referral[] = [
        {
          id: 'ref-1',
          sellerId: currentUser || 'user-1',
          linkId: 'link-1',
          clicks: 45,
          adds: 12,
          purchases: 8,
          bookId: 'book-1',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 'ref-2',
          sellerId: currentUser || 'user-1',
          linkId: 'link-2',
          clicks: 23,
          adds: 7,
          purchases: 4,
          bookId: 'book-2',
          createdAt: new Date('2024-01-20')
        }
      ];

      setReferrals(mockReferrals);
      setBooks(mockDataService.getPublishedBooks());
      setReferralLink(`https://yourcitydeals.com/ref/${currentUser || 'user-1'}`);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  // Redirect if not seller
  if (!isAuthenticated || currentRole !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need seller privileges to access this portal.</p>
          {availableRoles.includes('seller') && (
            <button
              onClick={() => switchRole('seller')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Switch to Seller Role
            </button>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller portal...</p>
        </div>
      </div>
    );
  }

  const totalClicks = referrals.reduce((sum, ref) => sum + ref.clicks, 0);
  const totalAdds = referrals.reduce((sum, ref) => sum + ref.adds, 0);
  const totalPurchases = referrals.reduce((sum, ref) => sum + ref.purchases, 0);
  const totalEarnings = totalPurchases * 5; // $5 per purchase

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Seller Portal</h1>
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-500">- Earn by sharing deals</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-500">Ambassador Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'referrals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Referrals
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'earnings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'leaderboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leaderboard
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardTab totalClicks={totalClicks} totalAdds={totalAdds} totalPurchases={totalPurchases} totalEarnings={totalEarnings} referralLink={referralLink} onCopyLink={copyReferralLink} />}
        {activeTab === 'referrals' && <ReferralsTab referrals={referrals} books={books} />}
        {activeTab === 'earnings' && <EarningsTab totalEarnings={totalEarnings} referrals={referrals} />}
        {activeTab === 'leaderboard' && <LeaderboardTab />}
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ totalClicks, totalAdds, totalPurchases, totalEarnings, referralLink, onCopyLink }: { 
  totalClicks: number; 
  totalAdds: number; 
  totalPurchases: number; 
  totalEarnings: number; 
  referralLink: string; 
  onCopyLink: () => void; 
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Performance</h2>
      
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
          <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
          <p className="text-sm text-blue-600">+12% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Adds to Cart</h3>
          <p className="text-3xl font-bold text-gray-900">{totalAdds}</p>
          <p className="text-sm text-green-600">+8% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Purchases</h3>
          <p className="text-3xl font-bold text-gray-900">{totalPurchases}</p>
          <p className="text-sm text-purple-600">+15% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
          <p className="text-3xl font-bold text-gray-900">${totalEarnings}</p>
          <p className="text-sm text-green-600">+20% from last week</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h3>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
          <button
            onClick={onCopyLink}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share this link with friends and family to earn $5 for every book they purchase!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Share on Social Media</h3>
          <p className="text-blue-100 mb-4">Share your referral link on Facebook, Twitter, or Instagram to reach more people.</p>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-50 transition-colors">
            Share Now
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Download QR Code</h3>
          <p className="text-green-100 mb-4">Download a QR code for your referral link to share in person or on flyers.</p>
          <button className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-50 transition-colors">
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}

// Referrals Tab Component
function ReferralsTab({ referrals, books }: { referrals: Referral[], books: Book[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Referrals</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.map((referral) => {
                const book = books.find(b => b.id === referral.bookId);
                return (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book?.name || 'Unknown Book'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.adds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {referral.purchases}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${referral.purchases * 5}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Earnings Tab Component
function EarningsTab({ totalEarnings, referrals }: { totalEarnings: number; referrals: Referral[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Earnings & Payouts</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Balance</h3>
          <div className="text-4xl font-bold text-green-600 mb-2">${totalEarnings}</div>
          <p className="text-sm text-gray-600 mb-4">Available for payout</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Request Payout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payout History</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">$25.00</p>
                <p className="text-sm text-gray-500">January 15, 2024</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">$15.00</p>
                <p className="text-sm text-gray-500">January 1, 2024</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Leaderboard Tab Component
function LeaderboardTab() {
  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', earnings: 125, referrals: 25 },
    { rank: 2, name: 'Mike Chen', earnings: 95, referrals: 19 },
    { rank: 3, name: 'Emily Davis', earnings: 80, referrals: 16 },
    { rank: 4, name: 'Alex Rodriguez', earnings: 65, referrals: 13 },
    { rank: 5, name: 'Jessica Kim', earnings: 55, referrals: 11 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Top Sellers</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            {leaderboardData.map((seller) => (
              <div key={seller.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    seller.rank === 1 ? 'bg-yellow-500' :
                    seller.rank === 2 ? 'bg-gray-400' :
                    seller.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {seller.rank}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.referrals} referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${seller.earnings}</p>
                  <p className="text-sm text-gray-500">Total earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
