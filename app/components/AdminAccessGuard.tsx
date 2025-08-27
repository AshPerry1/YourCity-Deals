'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Routes that require admin access
const ADMIN_ROUTES = ['/admin', '/student', '/merchant', '/purchaser', '/parent'];

export default function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if current route requires admin access
    const requiresAdminAccess = ADMIN_ROUTES.some(route => pathname.startsWith(route));
    
    if (requiresAdminAccess) {
      const hasAdminAccess = sessionStorage.getItem('adminAccess') === 'true';
      
      if (!hasAdminAccess) {
        // Redirect to coming soon page if no admin access
        router.push('/');
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
