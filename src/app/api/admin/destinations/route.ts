import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination } from '@/lib/models/tourism'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const destinationSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  shortDescription: z.string().min(1).max(300),
  category: z.enum(['Pantai', 'Bukit', 'Hutan', 'Mata Air', 'Budaya', 'Sejarah', 'Religi', 'Kuliner']),
  subcategory: z.enum(['Wisata Alam', 'Wisata Budaya', 'Wisata Religi', 'Wisata Kuliner', 'Wisata Sejarah']).optional(),
  location: z.object({
    district: z.enum(['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']),
    village: z.string().optional(),
    address: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }).optional()
  }),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    isPrimary: z.boolean().default(false)
  })).optional(),
  facilities: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  accessibility: z.object({
    difficulty: z.enum(['Mudah', 'Sedang', 'Sulit']).default('Mudah'),
    duration: z.string().optional(),
    bestTime: z.string().optional(),
    access: z.string().optional()
  }).optional(),
  pricing: z.object({
    entrance: z.string().optional(),
    parking: z.string().optional(),
    guide: z.string().optional(),
    notes: z.string().optional()
  }).optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
    socialMedia: z.object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional()
    }).optional()
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false)
})

// GET - List all destinations with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const district = searchParams.get('district')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build filter query
    const filter: {
      category?: string
      'location.district'?: string
      status?: string
      featured?: boolean
      $or?: Array<{
        name?: { $regex: string; $options: string }
        description?: { $regex: string; $options: string }
        shortDescription?: { $regex: string; $options: string }
      }>
    } = {}
    if (category) filter.category = category
    if (district) filter['location.district'] = district
    if (status) filter.status = status
    if (featured) filter.featured = featured === 'true'
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Destination.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      data: destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get destinations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }
}

// POST - Create new destination
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth()
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = destinationSchema.parse(body)
    
    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug already exists
    const existingDestination = await Destination.findOne({ slug })
    if (existingDestination) {
      return NextResponse.json(
        { error: 'Destination with this name already exists' },
        { status: 400 }
      )
    }

    // Create destination
    const destination = new Destination({
      ...validatedData,
      slug,
      createdBy: authResult.user?.id,
      publishedAt: validatedData.status === 'published' ? new Date() : undefined
    })

    await destination.save()

    // Populate references for response
    await destination.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: destination,
      message: 'Destination created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create destination error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create destination' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update destinations
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth()
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
        { error: 'Invalid destination IDs' },
        { status: 400 }
      )
    }

    // Update multiple destinations
    const result = await Destination.updateMany(
      { _id: { $in: ids } },
      {
        ...updates,
        updatedBy: authResult.user?.id,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} destinations`,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Bulk update destinations error:', error)
    return NextResponse.json(
      { error: 'Failed to update destinations' },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete destinations
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth()
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
        { error: 'No destination IDs provided' },
        { status: 400 }
      )
    }

    // Delete destinations
    const result = await Destination.deleteMany({
      _id: { $in: ids }
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} destinations`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Bulk delete destinations error:', error)
    return NextResponse.json(
      { error: 'Failed to delete destinations' },
      { status: 500 }
    )
  }
}
