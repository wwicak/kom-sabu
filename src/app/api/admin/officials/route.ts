import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Official } from '@/lib/models/content'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const officialSchema = z.object({
  name: z.string().min(1).max(200),
  position: z.string().min(1).max(200),
  level: z.enum(['kabupaten', 'kecamatan', 'dinas', 'badan', 'sekretariat']),
  category: z.enum(['pimpinan', 'kepala_dinas', 'camat', 'sekretaris', 'staff']),
  department: z.string().min(1),
  period: z.object({
    start: z.string().transform(str => new Date(str)).optional(),
    end: z.string().transform(str => new Date(str)).optional()
  }).optional(),
  education: z.string().optional(),
  experience: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  vision: z.string().max(1000).optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    office: z.string().optional()
  }).optional(),
  photo: z.object({
    url: z.string().optional(),
    alt: z.string().optional()
  }).optional(),
  biography: z.string().max(5000).optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional()
  }).optional(),
  order: z.number().default(0),
  status: z.enum(['active', 'inactive', 'retired']).default('active'),
  featured: z.boolean().default(false)
})

// GET - List all officials with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build filter query
    const filter: {
      level?: string
      category?: string
      department?: string
      status?: string
      featured?: boolean
      $or?: Array<{
        name?: { $regex: string; $options: string }
        position?: { $regex: string; $options: string }
        department?: { $regex: string; $options: string }
      }>
    } = {}
    if (level) filter.level = level
    if (category) filter.category = category
    if (department) filter.department = department
    if (status) filter.status = status
    if (featured) filter.featured = featured === 'true'
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [officials, total] = await Promise.all([
      Official.find(filter)
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
        .sort({ order: 1, level: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Official.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      data: officials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get officials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch officials' },
      { status: 500 }
    )
  }
}

// POST - Create new official
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
    const validatedData = officialSchema.parse(body)

    // Create official
    const official = new Official({
      ...validatedData,
      createdBy: authResult.user?.id
    })

    await official.save()

    // Populate references for response
    await official.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: official,
      message: 'Official created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create official error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create official' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update officials
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
        { error: 'Invalid official IDs' },
        { status: 400 }
      )
    }

    // Update multiple officials
    const result = await Official.updateMany(
      { _id: { $in: ids } },
      {
        ...updates,
        updatedBy: authResult.user?.id,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} officials`,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Bulk update officials error:', error)
    return NextResponse.json(
      { error: 'Failed to update officials' },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete officials
export async function DELETE(request: NextRequest) {
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
    
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',')

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: 'No official IDs provided' },
        { status: 400 }
      )
    }

    // Delete officials
    const result = await Official.deleteMany({
      _id: { $in: ids }
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} officials`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Bulk delete officials error:', error)
    return NextResponse.json(
      { error: 'Failed to delete officials' },
      { status: 500 }
    )
  }
}
