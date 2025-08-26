'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import { 
  FinancialStatement, 
  SalesMetrics, 
  formatCurrency, 
  getPeriodOptions,
  exportToCSV,
  calculateFinancialMetrics,
  CHART_OF_ACCOUNTS
} from '@/lib/accounting';

export default function AdminAccountingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState(getPeriodOptions()[0]);
  const [loading, setLoading] = useState(true);
  const [financialStatement, setFinancialStatement] = useState<FinancialStatement | null>(null);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock financial data
      const mockFinancialStatement: FinancialStatement = {
        period: {
          start_date: selectedPeriod.startDate,
          end_date: selectedPeriod.endDate,
        },
        income_statement: {
          revenue: 1250000, // $12,500
          expenses: 875000,  // $8,750
          net_income: 375000, // $3,750
          gross_sales: 1500000, // $15,000
          discounts: 75000,   // $750
          stripe_fees: 45000, // $450
          partner_payouts: 750000, // $7,500
          refunds: 50000,     // $500
        },
        balance_sheet: {
          assets: 2500000,    // $25,000
          liabilities: 500000, // $5,000
          equity: 2000000,    // $20,000
          cash: 2000000,      // $20,000
          payouts_payable: 500000, // $5,000
        },
        cash_movements: {
          beginning_balance: 1500000, // $15,000
          ending_balance: 2000000,    // $20,000
          net_change: 500000,         // $5,000
          inflows: 1500000,           // $15,000
          outflows: 1000000,          // $10,000
        },
      };

      const mockSalesMetrics: SalesMetrics = {
        gross_sales_cents: 1500000,
        refunds_cents: 50000,
        discounts_cents: 75000,
        stripe_fees_cents: 45000,
        partner_payouts_cents: 750000,
        net_sales_cents: 580000,
      };

      setFinancialStatement(mockFinancialStatement);
      setSalesMetrics(mockSalesMetrics);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: typeof selectedPeriod) => {
    setSelectedPeriod(period);
    setShowCustomDatePicker(false);
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      const newPeriod = {
        label: 'Custom Period',
        startDate: new Date(customStartDate),
        endDate: new Date(customEndDate),
      };
      setSelectedPeriod(newPeriod);
      setShowCustomDatePicker(false);
    }
  };

  const exportFinancialData = () => {
    if (!financialStatement) return;

    const data = [
      {
        'Period': `${selectedPeriod.label}`,
        'Start Date': selectedPeriod.startDate.toLocaleDateString(),
        'End Date': selectedPeriod.endDate.toLocaleDateString(),
        'Gross Sales': formatCurrency(financialStatement.income_statement.gross_sales),
        'Net Sales': formatCurrency(financialStatement.income_statement.revenue),
        'Stripe Fees': formatCurrency(financialStatement.income_statement.stripe_fees),
        'Partner Payouts': formatCurrency(financialStatement.income_statement.partner_payouts),
        'Refunds': formatCurrency(financialStatement.income_statement.refunds),
        'Net Income': formatCurrency(financialStatement.income_statement.net_income),
        'Cash Balance': formatCurrency(financialStatement.balance_sheet.cash),
        'Payouts Payable': formatCurrency(financialStatement.balance_sheet.payouts_payable),
      },
    ];

    exportToCSV(data, `financial-statement-${selectedPeriod.label.toLowerCase().replace(' ', '-')}.csv`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial data...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Financial Accounting</h1>
              <p className="text-gray-600 mt-2">
                Complete financial statements and sales metrics for {selectedPeriod.label}
              </p>
            </div>
            <button
              onClick={exportFinancialData}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Period</h2>
          <div className="flex flex-wrap gap-2">
            {getPeriodOptions().map((period) => (
              <button
                key={period.label}
                onClick={() => handlePeriodChange(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedPeriod.label === period.label
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomDatePicker(!showCustomDatePicker)}
              className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Custom Range
            </button>
          </div>

          {showCustomDatePicker && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomDateSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {financialStatement && salesMetrics && (
          <>
            {/* Sales Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gross Sales</h3>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(salesMetrics.gross_sales_cents)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Total sales before deductions
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Sales</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(salesMetrics.net_sales_cents)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Sales after all deductions
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Income</h3>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(financialStatement.income_statement.net_income)}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Revenue minus expenses
                </p>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Statement */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Statement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Gross Sales</span>
                    <span className="font-medium">{formatCurrency(financialStatement.income_statement.gross_sales)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span>Discounts</span>
                    <span>-{formatCurrency(financialStatement.income_statement.discounts)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Revenue</span>
                      <span>{formatCurrency(financialStatement.income_statement.revenue)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Expenses</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-red-600">
                        <span>Stripe Fees</span>
                        <span>-{formatCurrency(financialStatement.income_statement.stripe_fees)}</span>
                      </div>
                      <div className="flex justify-between items-center text-red-600">
                        <span>Partner Payouts</span>
                        <span>-{formatCurrency(financialStatement.income_statement.partner_payouts)}</span>
                      </div>
                      <div className="flex justify-between items-center text-red-600">
                        <span>Refunds</span>
                        <span>-{formatCurrency(financialStatement.income_statement.refunds)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Net Income</span>
                      <span className={financialStatement.income_statement.net_income >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialStatement.income_statement.net_income)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Sheet */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Sheet</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Assets</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Cash</span>
                        <span className="font-medium">{formatCurrency(financialStatement.balance_sheet.cash)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Assets</span>
                          <span>{formatCurrency(financialStatement.balance_sheet.assets)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Liabilities</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Payouts Payable</span>
                        <span className="font-medium">{formatCurrency(financialStatement.balance_sheet.payouts_payable)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Liabilities</span>
                          <span>{formatCurrency(financialStatement.balance_sheet.liabilities)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Equity</span>
                      <span className={financialStatement.balance_sheet.equity >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(financialStatement.balance_sheet.equity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Flow */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Movements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialStatement.cash_movements.beginning_balance)}
                  </div>
                  <div className="text-sm text-gray-600">Beginning Balance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialStatement.cash_movements.inflows)}
                  </div>
                  <div className="text-sm text-gray-600">Cash Inflows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(financialStatement.cash_movements.outflows)}
                  </div>
                  <div className="text-sm text-gray-600">Cash Outflows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(financialStatement.cash_movements.ending_balance)}
                  </div>
                  <div className="text-sm text-gray-600">Ending Balance</div>
                </div>
              </div>
            </div>

            {/* Chart of Accounts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart of Accounts</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {CHART_OF_ACCOUNTS.map((account) => (
                      <tr key={account.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            account.type === 'asset' ? 'bg-green-100 text-green-800' :
                            account.type === 'liability' ? 'bg-red-100 text-red-800' :
                            account.type === 'equity' ? 'bg-blue-100 text-blue-800' :
                            account.type === 'revenue' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
