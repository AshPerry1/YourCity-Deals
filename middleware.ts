import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';

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
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.twilio.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    let rateLimitConfig: { limit: number; window: number } = RATE_LIMITS.API;
    
    // Specific rate limits for different endpoints
    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      rateLimitConfig = RATE_LIMITS.AUTH;
    } else if (request.nextUrl.pathname.startsWith('/api/checkout/')) {
      rateLimitConfig = RATE_LIMITS.PAYMENT;
    } else if (request.nextUrl.pathname.startsWith('/api/admin/')) {
      rateLimitConfig = RATE_LIMITS.ADMIN;
    }
    
    const rateLimitResult = checkRateLimit(request, rateLimitConfig);
    
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitConfig.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        }
      });
    }
    
    // Add rate limit headers to API responses
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
  }
  
  // Cache control headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } else if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (request.nextUrl.pathname.startsWith('/_next/image/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // HSTS header (only for HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
