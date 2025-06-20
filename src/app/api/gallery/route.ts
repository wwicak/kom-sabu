import { NextRequest, NextResponse } from 'next/server'
import { GalleryItem } from '@/lib/models'
import mongoose from 'mongoose'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Max 50 items per page
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const published = searchParams.get('published') !== 'false' // Default to published only
    
    // Build query
    const query: {
      isPublished?: boolean
      category?: string
      $or?: Array<{
        title?: { $regex: string; $options: string }
        description?: { $regex: string; $options: string }
        tags?: { $in: RegExp[] }
      }>
    } = {}
    
    if (published) {
      query.isPublished = true
    }
    
    if (category && category !== 'Semua') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit
    
    // Execute query with pagination
    const [items, total] = await Promise.all([
      GalleryItem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      GalleryItem.countDocuments(query)
    ])
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1
    
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    })
    
  } catch (error) {
    console.error('Gallery fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch gallery items'
      },
      { status: 500 }
    )
  }
}

// Get gallery categories and stats
export async function HEAD() {
  try {
    const stats = await GalleryItem.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    const totalPublished = await GalleryItem.countDocuments({ isPublished: true })
    
    return NextResponse.json({
      success: true,
      data: {
        categories: stats,
        total: totalPublished
      }
    })
    
  } catch (error) {
    console.error('Gallery stats error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch gallery statistics'
      },
      { status: 500 }
    )
  }
}
