'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect based on role
    const roleRoutes = {
      [UserRole.ADMIN]: '/admin',
      [UserRole.MERCHANT_OWNER]: '/merchant',
      [UserRole.MERCHANT_STAFF]: '/merchant',
      [UserRole.STUDENT]: '/student',
      [UserRole.PARENT_TEACHER]: '/parent',
      [UserRole.PURCHASER]: '/purchaser'
    };

    router.push(roleRoutes[selectedRole]);
  };

  const roleDescriptions = {
    [UserRole.ADMIN]: 'Full system access - manage all entities',
    [UserRole.MERCHANT_OWNER]: 'Business analytics & staff management',
    [UserRole.MERCHANT_STAFF]: 'Coupon verification only',
    [UserRole.STUDENT]: 'Personal sales tracking & referrals',
    [UserRole.PARENT_TEACHER]: 'Student & class analytics',
    [UserRole.PURCHASER]: 'Buy and manage coupons'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to YourCity Deals
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your role-specific dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Select Role (Demo)
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {roleDescriptions[selectedRole]}
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
              ← Back to Home
            </Link>
          </div>
        </form>

        {/* Role Preview */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Role Access Preview</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> Full CRUD access to all entities</p>
            <p><strong>Merchant Owner:</strong> Analytics + staff management</p>
            <p><strong>Merchant Staff:</strong> Coupon verification only</p>
            <p><strong>Student:</strong> Personal sales + referrals</p>
            <p><strong>Parent/Teacher:</strong> Student & class analytics</p>
            <p><strong>Purchaser:</strong> Buy & manage coupons</p>
          </div>
        </div>
      </div>
    </div>
  );
}
