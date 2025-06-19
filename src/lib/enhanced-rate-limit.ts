import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
}

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked: boolean
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Enhanced rate limiting with sliding window
export class EnhancedRateLimit {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  private getKey(request: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(request)
    }
    
    // Default key generation with multiple IP sources
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               request.headers.get('cf-connecting-ip') ||
               'unknown'
    
    return `rate_limit:${ip}`
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
  }

  public check(request: NextRequest): {
    allowed: boolean
    limit: number
    remaining: number
    resetTime: number
    retryAfter?: number
  } {
    this.cleanupExpiredEntries()
    
    const key = this.getKey(request)
    const now = Date.now()
    const resetTime = now + this.config.windowMs
    
    let entry = rateLimitStore.get(key)
    
    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime,
        blocked: false
      }
      rateLimitStore.set(key, entry)
      
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - 1,
        resetTime
      }
    }
    
    // Check if currently blocked
    if (entry.blocked && entry.resetTime > now) {
      return {
        allowed: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      }
    }
    
    // Increment count
    entry.count++
    
    if (entry.count > this.config.maxRequests) {
      entry.blocked = true
      // Extend block time for repeated violations
      entry.resetTime = now + (this.config.windowMs * Math.min(entry.count - this.config.maxRequests, 5))
      
      return {
        allowed: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      }
    }
    
    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  public middleware() {
    return (request: NextRequest) => {
      const result = this.check(request)
      
      if (!result.allowed) {
        const response = NextResponse.json(
          {
            success: false,
            error: 'Too many requests',
            retryAfter: result.retryAfter
          },
          { status: 429 }
        )
        
        response.headers.set('X-RateLimit-Limit', result.limit.toString())
        response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
        response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
        
        if (result.retryAfter) {
          response.headers.set('Retry-After', result.retryAfter.toString())
        }
        
        return response
      }
      
      return null // Allow request to continue
    }
  }
}

// Predefined rate limiters for different endpoints
export const rateLimiters = {
  // Strict rate limiting for authentication endpoints
  auth: new EnhancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    keyGenerator: (request) => {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      return `auth:${ip}`
    }
  }),
  
  // Moderate rate limiting for contact forms
  contact: new EnhancedRateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3, // 3 submissions per 10 minutes
    keyGenerator: (request) => {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      return `contact:${ip}`
    }
  }),
  
  // General API rate limiting
  api: new EnhancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    keyGenerator: (request) => {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      return `api:${ip}`
    }
  }),
  
  // File upload rate limiting
  upload: new EnhancedRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 uploads per hour
    keyGenerator: (request) => {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      return `upload:${ip}`
    }
  })
}

// Helper function to apply rate limiting to API routes
export function withRateLimit(
  rateLimiter: EnhancedRateLimit,
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const rateLimitResult = rateLimiter.check(request)
    
    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      )
      
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
      
      if (rateLimitResult.retryAfter) {
        response.headers.set('Retry-After', rateLimitResult.retryAfter.toString())
      }
      
      return response
    }
    
    const response = await handler(request, context)
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
    
    return response
  }
}
