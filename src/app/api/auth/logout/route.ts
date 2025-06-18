import { NextRequest, NextResponse } from 'next/server'
import { authenticate, logSecurityEvent } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    
    if (user) {
      await logSecurityEvent(
        user,
        'LOGOUT_SUCCESS',
        'auth',
        {},
        request
      )
    }
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    
    // Clear cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 0 // Expire immediately
    }
    
    response.cookies.set('auth-token', '', cookieOptions)
    response.cookies.set('refresh-token', '', cookieOptions)
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
