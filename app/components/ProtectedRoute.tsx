'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, UserRole, hasPermission } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: {
    resource: string;
    action: string;
    conditions?: Record<string, any>;
  };
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallback
}: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Check role-based access
        // In demo mode, allow access to all portals for testing
        const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
                          !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                          process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url';
        
        // In demo mode, bypass all role checks - allow access to everything
        if (!isDemoMode && requiredRole && currentUser.role !== requiredRole) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Check permission-based access
        if (requiredPermission) {
          const permitted = hasPermission(
            currentUser,
            requiredPermission.resource,
            requiredPermission.action,
            requiredPermission.conditions
          );
          setHasAccess(permitted);
        } else {
          setHasAccess(true);
        }

        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setHasAccess(false);
        setLoading(false);
      }
    }

    checkAuth();
  }, [requiredRole, requiredPermission]);

  if (loading) {
    // Detect theme based on current path for appropriate spinner color
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    let spinnerColor = 'border-blue-600'; // default
    
    if (currentPath.startsWith('/student')) {
      spinnerColor = 'border-green-600';
    } else if (currentPath.startsWith('/teacher')) {
      spinnerColor = 'border-orange-600';
    } else if (currentPath.startsWith('/merchant')) {
      spinnerColor = 'border-purple-600';
    } else if (currentPath.startsWith('/purchaser')) {
      spinnerColor = 'border-indigo-600';
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${spinnerColor} mx-auto`}></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
