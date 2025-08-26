import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based route mapping
const roleRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/merchant': ['merchant_owner', 'merchant_staff'],
  '/student': ['student'],
  '/parent': ['parent_teacher'],
  '/purchaser': ['purchaser'],
};

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/catalog'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
                    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                    process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url' ||
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key';

  // In demo mode, allow all routes and let ProtectedRoute handle role-based access
  if (isDemoMode) {
    return NextResponse.next();
  }

  // Check if route requires specific role
  const requiredRoles = roleRoutes[pathname];
  if (requiredRoles) {
    // In a real app, you would check the user's role from the session/token
    // For demo purposes, we'll allow access and let the ProtectedRoute component handle it
    return NextResponse.next();
  }

  // For other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
