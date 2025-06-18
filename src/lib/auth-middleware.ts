import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { User } from '@/lib/models'
import { Role, Permission, hasPermission } from '@/lib/rbac'
import mongoose from 'mongoose'

// Ensure mongoose connection
async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }
}

export interface AuthenticatedUser {
  id: string
  username: string
  email: string
  fullName: string
  role: Role
  department?: string
  isActive: boolean
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthenticatedUser
}

// JWT token verification
export async function verifyToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    
    await connectToMongoDB()
    
    const user = await User.findById(decoded.userId)
      .select('-password -passwordResetToken -passwordResetExpires -twoFactorSecret')
      .lean()

    if (!user || !(user as any).isActive) {
      return null
    }

    return {
      id: (user as any)._id.toString(),
      username: (user as any).username,
      email: (user as any).email,
      fullName: (user as any).fullName,
      role: (user as any).role as Role,
      department: (user as any).department,
      isActive: (user as any).isActive
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Extract token from request
export function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Check cookies
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }
  
  return null
}

// Authentication middleware
export async function authenticate(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = extractToken(request)
  
  if (!token) {
    return null
  }
  
  return await verifyToken(token)
}

// Authorization middleware
export function requireAuth(handler: Function) {
  return async function(request: NextRequest, ...args: any[]) {
    const user = await authenticate(request)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Attach user to request
    (request as AuthenticatedRequest).user = user
    
    return handler(request, ...args)
  }
}

// Permission-based authorization
export function requirePermission(permission: Permission) {
  return function(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const user = await authenticate(request)
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (!hasPermission(user.role, permission)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      // Attach user to request
      (request as AuthenticatedRequest).user = user
      
      return handler(request, ...args)
    }
  }
}

// Role-based authorization
export function requireRole(allowedRoles: Role[]) {
  return function(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const user = await authenticate(request)
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient role permissions' },
          { status: 403 }
        )
      }
      
      // Attach user to request
      (request as AuthenticatedRequest).user = user
      
      return handler(request, ...args)
    }
  }
}

// Multiple permission check
export function requireAnyPermission(permissions: Permission[]) {
  return function(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const user = await authenticate(request)
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      const hasAnyPermission = permissions.some(permission => 
        hasPermission(user.role, permission)
      )
      
      if (!hasAnyPermission) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      // Attach user to request
      (request as AuthenticatedRequest).user = user
      
      return handler(request, ...args)
    }
  }
}

// Owner-based authorization (for resource ownership)
export function requireOwnership(getResourceOwnerId: (request: NextRequest, ...args: any[]) => Promise<string>) {
  return function(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const user = await authenticate(request)
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // Super admins can access everything
      if (user.role === Role.SUPER_ADMIN) {
        (request as AuthenticatedRequest).user = user
        return handler(request, ...args)
      }
      
      const resourceOwnerId = await getResourceOwnerId(request, ...args)
      
      if (user.id !== resourceOwnerId) {
        return NextResponse.json(
          { success: false, error: 'Access denied: not resource owner' },
          { status: 403 }
        )
      }
      
      // Attach user to request
      (request as AuthenticatedRequest).user = user
      
      return handler(request, ...args)
    }
  }
}

// Rate limiting by role
export const ROLE_RATE_LIMITS = {
  [Role.SUPER_ADMIN]: { requests: 1000, window: 60 * 1000 }, // 1000 req/min
  [Role.ADMIN]: { requests: 500, window: 60 * 1000 },        // 500 req/min
  [Role.EDITOR]: { requests: 200, window: 60 * 1000 },       // 200 req/min
  [Role.VIEWER]: { requests: 100, window: 60 * 1000 }        // 100 req/min
}

// Session management
export function generateToken(user: AuthenticatedUser): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured')
  }
  
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not configured')
  }

  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    secret,
    {
      expiresIn: '24h',
      issuer: 'sabu-raijua-gov',
      audience: 'sabu-raijua-admin'
    }
  )
}

// Refresh token
export function generateRefreshToken(userId: string): string {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET not configured')
  }
  
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d',
      issuer: 'sabu-raijua-gov',
      audience: 'sabu-raijua-refresh'
    }
  )
}

// Audit logging for sensitive operations
export async function logSecurityEvent(
  user: AuthenticatedUser | null,
  action: string,
  resource: string,
  details: any,
  request: NextRequest
) {
  try {
    await connectToMongoDB()
    
    const { AuditLog } = await import('@/lib/models')
    
    await AuditLog.create({
      userId: user?.id,
      action,
      resource,
      details,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Failed to log security event:', error)
  }
}
