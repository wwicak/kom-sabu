import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { SECURITY_CONFIG } from './security'

/**
 * Secure CSRF Protection using Synchronizer Token Pattern
 *
 * This implementation avoids the Double Submit Cookie Pattern CVE by:
 * 1. Using server-side session storage for token validation
 * 2. Implementing proper token rotation
 * 3. Using cryptographically secure token generation
 * 4. Avoiding subdomain cookie vulnerabilities
 */

// No secret needed for Synchronizer Token Pattern - tokens are stored server-side

// In-memory token store (in production, use Redis or database)
// Format: Map<sessionId, { token: string, expires: number }>
// TODO: Replace with Redis/database for production deployment
const tokenStore = new Map<string, { token: string; expires: number }>()

// Generate a secure CSRF token
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

// Generate a secure session ID
function generateSessionId(): string {
  return crypto.randomBytes(16).toString('base64url')
}

// Clean up expired tokens
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, data] of tokenStore.entries()) {
    if (data.expires < now) {
      tokenStore.delete(sessionId)
    }
  }
}

// Get session ID from cookies
function getSessionId(request: NextRequest): string | null {
  const sessionCookie = request.cookies.get('_csrf_session')
  return sessionCookie?.value || null
}

// Set session ID in cookies
function setSessionId(response: NextResponse, sessionId: string): void {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 3600, // 1 hour
    path: '/'
  }

  response.cookies.set('_csrf_session', sessionId, cookieOptions)
}

// Store CSRF token for session
function storeCSRFToken(sessionId: string, token: string): void {
  cleanupExpiredTokens() // Clean up old tokens

  const expires = Date.now() + (3600 * 1000) // 1 hour
  tokenStore.set(sessionId, { token, expires })
}

// Validate CSRF token against stored session token
function validateCSRFToken(sessionId: string, providedToken: string): boolean {
  if (!sessionId || !providedToken) return false

  const storedData = tokenStore.get(sessionId)
  if (!storedData) return false

  // Check if token is expired
  if (storedData.expires < Date.now()) {
    tokenStore.delete(sessionId)
    return false
  }

  // Use timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(storedData.token, 'utf8'),
    Buffer.from(providedToken, 'utf8')
  )
}

// CSRF middleware wrapper for Next.js API routes using Synchronizer Token Pattern
export function withCSRF(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Skip CSRF for safe methods
      if (SECURITY_CONFIG.CSRF.ignoreMethods.includes(request.method)) {
        return handler(request, context)
      }

      // Get CSRF token from request headers
      const csrfTokenFromHeader = request.headers.get('x-csrf-token') ||
                                  request.headers.get('csrf-token')

      if (!csrfTokenFromHeader) {
        return NextResponse.json(
          { success: false, error: 'CSRF token is required' },
          { status: 403 }
        )
      }

      // Get session ID from cookies
      const sessionId = getSessionId(request)

      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: 'CSRF session not found' },
          { status: 403 }
        )
      }

      // Validate CSRF token using Synchronizer Token Pattern
      if (!validateCSRFToken(sessionId, csrfTokenFromHeader)) {
        return NextResponse.json(
          { success: false, error: 'Invalid CSRF token' },
          { status: 403 }
        )
      }

      // Call the original handler
      return handler(request, context)
    } catch (error: any) {
      console.error('CSRF protection error:', error)

      return NextResponse.json(
        { success: false, error: 'Security validation failed' },
        { status: 400 }
      )
    }
  }
}

// Helper to get CSRF token for forms
export async function getCSRFToken(request: NextRequest): Promise<{ token: string; sessionId: string }> {
  try {
    // Get existing session ID
    let sessionId = getSessionId(request)

    // If we have a session, check if we have a valid token
    if (sessionId) {
      const storedData = tokenStore.get(sessionId)
      if (storedData && storedData.expires > Date.now()) {
        return { token: storedData.token, sessionId }
      }
    }

    // Generate new session and token
    sessionId = generateSessionId()
    const token = generateCSRFToken()

    // Store the token
    storeCSRFToken(sessionId, token)

    return { token, sessionId }
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    throw new Error('Failed to generate CSRF token')
  }
}

// API route to get CSRF token
export async function handleCSRFToken(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, sessionId } = await getCSRFToken(request)

    const response = NextResponse.json({
      success: true,
      csrfToken: token
    })

    // Set session ID in cookies
    setSessionId(response, sessionId)

    return response
  } catch (error) {
    console.error('CSRF token generation failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
