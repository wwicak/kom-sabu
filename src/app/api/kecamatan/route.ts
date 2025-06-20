import { NextRequest, NextResponse } from 'next/server'
import { Kecamatan } from '@/lib/models/kecamatan'
import { kecamatanCreateSchema } from '@/lib/validations'
import { requirePermission } from '@/lib/auth-middleware'
import { Permission } from '@/lib/rbac'
import { withRateLimit, rateLimiters } from '@/lib/enhanced-rate-limit'
import mongoose from 'mongoose'

// Connect to MongoDB using mongoose
async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    })
  }
}

// GET /api/kecamatan - Get all kecamatan data
export const GET = withRateLimit(rateLimiters.api, async function(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeGeometry = searchParams.get('includeGeometry') === 'true'
    const activeOnly = searchParams.get('activeOnly') !== 'false'
    const regencyCode = searchParams.get('regencyCode')

    // If requesting geometry data for Sabu Raijua (5320), use GeoJSON file
    if (includeGeometry && regencyCode === '5320') {
      try {
        // Use the GeoJSON API endpoint internally
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const geoJsonResponse = await fetch(`${baseUrl}/api/geojson/kecamatan`)

        if (geoJsonResponse.ok) {
          const geoJsonData = await geoJsonResponse.json()
          return NextResponse.json(geoJsonData)
        }
      } catch (geoJsonError) {
        console.warn('Failed to load GeoJSON data, falling back to MongoDB:', geoJsonError)
      }
    }

    // Fallback to MongoDB
    try {
      await connectToMongoDB()

      // Build query
      const query: { isActive?: boolean; regencyCode?: string } = {}
      if (activeOnly) {
        query.isActive = true
      }
      if (regencyCode) {
        query.regencyCode = regencyCode
      }

      // Build projection
      const projection: { geometry?: number } = {}
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
        count: kecamatanList.length,
        source: 'mongodb'
      })

    } catch (dbError) {
      console.error('MongoDB error:', dbError)

      // If MongoDB fails and we need geometry data, try GeoJSON as final fallback
      if (includeGeometry) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          const geoJsonResponse = await fetch(`${baseUrl}/api/geojson/kecamatan`)

          if (geoJsonResponse.ok) {
            const geoJsonData = await geoJsonResponse.json()
            return NextResponse.json({
              ...geoJsonData,
              fallback: true,
              message: 'Using GeoJSON fallback due to database unavailability'
            })
          }
        } catch (geoJsonError) {
          console.error('GeoJSON fallback also failed:', geoJsonError)
        }
      }

      throw dbError
    }

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
  withRateLimit(rateLimiters.api, async function(request: NextRequest, context: { user: { id: string } }) {
    try {
      await connectToMongoDB()

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
