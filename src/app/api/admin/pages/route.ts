import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Page } from '@/lib/models/content'
import { verifyAdminAuth, generateSlug } from '@/lib/auth'
import { z } from 'zod'

// Validation schema
const pageSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum(['profile', 'history', 'vision_mission', 'structure', 'service', 'about', 'contact', 'custom']),
  content: z.string().min(1),
  sections: z.array(z.object({
    title: z.string().optional(),
    content: z.string(),
    order: z.number().optional(),
    type: z.enum(['text', 'image', 'video', 'gallery', 'table', 'list', 'quote']).optional()
  })).optional(),
  metadata: z.object({
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    lastReviewed: z.string().transform(str => new Date(str)).optional()
  }).optional(),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    order: z.number().optional()
  })).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
    size: z.number().optional()
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft')
})

// GET - List all pages with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build filter query
    const filter: any = {}
    if (type) filter.type = type
    if (status) filter.status = status
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit

    const [pages, total] = await Promise.all([
      Page.find(filter)
        .populate('createdBy', 'fullName email')
        .populate('updatedBy', 'fullName email')
        .sort({ type: 1, title: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Page.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      data: pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get pages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST - Create new page
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
    const validatedData = pageSchema.parse(body)
    
    // Generate slug from title
    const slug = generateSlug(validatedData.title)

    // Check if slug already exists
    const existingPage = await Page.findOne({ slug })
    if (existingPage) {
      return NextResponse.json(
        { error: 'Page with this title already exists' },
        { status: 400 }
      )
    }

    // Create page
    const page = new Page({
      ...validatedData,
      slug,
      createdBy: authResult.user?.id,
      publishedAt: validatedData.status === 'published' ? new Date() : undefined
    })

    await page.save()

    // Populate references for response
    await page.populate('createdBy', 'fullName email')

    return NextResponse.json({
      success: true,
      data: page,
      message: 'Page created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create page error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
