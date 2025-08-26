'use client';

export default function SalesChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>Last Year</option>
        </select>
      </div>
      
      {/* Simple Chart Placeholder */}
      <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-green-900">156</p>
          <p className="text-sm text-green-700">Books Sold</p>
          <p className="text-xs text-green-600 mt-1">+8% from last month</p>
        </div>
      </div>
      
      {/* Sales Breakdown */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lincoln High School</span>
          <span className="text-sm font-medium text-gray-900">89 books</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Washington Elementary</span>
          <span className="text-sm font-medium text-gray-900">67 books</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Total</span>
            <span className="text-sm font-bold text-green-600">156 books</span>
          </div>
        </div>
      </div>
    </div>
  );
}
