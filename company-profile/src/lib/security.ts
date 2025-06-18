import crypto from 'crypto'
import { NextResponse } from 'next/server'
import DOMPurify from 'isomorphic-dompurify'

// Security configuration
export const SECURITY_CONFIG = {
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  CSRF: {
    tokenLength: 64,
    cookieName: 'csrf-token',
    headerName: 'x-csrf-token',
  },
  PASSWORD: {
    minLength: 8,
    saltRounds: 12,
  },
  SESSION: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
  },
  FILE_UPLOAD: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
}

// HTML Sanitization
export function sanitizeHtml(input: string): string {
  if (!input) return ''
  
  // Configure DOMPurify for strict sanitization
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true, // Keep text content
  })
  
  return clean.trim()
}

// Input validation utilities
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  },
  
  name: (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s'-]{1,100}$/
    return nameRegex.test(name)
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return !phone || phoneRegex.test(phone)
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },
  
  coordinates: {
    longitude: (lng: string): boolean => {
      const num = parseFloat(lng)
      return !isNaN(num) && num >= -180 && num <= 180
    },
    
    latitude: (lat: string): boolean => {
      const num = parseFloat(lat)
      return !isNaN(num) && num >= -90 && num <= 90
    }
  }
}

// Generate secure tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// CSRF token validation
export function generateCSRFToken(): string {
  return crypto.randomBytes(SECURITY_CONFIG.CSRF.tokenLength / 2).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false
  return token === sessionToken && token.length === SECURITY_CONFIG.CSRF.tokenLength
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, SECURITY_CONFIG.PASSWORD.saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(password, hash)
}

// Data encryption utilities
const algorithm = 'aes-256-gcm'
const keyLength = 32

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key || key.length !== keyLength) {
    throw new Error('Invalid encryption key. Must be 32 characters long.')
  }
  return Buffer.from(key, 'utf8')
}

export function encryptData(data: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(algorithm, key)
    
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    throw new Error('Encryption failed')
  }
}

export function decryptData(encryptedData: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
    
    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted data format')
    }
    
    const key = getEncryptionKey()
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    const decipher = crypto.createDecipher(algorithm, key)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    throw new Error('Decryption failed')
  }
}

// Security headers
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()'
  )
  
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ]
  
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  
  // Remove server information
  response.headers.delete('Server')
  response.headers.delete('X-Powered-By')
  
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

// IP address utilities
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfIP = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (cfIP) {
    return cfIP
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Security event logging
export interface SecurityEvent {
  type: 'RATE_LIMIT_EXCEEDED' | 'CSRF_VALIDATION_FAILED' | 'SUSPICIOUS_ACTIVITY' | 'LOGIN_ATTEMPT' | 'FILE_UPLOAD'
  ip: string
  userAgent?: string
  details?: any
  timestamp: Date
}

const securityEvents: SecurityEvent[] = []

export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  securityEvents.push({
    ...event,
    timestamp: new Date()
  })
  
  // In production, send to monitoring service
  console.warn('Security Event:', event)
  
  // Keep only last 1000 events in memory
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000)
  }
}

export function getSecurityEvents(limit: number = 100): SecurityEvent[] {
  return securityEvents.slice(-limit)
}
