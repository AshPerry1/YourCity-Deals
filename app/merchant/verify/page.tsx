'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CouponData {
  id: string;
  code: string;
  customerName: string;
  offerTitle: string;
  businessName: string;
  discountValue: string;
  discountType: 'percentage' | 'fixed' | 'bogo';
  status: 'active' | 'redeemed' | 'expired';
  validUntil: string;
  purchaseDate: string;
}

interface RedemptionHistory {
  id: string;
  couponCode: string;
  customerName: string;
  amount: number;
  redeemedAt: string;
  merchantNotes: string;
}

export default function MerchantVerify() {
  const router = useRouter();
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([]);
  const [activeTab, setActiveTab] = useState('verify');

  useEffect(() => {
    // Load mock redemption history
    setRedemptionHistory([
      {
        id: '1',
        couponCode: 'YC12345678',
        customerName: 'Sarah Johnson',
        amount: 25,
        redeemedAt: '2024-01-15 14:30',
        merchantNotes: 'Great customer!'
      },
      {
        id: '2',
        couponCode: 'YC87654321',
        customerName: 'Mike Chen',
        amount: 30,
        redeemedAt: '2024-01-14 16:45',
        merchantNotes: 'Returning customer'
      }
    ]);
  }, []);

  const handleScanQR = () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Simulate QR code scanning
    setTimeout(() => {
      const mockCoupon: CouponData = {
        id: '123',
        code: 'YC12345678',
        customerName: 'Sarah Johnson',
        offerTitle: '20% Off Any Purchase',
        businessName: 'Local Restaurant',
        discountValue: '20',
        discountType: 'percentage',
        status: 'active',
        validUntil: '2024-02-15',
        purchaseDate: '2024-01-10'
      };
      
      setCouponData(mockCoupon);
      setLoading(false);
    }, 2000);
  };

  const handleManualVerify = () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'YC12345678') {
        const mockCoupon: CouponData = {
          id: '123',
          code: 'YC12345678',
          customerName: 'Sarah Johnson',
          offerTitle: '20% Off Any Purchase',
          businessName: 'Local Restaurant',
          discountValue: '20',
          discountType: 'percentage',
          status: 'active',
          validUntil: '2024-02-15',
          purchaseDate: '2024-01-10'
        };
        setCouponData(mockCoupon);
      } else if (couponCode.toUpperCase() === 'EXPIRED') {
        const expiredCoupon: CouponData = {
          id: '456',
          code: 'EXPIRED',
          customerName: 'John Doe',
          offerTitle: 'Free Coffee',
          businessName: 'Coffee Shop',
          discountValue: '100',
          discountType: 'percentage',
          status: 'expired',
          validUntil: '2024-01-01',
          purchaseDate: '2023-12-15'
        };
        setCouponData(expiredCoupon);
      } else {
        setError('Invalid coupon code');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRedeem = () => {
    if (!couponData) return;

    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate redemption
    setTimeout(() => {
      if (couponData.status === 'active') {
        setSuccess(`Coupon ${couponData.code} successfully redeemed!`);
        setCouponData({ ...couponData, status: 'redeemed' });
        
        // Add to history
        const newRedemption: RedemptionHistory = {
          id: Date.now().toString(),
          couponCode: couponData.code,
          customerName: couponData.customerName,
          amount: parseInt(couponData.discountValue),
          redeemedAt: new Date().toLocaleString(),
          merchantNotes: ''
        };
        setRedemptionHistory([newRedemption, ...redemptionHistory]);
      } else {
        setError('This coupon cannot be redeemed');
      }
      setLoading(false);
    }, 1000);
  };

  const clearResults = () => {
    setCouponData(null);
    setCouponCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Merchant Portal</h1>
              <p className="text-gray-600">Verify and redeem coupons</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'verify'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verify Coupons
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Redemption History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'verify' && (
          <div className="space-y-6">
            {/* Verification Methods */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Verify Coupon</h3>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setScanMode('qr')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      scanMode === 'qr'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="font-medium">Scan QR Code</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setScanMode('manual')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                      scanMode === 'manual'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <p className="font-medium">Enter Code</p>
                    </div>
                  </button>
                </div>

                {scanMode === 'qr' && (
                  <div className="text-center">
                    <div className="w-64 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 mx-auto mb-4 flex items-center justify-center">
                      {loading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Scanning...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                          <p className="text-gray-600">Position QR code in frame</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleScanQR}
                      disabled={loading}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Scanning...' : 'Start Scan'}
                    </button>
                  </div>
                )}

                {scanMode === 'manual' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code (e.g., YC12345678)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleManualVerify}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying...' : 'Verify Coupon'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-red-800">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-green-800">{success}</p>
                </div>
              </div>
            )}

            {/* Coupon Details */}
            {couponData && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Coupon Details</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Coupon Information</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Code</dt>
                          <dd className="text-lg font-mono text-gray-900">{couponData.code}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Customer</dt>
                          <dd className="text-lg text-gray-900">{couponData.customerName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Offer</dt>
                          <dd className="text-lg text-gray-900">{couponData.offerTitle}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Discount</dt>
                          <dd className="text-lg text-gray-900">
                            {couponData.discountType === 'percentage' ? `${couponData.discountValue}%` : `$${couponData.discountValue}`}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Status & Dates</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              couponData.status === 'active' ? 'bg-green-100 text-green-800' :
                              couponData.status === 'redeemed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {couponData.status}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                          <dd className="text-lg text-gray-900">{couponData.validUntil}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                          <dd className="text-lg text-gray-900">{couponData.purchaseDate}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    {couponData.status === 'active' && (
                      <button
                        onClick={handleRedeem}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Redeem Coupon'}
                      </button>
                    )}
                    <button
                      onClick={clearResults}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                    >
                      Clear Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Redemption History</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {redemptionHistory.map((redemption) => (
                        <tr key={redemption.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{redemption.redeemedAt}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{redemption.couponCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{redemption.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${redemption.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{redemption.merchantNotes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
