import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { CulturalAsset } from '@/lib/models/cultural-heritage'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const culturalAssetSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.enum(['Kerajinan Tradisional', 'Seni Pertunjukan', 'Bahasa & Sastra', 'Wisata Alam', 'Kuliner', 'Upacara Adat', 'Arsitektur', 'Musik Tradisional']),
  type: z.enum(['asset', 'tradition', 'destination', 'culinary']),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    order: z.number().default(0)
  })).optional(),
  icon: z.enum(['Palette', 'Music', 'MapPin', 'Camera', 'Utensils', 'Users', 'Building', 'Heart']).default('Heart'),
  content: z.string().optional(),
  metadata: z.object({
    origin: z.string().optional(),
    period: z.string().optional(),
    significance: z.string().optional(),
    preservation: z.string().optional(),
    practitioners: z.string().optional(),
    materials: z.array(z.string()).optional(),
    techniques: z.array(z.string()).optional(),
    occasions: z.array(z.string()).optional()
  }).optional(),
  location: z.object({
    district: z.enum(['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']).optional(),
    village: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }).optional()
  }).optional(),
  status: z.enum(['active', 'endangered', 'extinct', 'reviving']).default('active'),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  visibility: z.enum(['public', 'private', 'draft']).default('draft'),
  tags: z.array(z.string()).optional()
})

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// GET - List all cultural assets with filtering and pagination
export async function GET(request: NextRequest) {
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const visibility = searchParams.get('visibility')
    const featured = searchParams.get('featured')
    const district = searchParams.get('district')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter query
    const filter: any = {}
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (type && type !== 'all') {
      filter.type = type
    }
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (visibility && visibility !== 'all') {
      filter.visibility = visibility
    }
    
    if (featured === 'true') {
      filter.featured = true
    }
    
    if (district && district !== 'all') {
      filter['location.district'] = district
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Build sort query
    let sortQuery: any = { createdAt: -1 } // Default: newest first
    
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'title':
        sortQuery = { title: 1 }
        break
      case 'order':
        sortQuery = { order: 1, title: 1 }
        break
      case 'category':
        sortQuery = { category: 1, title: 1 }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get cultural assets with pagination
    const assets = await CulturalAsset.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await CulturalAsset.countDocuments(filter)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        assets,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    })

  } catch (error) {
    console.error('Get cultural assets error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cultural assets' },
      { status: 500 }
    )
  }
}

// POST - Create new cultural asset
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
    const validatedData = culturalAssetSchema.parse(body)

    // Generate slug from title
    const slug = generateSlug(validatedData.title)

    // Check if slug already exists
    const existingAsset = await CulturalAsset.findOne({ slug })
    if (existingAsset) {
      return NextResponse.json(
        { error: 'Cultural asset with this title already exists' },
        { status: 400 }
      )
    }

    // Create cultural asset
    const asset = new CulturalAsset({
      ...validatedData,
      slug,
      createdBy: authResult.user?.id
    })

    await asset.save()

    // Populate references for response
    await asset.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: asset,
      message: 'Cultural asset created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create cultural asset error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create cultural asset' },
      { status: 500 }
    )
  }
}

// PATCH - Bulk update cultural assets
export async function PATCH(request: NextRequest) {
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

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Asset IDs are required' },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      )
    }

    // Update cultural assets
    const result = await CulturalAsset.updateMany(
      { _id: { $in: ids } },
      { 
        ...updates,
        updatedBy: authResult.user?.id,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} cultural asset(s) updated successfully`
      }
    })

  } catch (error) {
    console.error('Update cultural assets error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cultural assets' },
      { status: 500 }
    )
  }
}

// DELETE - Delete cultural assets
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
        { error: 'Asset IDs are required' },
        { status: 400 }
      )
    }

    // Delete cultural assets
    const result = await CulturalAsset.deleteMany({
      _id: { $in: ids }
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} cultural asset(s) deleted successfully`
      }
    })

  } catch (error) {
    console.error('Delete cultural assets error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete cultural assets' },
      { status: 500 }
    )
  }
}
