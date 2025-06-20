import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

interface AuthResult {
  success: boolean
  user?: {
    id: string
    email: string
    role: string
  }
  error?: string
}

export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')

    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided'
      }
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token.value, secret) as any

    if (!decoded || !decoded.userId || decoded.role !== 'admin') {
      return {
        success: false,
        error: 'Invalid or expired token'
      }
    }

    return {
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    }

  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

export async function verifyUserAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('user-token') || cookieStore.get('admin-token')

    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided'
      }
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token.value, secret) as any

    if (!decoded || !decoded.userId) {
      return {
        success: false,
        error: 'Invalid or expired token'
      }
    }

    return {
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'user'
      }
    }

  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
