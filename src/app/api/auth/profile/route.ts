import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, AuthenticatedRequest } from '@/lib/auth-middleware'
import { User } from '@/lib/models'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
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

const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional()
}).refine(data => {
  // If newPassword is provided, currentPassword must also be provided
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  return true
}, {
  message: "Current password is required when changing password"
})

// GET /api/auth/profile - Get current user profile
export const GET = requireAuth(async function(request: NextRequest) {
  try {
    await connectToMongoDB()
    
    const user = (request as AuthenticatedRequest).user!
    
    const userProfile = await User.findById(user.id)
      .select('-password -passwordResetToken -passwordResetExpires -twoFactorSecret')
      .lean()

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const profile = userProfile as any

    return NextResponse.json({
      success: true,
      data: {
        id: profile._id.toString(),
        username: profile.username,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
        department: profile.department,
        position: profile.position,
        isActive: profile.isActive,
        lastLogin: profile.lastLogin,
        twoFactorEnabled: profile.twoFactorEnabled,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
})

// PUT /api/auth/profile - Update current user profile
export const PUT = requireAuth(async function(request: NextRequest) {
  try {
    await connectToMongoDB()
    
    const user = (request as AuthenticatedRequest).user!
    const body = await request.json()
    
    const validationResult = updateProfileSchema.safeParse(body)
    
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
    
    const { fullName, email, department, position, currentPassword, newPassword } = validationResult.data
    
    // Get current user data
    const currentUser = await User.findById(user.id).select('+password')
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }
    
    const updateData: any = {}
    
    // Update basic profile fields
    if (fullName !== undefined) updateData.fullName = fullName
    if (department !== undefined) updateData.department = department
    if (position !== undefined) updateData.position = position
    
    // Handle email update (check for uniqueness)
    if (email !== undefined && email !== currentUser.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already in use' },
          { status: 400 }
        )
      }
      updateData.email = email.toLowerCase()
    }
    
    // Handle password change
    if (newPassword && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password)
      
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        )
      }
      
      const saltRounds = 12
      updateData.password = await bcrypt.hash(newPassword, saltRounds)
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password -passwordResetToken -passwordResetExpires -twoFactorSecret')
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id.toString(),
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        department: updatedUser.department,
        position: updatedUser.position,
        isActive: updatedUser.isActive,
        lastLogin: updatedUser.lastLogin,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
})

// Handle unsupported methods
export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
