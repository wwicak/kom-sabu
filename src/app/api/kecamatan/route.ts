import { NextRequest, NextResponse } from 'next/server'
import { Kecamatan } from '@/lib/models/kecamatan'
import { kecamatanCreateSchema } from '@/lib/validations'
import { requirePermission, AuthenticatedRequest } from '@/lib/auth-middleware'
import { Permission } from '@/lib/rbac'
import { withRateLimit, rateLimiters } from '@/lib/enhanced-rate-limit'
import { connectToDatabase } from '@/lib/mongodb'
import mongoose from 'mongoose'

// GET /api/kecamatan - Get all kecamatan data
export const GET = withRateLimit(rateLimiters.api, async function(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const includeGeometry = searchParams.get('includeGeometry') === 'true'
    const activeOnly = searchParams.get('activeOnly') !== 'false'
    const regencyCode = searchParams.get('regencyCode')

    // Build query
    const query: any = {}
    if (activeOnly) {
      query.isActive = true
    }
    if (regencyCode) {
      query.regencyCode = regencyCode
    }

    // Build projection
    let projection: any = {}
    if (!includeGeometry) {
      projection.geometry = 0 // Exclude geometry for lighter response
    }

    const kecamatanList = await Kecamatan
      .find(query, projection)
      .sort({ displayOrder: 1, name: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: kecamatanList,
      count: kecamatanList.length
    })

  } catch (error) {
    console.error('Error fetching kecamatan:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch kecamatan data',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
})

// POST /api/kecamatan - Create new kecamatan (admin only)
export const POST = requirePermission(Permission.CREATE_KECAMATAN)(
  withRateLimit(rateLimiters.api, async function(request: NextRequest, context: any) {
    try {
      await connectToDatabase()

      const body = await request.json()
      const validatedData = kecamatanCreateSchema.parse(body)

      // Check if kecamatan code already exists
      const existingKecamatan = await Kecamatan.findOne({ code: validatedData.code })
      if (existingKecamatan) {
        return NextResponse.json(
          {
            success: false,
            error: 'Kecamatan with this code already exists'
          },
          { status: 400 }
        )
      }

      // Create new kecamatan
      const newKecamatan = new Kecamatan({
        ...validatedData,
        createdBy: context.user.id,
        updatedBy: context.user.id
      })

      await newKecamatan.save()

      return NextResponse.json({
        success: true,
        data: newKecamatan,
        message: 'Kecamatan created successfully'
      }, { status: 201 })

    } catch (error) {
      console.error('Error creating kecamatan:', error)

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
          error: 'Failed to create kecamatan',
          details: (error as Error).message
        },
        { status: 500 }
      )
    }
  })
)
