import { NextRequest, NextResponse } from 'next/server'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import validator from 'validator'
import CryptoJS from 'crypto-js'

// Initialize DOMPurify for server-side use
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },
  
  // CSRF protection
  CSRF: {
    secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 3600000, // 1 hour
    },
  },
  
  // Session configuration
  SESSION: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
  },
  
  // Content Security Policy
  CSP: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  },
}

// XSS Protection - Sanitize HTML content
export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  })
}

// Input validation utilities
export const validateInput = {
  email: (email: string): boolean => {
    return validator.isEmail(email) && email.length <= 254
  },
  
  phone: (phone: string): boolean => {
    return validator.isMobilePhone(phone, 'any')
  },
  
  name: (name: string): boolean => {
    return validator.isLength(name, { min: 1, max: 100 }) && 
           validator.matches(name, /^[a-zA-Z\s'-]+$/)
  },
  
  message: (message: string): boolean => {
    return validator.isLength(message, { min: 1, max: 1000 })
  },
  
  url: (url: string): boolean => {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  },
}

// Encrypt sensitive data
export function encryptData(data: string): string {
  const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
  return CryptoJS.AES.encrypt(data, key).toString()
}

// Decrypt sensitive data
export function decryptData(encryptedData: string): string {
  const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production'
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// Generate secure random token
export function generateSecureToken(): string {
  return CryptoJS.lib.WordArray.random(32).toString()
}

// Security headers middleware
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enforce HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  // Content Security Policy
  const cspString = Object.entries(SECURITY_CONFIG.CSP)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  response.headers.set('Content-Security-Policy', cspString)
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  
  return response
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Enhanced rate limiting function with configurable options
export function checkRateLimit(
  ip: string,
  options?: { windowMs?: number; max?: number }
): boolean {
  const now = Date.now()
  const windowMs = options?.windowMs || SECURITY_CONFIG.RATE_LIMIT.windowMs
  const maxRequests = options?.max || SECURITY_CONFIG.RATE_LIMIT.max

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Clean up expired rate limit records
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip)
    }
  }
}

// Get rate limit info for an IP
export function getRateLimitInfo(ip: string): {
  count: number
  remaining: number
  resetTime: number
  isLimited: boolean
} {
  const now = Date.now()
  const windowMs = SECURITY_CONFIG.RATE_LIMIT.windowMs
  const maxRequests = SECURITY_CONFIG.RATE_LIMIT.max

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    return {
      count: 0,
      remaining: maxRequests,
      resetTime: now + windowMs,
      isLimited: false
    }
  }

  return {
    count: record.count,
    remaining: Math.max(0, maxRequests - record.count),
    resetTime: record.resetTime,
    isLimited: record.count >= maxRequests
  }
}

// CSRF token validation
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}

// Secure password hashing (for future authentication)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}
