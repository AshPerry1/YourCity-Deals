'use client';

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last Year</option>
        </select>
      </div>
      
      {/* Simple Chart Placeholder */}
      <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-blue-900">$24,580</p>
          <p className="text-sm text-blue-700">Total Revenue</p>
          <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
        </div>
      </div>
      
      {/* Revenue Breakdown */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Coupon Books</span>
          <span className="text-sm font-medium text-gray-900">$18,420</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Processing Fees</span>
          <span className="text-sm font-medium text-gray-900">$6,160</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-sm font-bold text-blue-600">$24,580</span>
          </div>
        </div>
      </div>
    </div>
  );
}
