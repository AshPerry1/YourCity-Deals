'use client';

import Link from 'next/link';

export default function SchoolsHeader() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Schools Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage educational institutions and set fundraising goals
          </p>
        </div>
        <Link
          href="/admin/schools/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New School
        </Link>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">Active Schools</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">48</div>
          <div className="text-sm text-gray-600">Total Classes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">$24,500</div>
          <div className="text-sm text-gray-600">Total Goals</div>
        </div>
      </div>
    </div>
  );
}
