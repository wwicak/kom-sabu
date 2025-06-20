import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { News } from '@/lib/models/content'

// GET - Public endpoint for fetching published news
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter query - only published news
    const filter: any = { status: 'published' }
    
    if (category && category !== 'Semua') {
      filter.category = category.toLowerCase()
    }
    
    if (featured === 'true') {
      filter.featured = true
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Build sort query
    let sortQuery: any = {}
    switch (sort) {
      case 'newest':
        sortQuery = { publishedAt: -1 }
        break
      case 'oldest':
        sortQuery = { publishedAt: 1 }
        break
      case 'popular':
        sortQuery = { 'statistics.views': -1 }
        break
      case 'title':
        sortQuery = { title: 1 }
        break
      default:
        sortQuery = { publishedAt: -1 }
    }

    const skip = (page - 1) * limit

    const [news, total] = await Promise.all([
      News.find(filter)
        .populate('author', 'fullName username')
        .select('-content') // Exclude full content for list view
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments(filter)
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        news,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
