import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Service } from '@/lib/models/content'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const serviceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.enum(['administrasi', 'perizinan', 'sosial', 'kesehatan', 'pendidikan', 'ekonomi', 'infrastruktur', 'lingkungan']),
  department: z.string().min(1),
  requirements: z.array(z.string()).optional(),
  procedures: z.array(z.object({
    step: z.number(),
    description: z.string(),
    duration: z.string().optional(),
    cost: z.string().optional()
  })).optional(),
  documents: z.array(z.string()).optional(),
  fees: z.array(z.object({
    type: z.string(),
    amount: z.string(),
    description: z.string().optional()
  })).optional(),
  duration: z.string().min(1),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    hours: z.string().optional()
  }).optional(),
  onlineService: z.object({
    available: z.boolean().default(false),
    url: z.string().url().optional(),
    description: z.string().optional()
  }).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  featured: z.boolean().default(false),
  order: z.number().default(0)
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

// GET - List all services with filtering and pagination
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
    const department = searchParams.get('department')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter query
    const filter: any = {}
    
    if (category && category !== 'all') {
      filter.category = category
    }
    
    if (department) {
      filter.department = { $regex: department, $options: 'i' }
    }
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (featured === 'true') {
      filter.featured = true
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort query
    let sortQuery: any = { createdAt: -1 } // Default: newest first
    
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'name':
        sortQuery = { name: 1 }
        break
      case 'order':
        sortQuery = { order: 1, name: 1 }
        break
      case 'department':
        sortQuery = { department: 1, name: 1 }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get services with pagination
    const services = await Service.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Service.countDocuments(filter)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        services,
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
    console.error('Get services error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST - Create new service
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
    const validatedData = serviceSchema.parse(body)
    
    // Generate slug from name
    const slug = generateSlug(validatedData.name)

    // Check if slug already exists
    const existingService = await Service.findOne({ slug })
    if (existingService) {
      return NextResponse.json(
        { error: 'Service with this name already exists' },
        { status: 400 }
      )
    }

    // Create service
    const service = new Service({
      ...validatedData,
      slug,
      createdBy: authResult.user?.id
    })

    await service.save()

    // Populate references for response
    await service.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create service error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

// PATCH - Bulk update services
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
        { error: 'Service IDs are required' },
        { status: 400 }
      )
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object is required' },
        { status: 400 }
      )
    }

    // Update services
    const result = await Service.updateMany(
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
        message: `${result.modifiedCount} service(s) updated successfully`
      }
    })

  } catch (error) {
    console.error('Update services error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update services' },
      { status: 500 }
    )
  }
}

// DELETE - Delete services
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
        { error: 'Service IDs are required' },
        { status: 400 }
      )
    }

    // Delete services
    const result = await Service.deleteMany({
      _id: { $in: ids }
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} service(s) deleted successfully`
      }
    })

  } catch (error) {
    console.error('Delete services error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete services' },
      { status: 500 }
    )
  }
}
