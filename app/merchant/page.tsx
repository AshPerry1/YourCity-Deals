'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '../lib/roleContext';
import { mockDataService } from '../lib/mockDataService';
import { Merchant, Offer, BookOffer, Redemption } from '../lib/types';

export default function MerchantConsole() {
  const { currentRole, isAuthenticated } = useRole();
  const [activeTab, setActiveTab] = useState<'offers' | 'redemptions' | 'analytics' | 'redeem-station'>('offers');
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookOffers, setBookOffers] = useState<BookOffer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentRole === 'merchant_manager') {
      fetchData();
    }
  }, [currentRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock merchant data - in real app this would come from user's merchant association
      const mockMerchant = mockDataService.getMerchants()[0]; // Joe's Pizza
      setMerchant(mockMerchant);
      setOffers(mockDataService.getOffersByMerchant(mockMerchant.id));
      setBookOffers(mockDataService.getBookOffers().filter(bo => 
        offers.some(o => o.id === bo.offerId && o.merchantId === mockMerchant.id)
      ));
      setRedemptions(mockDataService.getRedemptionsByMerchant(mockMerchant.id));
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not merchant manager
  if (!isAuthenticated || currentRole !== 'merchant_manager') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need merchant manager privileges to access this console.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading merchant console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Merchant Console</h1>
              {merchant && (
                <span className="ml-4 text-sm text-gray-500">- {merchant.name}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Merchant Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('offers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'offers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => setActiveTab('redemptions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'redemptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Redemptions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('redeem-station')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'redeem-station'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Redeem Station
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'offers' && <OffersTab offers={offers} bookOffers={bookOffers} />}
        {activeTab === 'redemptions' && <RedemptionsTab redemptions={redemptions} />}
        {activeTab === 'analytics' && <AnalyticsTab redemptions={redemptions} />}
        {activeTab === 'redeem-station' && <RedeemStationTab />}
      </div>
    </div>
  );
}

// Offers Tab Component
function OffersTab({ offers, bookOffers }: { offers: Offer[], bookOffers: BookOffer[] }) {
  const [showCreateOffer, setShowCreateOffer] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">My Offers</h2>
        <button 
          onClick={() => setShowCreateOffer(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Offer
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => {
          const bookOffer = bookOffers.find(bo => bo.offerId === offer.id);
          return (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bookOffer?.state === 'published' ? 'bg-green-100 text-green-800' :
                  bookOffer?.state === 'approved' ? 'bg-blue-100 text-blue-800' :
                  bookOffer?.state === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {bookOffer?.state || 'draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount:</span>
                  <span className="font-medium">{offer.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize">{bookOffer?.state || 'Not submitted'}</span>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  Submit to Books
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showCreateOffer && (
        <CreateOfferModal onClose={() => setShowCreateOffer(false)} />
      )}
    </div>
  );
}

// Redemptions Tab Component
function RedemptionsTab({ redemptions }: { redemptions: Redemption[] }) {
  const [dateRange, setDateRange] = useState('7d');

  const exportCSV = () => {
    // Mock CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Time,Coupon,Method,Location\n" +
      redemptions.map(r => 
        `${r.verifiedAt.toLocaleDateString()},${r.verifiedAt.toLocaleTimeString()},Coupon-${r.walletCouponId},${r.method},Store`
      ).join('\n');
    
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `redemptions-${dateRange}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Redemptions</h2>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {redemptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No redemptions found for this period
                  </td>
                </tr>
              ) : (
                redemptions.map((redemption) => (
                  <tr key={redemption.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {redemption.verifiedAt.toLocaleDateString()} {redemption.verifiedAt.toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Coupon-{redemption.walletCouponId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {redemption.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Store Location
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab({ redemptions }: { redemptions: Redemption[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Redemptions</h3>
          <p className="text-3xl font-bold text-gray-900">{redemptions.length}</p>
          <p className="text-sm text-green-600">+5% from last week</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">QR Scans</h3>
          <p className="text-3xl font-bold text-gray-900">{redemptions.filter(r => r.method === 'qr').length}</p>
          <p className="text-sm text-blue-600">80% of total</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">PIN Entries</h3>
          <p className="text-3xl font-bold text-gray-900">{redemptions.filter(r => r.method === 'pin').length}</p>
          <p className="text-sm text-purple-600">20% of total</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Today's Redemptions</h3>
          <p className="text-3xl font-bold text-gray-900">
            {redemptions.filter(r => 
              r.verifiedAt.toDateString() === new Date().toDateString()
            ).length}
          </p>
          <p className="text-sm text-green-600">+2 from yesterday</p>
        </div>
      </div>
    </div>
  );
}

// Redeem Station Tab Component
function RedeemStationTab() {
  const [couponCode, setCouponCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    status: 'idle' | 'checking' | 'valid' | 'invalid' | 'used' | 'expired';
  }>({
    valid: false,
    message: '',
    status: 'idle'
  });

  const verifyCoupon = async () => {
    if (!couponCode.trim()) return;

    setVerificationResult({ valid: false, message: '', status: 'checking' });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock verification logic
    const random = Math.random();
    if (random > 0.7) {
      setVerificationResult({
        valid: true,
        message: '✅ Valid & Redeemed Now',
        status: 'valid'
      });
    } else if (random > 0.5) {
      setVerificationResult({
        valid: false,
        message: '❌ Already Used',
        status: 'used'
      });
    } else {
      setVerificationResult({
        valid: false,
        message: '❌ Expired/Invalid',
        status: 'expired'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Redeem Station</h2>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code or Enter Code</h3>
            <p className="text-sm text-gray-600">Enter the coupon code manually or scan the QR code</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code..."
                className="w-full px-4 py-3 text-center text-lg font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && verifyCoupon()}
              />
            </div>
            
            <button
              onClick={verifyCoupon}
              disabled={verificationResult.status === 'checking'}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {verificationResult.status === 'checking' ? 'Verifying...' : 'Verify Coupon'}
            </button>
          </div>
          
          {verificationResult.status !== 'idle' && (
            <div className={`mt-6 p-4 rounded-lg text-center text-lg font-semibold ${
              verificationResult.status === 'valid' ? 'bg-green-100 text-green-800' :
              verificationResult.status === 'used' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {verificationResult.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create Offer Modal Component
function CreateOfferModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    terms: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock implementation
    alert('Offer created successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Offer</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="e.g., 20% Off, Free Appetizer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
