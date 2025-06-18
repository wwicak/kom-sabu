import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { User, AuditLog } from '@/lib/models'
import { generateToken, generateRefreshToken, logSecurityEvent } from '@/lib/auth-middleware'
import { Role } from '@/lib/rbac'
import { verifyTurnstileToken, checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/components/security/TurnstileWidget'
import { z } from 'zod'
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

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  turnstileToken: z.string().min(1, 'Security verification is required'),
  rememberMe: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    await connectToMongoDB()
    
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }
    
    const { username, password, turnstileToken, rememberMe } = validationResult.data

    // Get client IP for rate limiting and Turnstile verification
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'

    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      await logSecurityEvent(
        null,
        'LOGIN_RATE_LIMITED',
        'auth',
        { username, clientIP },
        request
      )

      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify Turnstile token
    const isTurnstileValid = await verifyTurnstileToken(turnstileToken, clientIP)
    if (!isTurnstileValid) {
      recordFailedAttempt(clientIP)

      await logSecurityEvent(
        null,
        'LOGIN_FAILED_TURNSTILE_VERIFICATION',
        'auth',
        { username, clientIP },
        request
      )

      return NextResponse.json(
        { success: false, error: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    }).select('+password')
    
    if (!user) {
      recordFailedAttempt(clientIP)

      await logSecurityEvent(
        null,
        'LOGIN_FAILED_USER_NOT_FOUND',
        'auth',
        { username, clientIP },
        request
      )

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Check if account is active
    if (!user.isActive) {
      await logSecurityEvent(
        null,
        'LOGIN_FAILED_ACCOUNT_INACTIVE',
        'auth',
        { userId: user._id.toString(), username },
        request
      )
      
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      )
    }
    
    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      await logSecurityEvent(
        null,
        'LOGIN_FAILED_ACCOUNT_LOCKED',
        'auth',
        { userId: user._id.toString(), username, lockUntil: user.lockUntil },
        request
      )
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account is temporarily locked due to multiple failed login attempts' 
        },
        { status: 401 }
      )
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      recordFailedAttempt(clientIP)

      // Increment login attempts
      const loginAttempts = (user.loginAttempts || 0) + 1
      const maxAttempts = 5
      const lockDuration = 30 * 60 * 1000 // 30 minutes

      const updateData: any = { loginAttempts }

      if (loginAttempts >= maxAttempts) {
        updateData.lockUntil = new Date(Date.now() + lockDuration)
      }

      await User.findByIdAndUpdate(user._id, updateData)

      await logSecurityEvent(
        null,
        'LOGIN_FAILED_INVALID_PASSWORD',
        'auth',
        {
          userId: user._id.toString(),
          username,
          clientIP,
          loginAttempts,
          locked: loginAttempts >= maxAttempts
        },
        request
      )

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Reset login attempts and rate limiting on successful login
    await User.findByIdAndUpdate(user._id, {
      $unset: { loginAttempts: 1, lockUntil: 1 },
      lastLogin: new Date()
    })

    // Clear failed attempts for this IP
    clearFailedAttempts(clientIP)
    
    // Generate tokens
    const userForToken = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role as Role,
      department: user.department,
      isActive: user.isActive
    }
    
    const accessToken = generateToken(userForToken)
    const refreshToken = generateRefreshToken(user._id.toString())
    
    // Log successful login
    await logSecurityEvent(
      userForToken,
      'LOGIN_SUCCESS',
      'auth',
      { rememberMe },
      request
    )
    
    // Set cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userForToken.id,
        username: userForToken.username,
        email: userForToken.email,
        fullName: userForToken.fullName,
        role: userForToken.role,
        department: userForToken.department
      },
      accessToken
    })
    
    // Set HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/'
    }
    
    response.cookies.set('auth-token', accessToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 7 days or 24 hours
    })
    
    response.cookies.set('refresh-token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    
    await logSecurityEvent(
      null,
      'LOGIN_ERROR',
      'auth',
      { error: error instanceof Error ? error.message : 'Unknown error' },
      request
    )
    
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
