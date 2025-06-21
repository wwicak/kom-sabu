import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token') // Changed from 'admin-token' to 'auth-token'

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token.value, secret) as { id: string; username: string; email: string; role: string }

    // Check if user has admin role (allow both 'admin' and 'super_admin')
    if (!decoded || !decoded.id || !['admin', 'super_admin'].includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Invalid token or insufficient permissions' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}
