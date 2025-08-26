'use client';

import Link from 'next/link';

const navigationGroups = [
  {
    title: 'Student Management',
    description: 'Manage student sellers and track performance',
    routes: [
      { name: 'Students List', href: '/admin/students', description: 'View all students' },
      { name: 'Add Student', href: '/admin/students/add', description: 'Register new student' },
      { name: 'Student Details', href: '/admin/students/1', description: 'View student profile' },
      { name: 'Edit Student', href: '/admin/students/edit/1', description: 'Modify student info' }
    ]
  },
  {
    title: 'Coupon Books',
    description: 'Create and manage digital coupon books',
    routes: [
      { name: 'Books List', href: '/admin/books', description: 'View all books' },
      { name: 'Add Book', href: '/admin/books/add', description: 'Create new book' },
      { name: 'Edit Book', href: '/admin/books/edit/1', description: 'Modify existing book' },
      { name: 'Preview Book', href: '/admin/books/preview/1', description: 'Customer view' }
    ]
  },
  {
    title: 'School Management',
    description: 'Manage partner schools and organizations',
    routes: [
      { name: 'Schools List', href: '/admin/schools', description: 'View all schools' },
      { name: 'Add School', href: '/admin/schools/add', description: 'Register new school' },
      { name: 'School Details', href: '/admin/schools/1', description: 'View school info' },
      { name: 'Edit School', href: '/admin/schools/edit/1', description: 'Modify school' }
    ]
  },
  {
    title: 'Business Management',
    description: 'Manage merchant partners and offers',
    routes: [
      { name: 'Businesses List', href: '/admin/businesses', description: 'View all businesses' },
      { name: 'Add Business', href: '/admin/businesses/add', description: 'Register new business' },
      { name: 'Business Details', href: '/admin/businesses/1', description: 'View business info' },
      { name: 'Edit Business', href: '/admin/businesses/edit/1', description: 'Modify business' }
    ]
  }
];

export default function NavigationOverview() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Navigation Guide</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {navigationGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.title}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </div>
            
            <div className="space-y-3">
              {group.routes.map((route) => (
                <Link
                  key={route.name}
                  href={route.href}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-blue-700">
                        {route.name}
                      </div>
                      <div className="text-sm text-gray-500">{route.description}</div>
                    </div>
                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
