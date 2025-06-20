import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination } from '@/lib/models/tourism'
import { verifyAdminAuth } from '@/lib/auth'
import { z } from 'zod'

// Validation schema (same as in route.ts but partial for updates)
const updateDestinationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  shortDescription: z.string().min(1).max(300).optional(),
  category: z.enum(['Pantai', 'Bukit', 'Hutan', 'Mata Air', 'Budaya', 'Sejarah', 'Religi', 'Kuliner']).optional(),
  subcategory: z.enum(['Wisata Alam', 'Wisata Budaya', 'Wisata Religi', 'Wisata Kuliner', 'Wisata Sejarah']).optional(),
  location: z.object({
    district: z.enum(['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']).optional(),
    village: z.string().optional(),
    address: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }).optional()
  }).optional(),
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
    difficulty: z.enum(['Mudah', 'Sedang', 'Sulit']).optional(),
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
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional()
}).partial()

// GET - Get single destination
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const destination = await Destination.findById(params.id)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email')
      .lean()

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: destination
    })

  } catch (error) {
    console.error('Get destination error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    )
  }
}

// PUT - Update destination
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateDestinationSchema.parse(body)
    
    // Check if destination exists
    const existingDestination = await Destination.findById(params.id)
    if (!existingDestination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Generate new slug if name is being updated
    let updateData = { ...validatedData }
    if (validatedData.name) {
      const newSlug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      // Check if new slug conflicts with existing destinations (excluding current one)
      const slugConflict = await Destination.findOne({ 
        slug: newSlug, 
        _id: { $ne: params.id } 
      })
      
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Destination with this name already exists' },
          { status: 400 }
        )
      }

      updateData.slug = newSlug
    }

    // Set publishedAt if status is being changed to published
    if (validatedData.status === 'published' && existingDestination.status !== 'published') {
      updateData.publishedAt = new Date()
    }

    // Update destination
    const destination = await Destination.findByIdAndUpdate(
      params.id,
      {
        ...updateData,
        updatedBy: authResult.user.id,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName email')
     .populate('updatedBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: destination,
      message: 'Destination updated successfully'
    })

  } catch (error) {
    console.error('Update destination error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update destination' },
      { status: 500 }
    )
  }
}

// DELETE - Delete destination
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if destination exists
    const destination = await Destination.findById(params.id)
    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Delete destination
    await Destination.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    })

  } catch (error) {
    console.error('Delete destination error:', error)
    return NextResponse.json(
      { error: 'Failed to delete destination' },
      { status: 500 }
    )
  }
}
