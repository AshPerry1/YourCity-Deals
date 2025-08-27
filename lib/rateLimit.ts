import { NextRequest } from 'next/server';

// In-memory rate limit store (use Redis in production for distributed systems)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  limit: number;
  window: number; // in milliseconds
  identifier?: string;
}

export function checkRateLimit(
  req: NextRequest, 
  config: RateLimitConfig = { limit: 100, window: 60000 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const identifier = config.identifier || ip;
  const now = Date.now();
  
  // Clean up expired entries
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }
  
  const current = rateLimit.get(identifier);
  
  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + config.window
    });
    
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime: now + config.window
    };
  }
  
  if (current.count >= config.limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  // Increment counter
  current.count++;
  rateLimit.set(identifier, current);
  
  return {
    allowed: true,
    remaining: config.limit - current.count,
    resetTime: current.resetTime
  };
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  config: RateLimitConfig = { limit: 100, window: 60000 }
) {
  return async (req: NextRequest): Promise<Response> => {
    const rateLimitResult = checkRateLimit(req, config);
    
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
        resetTime: new Date(rateLimitResult.resetTime).toISOString()
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        }
      });
    }
    
    // Add rate limit headers to response
    const response = await handler(req);
    
    response.headers.set('X-RateLimit-Limit', config.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());
    
    return response;
  };
}

// Specific rate limit configurations
export const RATE_LIMITS = {
  // General API endpoints
  API: { limit: 100, window: 60000 },
  
  // Authentication endpoints
  AUTH: { limit: 5, window: 300000 }, // 5 attempts per 5 minutes
  
  // File uploads
  UPLOAD: { limit: 10, window: 60000 }, // 10 uploads per minute
  
  // Payment endpoints
  PAYMENT: { limit: 20, window: 60000 }, // 20 payment attempts per minute
  
  // Notification endpoints
  NOTIFICATION: { limit: 50, window: 60000 }, // 50 notifications per minute
  
  // Admin endpoints
  ADMIN: { limit: 200, window: 60000 }, // Higher limit for admin operations
} as const;
