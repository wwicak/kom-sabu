import { NextRequest, NextResponse } from 'next/server'
import { Kecamatan } from '@/lib/models/kecamatan'
import { kecamatanUpdateSchema } from '@/lib/validations'
import { requirePermission, AuthenticatedRequest } from '@/lib/auth-middleware'
import { Permission } from '@/lib/rbac'
import { withRateLimit, rateLimiters } from '@/lib/enhanced-rate-limit'
import { connectToDatabase } from '@/lib/mongodb'
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

// GET /api/kecamatan/[slug] - Get specific kecamatan data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToMongoDB()

    const { slug } = await params

    const kecamatan = await Kecamatan.findOne({
      slug: slug,
      isActive: true
    })
      .select('-__v')
      .lean()
    
    if (!kecamatan) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kecamatan not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: kecamatan
    })
  } catch (error) {
    console.error('Error fetching kecamatan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch kecamatan data' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/kecamatan/[slug] - Update kecamatan data (admin only)
export const PUT = requirePermission(Permission.UPDATE_KECAMATAN)(
  withRateLimit(rateLimiters.api, async function(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      await connectToDatabase()

      const { slug } = await params
      const body = await request.json()
      const validatedData = kecamatanUpdateSchema.parse(body)

      // Find by code instead of slug
      const updatedKecamatan = await Kecamatan.findOneAndUpdate(
        { code: slug }, // Using code as identifier
        {
          ...validatedData,
          updatedAt: new Date(),
          updatedBy: (request as AuthenticatedRequest).user!.id
        },
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedKecamatan) {
        return NextResponse.json(
          {
            success: false,
            error: 'Kecamatan not found'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedKecamatan,
        message: 'Kecamatan updated successfully'
      })
    } catch (error) {
      console.error('Error updating kecamatan:', error)

      if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation error',
            details: Object.values(error.errors).map(err => err.message)
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update kecamatan',
          details: (error as Error).message
        },
        { status: 500 }
      )
    }
  })
)

// DELETE /api/kecamatan/[slug] - Soft delete kecamatan (admin only)
export const DELETE = requirePermission(Permission.DELETE_KECAMATAN)(
  withRateLimit(rateLimiters.api, async function(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      await connectToDatabase()

      const { slug } = await params

      const updatedKecamatan = await Kecamatan.findOneAndUpdate(
        { code: slug }, // Using code as identifier
        {
          isActive: false,
          updatedAt: new Date(),
          updatedBy: (request as AuthenticatedRequest).user!.id
        },
        { new: true }
      )

      if (!updatedKecamatan) {
        return NextResponse.json(
          {
            success: false,
            error: 'Kecamatan not found'
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Kecamatan deactivated successfully'
      })
    } catch (error) {
      console.error('Error deactivating kecamatan:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to deactivate kecamatan',
          details: (error as Error).message
        },
        { status: 500 }
      )
    }
  })
)
