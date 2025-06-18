import { NextRequest, NextResponse } from 'next/server'
import { setSecurityHeaders, checkRateLimit } from './src/lib/security'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Get client IP
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  // Apply rate limiting
  if (!checkRateLimit(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      },
    })
  }
  
  // Set security headers
  return setSecurityHeaders(response)
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
}
