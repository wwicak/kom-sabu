// Server-side security utilities
interface RateLimitEntry {
  attempts: number
  lastAttempt: number
  blockedUntil?: number
}

// In-memory rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
}

/**
 * Check if an IP address is rate limited
 */
export function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(clientIP)

  if (!entry) {
    return true // No previous attempts, allow
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return false // Still blocked
  }

  // Check if window has expired
  if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
    // Window expired, reset attempts
    rateLimitStore.delete(clientIP)
    return true
  }

  // Check if within rate limit
  return entry.attempts < RATE_LIMIT_CONFIG.maxAttempts
}

/**
 * Record a failed attempt for an IP address
 */
export function recordFailedAttempt(clientIP: string): void {
  const now = Date.now()
  const entry = rateLimitStore.get(clientIP) || { attempts: 0, lastAttempt: now }

  // If window has expired, reset
  if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
    entry.attempts = 1
    entry.lastAttempt = now
    delete entry.blockedUntil
  } else {
    entry.attempts += 1
    entry.lastAttempt = now

    // Block if max attempts reached
    if (entry.attempts >= RATE_LIMIT_CONFIG.maxAttempts) {
      entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs
    }
  }

  rateLimitStore.set(clientIP, entry)
}

/**
 * Clear failed attempts for an IP address (on successful login)
 */
export function clearFailedAttempts(clientIP: string): void {
  rateLimitStore.delete(clientIP)
}

/**
 * Get rate limit status for an IP address
 */
export function getRateLimitStatus(clientIP: string): {
  isBlocked: boolean
  attemptsRemaining: number
  resetTime?: number
  blockedUntil?: number
} {
  const now = Date.now()
  const entry = rateLimitStore.get(clientIP)

  if (!entry) {
    return {
      isBlocked: false,
      attemptsRemaining: RATE_LIMIT_CONFIG.maxAttempts
    }
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      isBlocked: true,
      attemptsRemaining: 0,
      blockedUntil: entry.blockedUntil
    }
  }

  // Check if window has expired
  if (now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs) {
    return {
      isBlocked: false,
      attemptsRemaining: RATE_LIMIT_CONFIG.maxAttempts
    }
  }

  return {
    isBlocked: false,
    attemptsRemaining: Math.max(0, RATE_LIMIT_CONFIG.maxAttempts - entry.attempts),
    resetTime: entry.lastAttempt + RATE_LIMIT_CONFIG.windowMs
  }
}

/**
 * Verify Cloudflare Turnstile token
 */
export async function verifyTurnstileToken(token: string, clientIP: string): Promise<boolean> {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA' // Dummy key for development

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: clientIP,
      }),
    })

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    
    // In development, allow if using dummy keys
    if (process.env.NODE_ENV === 'development') {
      const dummySecretKey = '1x0000000000000000000000000000000AA'
      return process.env.TURNSTILE_SECRET_KEY === dummySecretKey || !process.env.TURNSTILE_SECRET_KEY
    }
    
    return false
  }
}

/**
 * Clean up expired entries from rate limit store
 * Call this periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  const expiredKeys: string[] = []

  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries that are older than the window and not blocked
    if (
      now - entry.lastAttempt > RATE_LIMIT_CONFIG.windowMs &&
      (!entry.blockedUntil || now > entry.blockedUntil)
    ) {
      expiredKeys.push(key)
    }
  }

  expiredKeys.forEach(key => rateLimitStore.delete(key))
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip', // Cloudflare
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ]

  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(',')[0].trim()
      if (ip && ip !== 'unknown') {
        return ip
      }
    }
  }

  return 'unknown'
}

/**
 * Validate IP address format
 */
export function isValidIP(ip: string): boolean {
  if (ip === 'unknown') return false
  
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Hash IP address for privacy (optional)
 */
export function hashIP(ip: string): string {
  // Simple hash for IP privacy - in production, use a proper crypto hash
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}
