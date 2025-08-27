'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminHeader() {
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has admin access
    const adminAccess = sessionStorage.getItem('adminAccess') === 'true';
    setHasAdminAccess(adminAccess);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAccess');
    setHasAdminAccess(false);
    router.push('/');
  };

  if (!hasAdminAccess) {
    return null;
  }

  return (
    <div className="bg-blue-600 text-white px-4 py-2 text-sm text-center">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <span className="font-medium">🔓 Admin Mode Active</span>
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin" 
            className="hover:text-blue-200 transition-colors"
          >
            Admin Console
          </Link>
          <Link 
            href="/student" 
            className="hover:text-blue-200 transition-colors"
          >
            Student Portal
          </Link>
          <Link 
            href="/merchant" 
            className="hover:text-blue-200 transition-colors"
          >
            Merchant Console
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-blue-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
