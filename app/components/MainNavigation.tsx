'use client';

import Link from 'next/link';

const portals = [
  {
    name: 'Admin Console',
    href: '/admin',
    description: 'Full system management and global analytics',
    icon: '⚙️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Merchant Console',
    href: '/merchant',
    description: 'Coupon verification and business analytics',
    icon: '🏪',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Student Portal',
    href: '/student',
    description: 'Personal sales tracking and referral management',
    icon: '👨‍🎓',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Parent/Teacher Portal',
    href: '/parent',
    description: 'Student and class-level analytics',
    icon: '👨‍🏫',
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Purchaser Portal',
    href: '/purchaser',
    description: 'Buy and manage digital coupons',
    icon: '🛒',
    color: 'from-red-500 to-red-600'
  }
];

export default function MainNavigation() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Your Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard with role-based permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => (
            <Link
              key={portal.name}
              href={portal.href}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${portal.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{portal.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{portal.description}</p>
                  </div>
                  <div className="text-3xl">{portal.icon}</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Click to access</span>
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role-Based Access Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong className="text-gray-900">Admin:</strong> Full CRUD access to all entities
              </div>
              <div>
                <strong className="text-gray-900">Merchant Owner:</strong> Analytics + staff management
              </div>
              <div>
                <strong className="text-gray-900">Merchant Staff:</strong> Coupon verification only
              </div>
              <div>
                <strong className="text-gray-900">Student:</strong> Personal sales + referrals
              </div>
              <div>
                <strong className="text-gray-900">Parent/Teacher:</strong> Student & class analytics
              </div>
              <div>
                <strong className="text-gray-900">Purchaser:</strong> Buy & manage coupons
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Demo Login
          </Link>
        </div>
      </div>
    </div>
  );
}
