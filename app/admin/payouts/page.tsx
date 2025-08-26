'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import { 
  Payout, 
  PayoutReceipt, 
  PayoutForm,
  formatCurrency, 
  generatePayoutReference,
  calculateSchoolPayout,
  getPayoutStatusColor,
  getPayoutStatusLabel,
  validatePayoutData,
  generatePayoutReceipt,
  generatePayoutEmailTemplate
} from '@/lib/payouts';
import Link from 'next/link';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receipt, setReceipt] = useState<PayoutReceipt | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    school: 'all',
    dateRange: '30days'
  });

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock payout data
      const mockPayouts: Payout[] = [
        {
          id: '1',
          school_id: 'school_1',
          school_name: 'Mountain Brook High School',
          amount_cents: 750000, // $7,500
          payout_date: new Date('2025-01-15'),
          payment_method: 'bank_transfer',
          reference_number: 'PAY-20250115-ABC123',
          status: 'completed',
          description: 'Monthly payout for December 2024',
          period_start: new Date('2024-12-01'),
          period_end: new Date('2024-12-31'),
          sales_count: 150,
          gross_sales_cents: 1500000, // $15,000
          net_payout_cents: 750000, // $7,500
          fee_cents: 0,
          created_by: 'admin_user',
          created_at: new Date('2025-01-10'),
          completed_at: new Date('2025-01-15'),
        },
        {
          id: '2',
          school_id: 'school_2',
          school_name: 'Vestavia Hills High School',
          amount_cents: 500000, // $5,000
          payout_date: new Date('2025-01-20'),
          payment_method: 'check',
          reference_number: 'PAY-20250120-DEF456',
          status: 'pending',
          description: 'Monthly payout for December 2024',
          period_start: new Date('2024-12-01'),
          period_end: new Date('2024-12-31'),
          sales_count: 100,
          gross_sales_cents: 1000000, // $10,000
          net_payout_cents: 500000, // $5,000
          fee_cents: 0,
          created_by: 'admin_user',
          created_at: new Date('2025-01-18'),
        },
        {
          id: '3',
          school_id: 'school_3',
          school_name: 'Homewood High School',
          amount_cents: 300000, // $3,000
          payout_date: new Date('2025-01-25'),
          payment_method: 'digital_wallet',
          reference_number: 'PAY-20250125-GHI789',
          status: 'processed',
          description: 'Monthly payout for December 2024',
          period_start: new Date('2024-12-01'),
          period_end: new Date('2024-12-31'),
          sales_count: 60,
          gross_sales_cents: 600000, // $6,000
          net_payout_cents: 300000, // $3,000
          fee_cents: 0,
          created_by: 'admin_user',
          created_at: new Date('2025-01-22'),
        },
      ];
      
      setPayouts(mockPayouts);
    } catch (error) {
      console.error('Error loading payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayout = () => {
    setShowCreateForm(true);
  };

  const handleViewReceipt = (payout: Payout) => {
    const receipt = generatePayoutReceipt(payout);
    setReceipt(receipt);
    setShowReceiptModal(true);
  };

  const handleSendReceipt = async (payout: Payout) => {
    try {
      const receipt = generatePayoutReceipt(payout);
      const emailTemplate = generatePayoutEmailTemplate(receipt);
      
      // In real implementation, send email with receipt
      console.log('Sending receipt email:', emailTemplate);
      
      // Show success message
      alert('Receipt sent successfully!');
    } catch (error) {
      console.error('Error sending receipt:', error);
      alert('Error sending receipt. Please try again.');
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    if (filters.status !== 'all' && payout.status !== filters.status) return false;
    if (filters.school !== 'all' && payout.school_id !== filters.school) return false;
    return true;
  });

  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amount_cents, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending');
  const completedPayouts = payouts.filter(p => p.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payouts...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">School Payouts</h1>
              <p className="text-gray-600 mt-2">
                Manage school payouts and generate payment receipts
              </p>
            </div>
            <button
              onClick={handleCreatePayout}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Create Payout
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Payouts</h3>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalPayouts)}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              All time total
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Payouts</h3>
            <div className="text-3xl font-bold text-yellow-600">
              {pendingPayouts.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Awaiting processing
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed Payouts</h3>
            <div className="text-3xl font-bold text-blue-600">
              {completedPayouts.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Successfully paid
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Payout</h3>
            <div className="text-3xl font-bold text-purple-600">
              {payouts.length > 0 ? formatCurrency(totalPayouts / payouts.length) : '$0.00'}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Per payout
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <select
                value={filters.school}
                onChange={(e) => setFilters(prev => ({ ...prev, school: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Schools</option>
                <option value="school_1">Mountain Brook High School</option>
                <option value="school_2">Vestavia Hills High School</option>
                <option value="school_3">Homewood High School</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payout.school_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payout.sales_count} sales
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payout.amount_cents)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(payout.gross_sales_cents)} gross
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPayoutStatusColor(payout.status)}`}>
                        {getPayoutStatusLabel(payout.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payout.payout_date.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payout.reference_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReceipt(payout)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => handleSendReceipt(payout)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Send Receipt
                        </button>
                        <Link
                          href={`/admin/payouts/${payout.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceiptModal && receipt && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Payout Receipt
                  </h3>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">YourCity Deals, LLC</h2>
                    <p className="text-gray-600">Payout Receipt</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">School Information</h4>
                      <p className="text-gray-700">{receipt.school_name}</p>
                      <p className="text-gray-600 text-sm">{receipt.school_address}</p>
                      <p className="text-gray-600 text-sm">{receipt.school_contact}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Receipt Details</h4>
                      <p className="text-gray-700">Receipt #: {receipt.receipt_number}</p>
                      <p className="text-gray-700">Date: {receipt.payout_date.toLocaleDateString()}</p>
                      <p className="text-gray-700">Period: {receipt.period}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Summary</h4>
                    <div className="bg-white p-4 rounded border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Amount Paid:</span>
                        <span className="text-xl font-bold text-green-600">{receipt.amount}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Payment Method:</span>
                        <span className="text-gray-900">{receipt.payment_method}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Reference:</span>
                        <span className="text-gray-900">{receipt.reference_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Sales Breakdown</h4>
                    <div className="bg-white p-4 rounded border">
                      {receipt.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center mb-2">
                          <span className="text-gray-700">{item.description}:</span>
                          <span className="text-gray-900">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {receipt.terms.map((term, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center text-sm text-gray-600">
                    <p>{receipt.contact_info.company_name}</p>
                    <p>{receipt.contact_info.address}</p>
                    <p>{receipt.contact_info.phone} | {receipt.contact_info.email}</p>
                    <p>{receipt.contact_info.website}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // In real implementation, download PDF
                      window.print();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
