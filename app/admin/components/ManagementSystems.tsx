'use client';

import Link from 'next/link';

const managementSystems = [
  {
    name: 'Students',
    href: '/admin/students',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: 'from-purple-500 to-purple-600',
    description: 'Manage student sellers, track performance, and monitor points',
    stats: '156 Active Students',
    features: ['Add/Edit Students', 'Performance Tracking', 'Points Management', 'Referral Codes']
  },
  {
    name: 'Coupon Books',
    href: '/admin/books',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    color: 'from-green-500 to-green-600',
    description: 'Create and manage digital coupon books with offers',
    stats: '8 Active Books',
    features: ['Create Books', 'Manage Offers', 'Preview & Edit', 'Performance Analytics']
  },
  {
    name: 'Schools',
    href: '/admin/schools',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'from-blue-500 to-blue-600',
    description: 'Manage partner schools and educational organizations',
    stats: '5 Partner Schools',
    features: ['School Management', 'Contact Information', 'Performance Metrics', 'Status Tracking']
  },
  {
    name: 'Businesses',
    href: '/admin/businesses',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'from-orange-500 to-orange-600',
    description: 'Manage merchant partners and their offers',
    stats: '5 Active Partners',
    features: ['Business Management', 'Offer Tracking', 'Performance Analytics', 'Category Management']
  }
];

export default function ManagementSystems() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Management Systems</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {managementSystems.map((system) => (
          <Link
            key={system.name}
            href={system.href}
            className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center mb-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${system.color} text-white shadow-lg`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={system.icon} />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700">
                  {system.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium">{system.stats}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {system.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
              <div className="grid grid-cols-2 gap-2">
                {system.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                Manage {system.name} →
              </span>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
