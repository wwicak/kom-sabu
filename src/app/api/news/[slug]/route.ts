import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { News } from '@/lib/models/content'

// GET - Get single news article by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase()

    const { slug } = await params
    const news = await News.findOne({
      slug,
      status: 'published'
    })
    .populate('author', 'fullName username email')
    .select('-createdBy -updatedBy -__v') // Exclude sensitive fields
    .lean()

    if (!news) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      )
    }

    // Increment view count (async, don't wait)
    News.findByIdAndUpdate(
      (news as any)._id,
      { $inc: { 'statistics.views': 1 } }
    ).catch(err => console.error('Failed to update view count:', err))

    // Get related news (same category, excluding current)
    const relatedNews = await News.find({
      _id: { $ne: (news as any)._id },
      category: (news as any).category,
      status: 'published'
    })
    .populate('author', 'fullName username')
    .select('title slug excerpt featuredImage publishedAt category tags statistics')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean()

    return NextResponse.json({
      success: true,
      data: {
        news,
        related: relatedNews
      }
    })

  } catch (error) {
    console.error('Get news detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news article' },
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
