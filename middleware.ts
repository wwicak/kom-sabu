import { NextRequest, NextResponse } from 'next/server'
import { setSecurityHeaders, checkRateLimit } from './src/lib/security'

// Security configuration
const SECURITY_CONFIG = {
  // Paths that require authentication
  protectedPaths: ['/admin', '/api/admin'],

  // Paths with stricter rate limiting
  strictRateLimitPaths: ['/api/contact', '/api/upload', '/api/auth'],

  // Blocked user agents (bots, scrapers)
  blockedUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
  ],

  // Blocked countries (if needed)
  blockedCountries: [], // Add country codes if needed

  // Suspicious patterns in URLs
  suspiciousPatterns: [
    /\.\./,           // Directory traversal
    /\/etc\/passwd/,  // System file access
    /\/proc\//,       // Process information
    /\bscript\b/i,    // Script injection
    /\bjavascript:/i, // JavaScript protocol
    /\bdata:/i,       // Data URLs
    /\bvbscript:/i,   // VBScript
    /\bon\w+=/i,      // Event handlers
    /<script/i,       // Script tags
    /\beval\(/i,      // Eval function
    /\balert\(/i,     // Alert function
  ]
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const fullUrl = pathname + search
  const userAgent = request.headers.get('user-agent') || ''

  // Get client IP with multiple fallbacks
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             request.headers.get('cf-connecting-ip') || // Cloudflare
             request.headers.get('x-client-ip') ||
             'unknown'

  // 1. Block suspicious user agents
  if (SECURITY_CONFIG.blockedUserAgents.some(pattern => pattern.test(userAgent))) {
    console.warn(`Blocked suspicious user agent: ${userAgent} from IP: ${ip}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 2. Check for suspicious URL patterns
  if (SECURITY_CONFIG.suspiciousPatterns.some(pattern => pattern.test(fullUrl))) {
    console.warn(`Blocked suspicious URL pattern: ${fullUrl} from IP: ${ip}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  // 3. Validate request size (prevent large payload attacks)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    console.warn(`Blocked large request: ${contentLength} bytes from IP: ${ip}`)
    return new NextResponse('Payload Too Large', { status: 413 })
  }

  // 4. Apply rate limiting (stricter for sensitive endpoints)
  const isStrictPath = SECURITY_CONFIG.strictRateLimitPaths.some(path => pathname.startsWith(path))
  const rateLimitPassed = isStrictPath ?
    checkRateLimit(ip, { windowMs: 15 * 60 * 1000, max: 20 }) : // 20 requests per 15 minutes
    checkRateLimit(ip) // Default rate limiting

  if (!rateLimitPassed) {
    console.warn(`Rate limit exceeded for IP: ${ip} on path: ${pathname}`)
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        'X-RateLimit-Limit': isStrictPath ? '20' : '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    })
  }

  // 5. Check for SQL injection patterns in query parameters
  const queryString = search.toLowerCase()
  const sqlInjectionPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /exec\s*\(/i,
    /script\s*>/i,
    /'.*or.*'.*=/i,
    /".*or.*".*=/i,
  ]

  if (sqlInjectionPatterns.some(pattern => pattern.test(queryString))) {
    console.warn(`Blocked SQL injection attempt: ${queryString} from IP: ${ip}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  // 6. Validate HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
  if (!allowedMethods.includes(request.method)) {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }

  // 7. Check for path traversal attempts
  if (pathname.includes('../') || pathname.includes('..\\')) {
    console.warn(`Blocked path traversal attempt: ${pathname} from IP: ${ip}`)
    return new NextResponse('Bad Request', { status: 400 })
  }

  // Create response and apply security headers
  const response = NextResponse.next()

  // 8. Set comprehensive security headers
  const secureResponse = setSecurityHeaders(response)

  // 9. Add additional security headers
  secureResponse.headers.set('X-Request-ID', crypto.randomUUID())
  secureResponse.headers.set('X-Timestamp', new Date().toISOString())

  // 10. Remove server information
  secureResponse.headers.delete('Server')
  secureResponse.headers.delete('X-Powered-By')

  return secureResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
