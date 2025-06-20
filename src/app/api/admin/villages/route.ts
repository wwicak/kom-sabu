import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Village } from '@/lib/models/village'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema for village
const villageSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1),
  type: z.enum(['desa', 'kelurahan']),
  district: z.enum(['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']),
  districtCode: z.string().min(1),
  head: z.object({
    name: z.string().min(1),
    title: z.enum(['Kepala Desa', 'Lurah']),
    period: z.object({
      start: z.string().transform(str => new Date(str)).optional(),
      end: z.string().transform(str => new Date(str)).optional()
    }).optional(),
    contact: z.object({
      phone: z.string().optional(),
      email: z.string().email().optional()
    }).optional()
  }),
  demographics: z.object({
    population: z.object({
      total: z.number().min(0),
      male: z.number().min(0).optional(),
      female: z.number().min(0).optional(),
      families: z.number().min(0).optional()
    }),
    ageGroups: z.object({
      children: z.number().min(0).optional(),
      youth: z.number().min(0).optional(),
      adults: z.number().min(0).optional(),
      elderly: z.number().min(0).optional()
    }).optional(),
    education: z.object({
      noSchool: z.number().min(0).optional(),
      elementary: z.number().min(0).optional(),
      juniorHigh: z.number().min(0).optional(),
      seniorHigh: z.number().min(0).optional(),
      university: z.number().min(0).optional()
    }).optional(),
    occupation: z.object({
      farmer: z.number().min(0).optional(),
      fisherman: z.number().min(0).optional(),
      trader: z.number().min(0).optional(),
      civilServant: z.number().min(0).optional(),
      private: z.number().min(0).optional(),
      unemployed: z.number().min(0).optional(),
      other: z.number().min(0).optional()
    }).optional()
  }),
  geography: z.object({
    area: z.number().min(0),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }).optional(),
    boundaries: z.object({
      north: z.string().optional(),
      south: z.string().optional(),
      east: z.string().optional(),
      west: z.string().optional()
    }).optional(),
    topography: z.enum(['Dataran', 'Perbukitan', 'Pantai', 'Campuran']).optional(),
    altitude: z.number().optional()
  }),
  contact: z.object({
    office: z.object({
      address: z.string().min(1),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      website: z.string().url().optional()
    }),
    emergencyContacts: z.array(z.object({
      type: z.string(),
      name: z.string(),
      phone: z.string()
    })).optional()
  }),
  description: z.string().max(2000).optional(),
  history: z.string().max(5000).optional(),
  status: z.enum(['active', 'inactive', 'merged']).default('active'),
  featured: z.boolean().default(false)
})

// GET - List all villages with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const district = searchParams.get('district')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build filter query
    const filter: any = {}
    if (district) filter.district = district
    if (type) filter.type = type
    if (status) filter.status = status
    if (featured) filter.featured = featured === 'true'
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'head.name': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [villages, total] = await Promise.all([
      Village.find(filter)
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
        .sort({ district: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Village.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      data: villages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get villages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch villages' },
      { status: 500 }
    )
  }
}

// POST - Create new village
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = villageSchema.parse(body)
    
    // Check if code already exists
    const existingVillage = await Village.findOne({ code: validatedData.code })
    if (existingVillage) {
      return NextResponse.json(
        { error: 'Village with this code already exists' },
        { status: 400 }
      )
    }

    // Create village
    const village = new Village({
      ...validatedData,
      createdBy: authResult.user.id
    })

    await village.save()

    // Populate references for response
    await village.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: village,
      message: 'Village created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create village error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create village' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update villages
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const body = await request.json()
    const { ids, updates } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid village IDs' },
        { status: 400 }
      )
    }

    // Update multiple villages
    const result = await Village.updateMany(
      { _id: { $in: ids } },
      { 
        ...updates,
        updatedBy: authResult.user.id,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} villages`,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Bulk update villages error:', error)
    return NextResponse.json(
      { error: 'Failed to update villages' },
      { status: 500 }
    )
  }
}
