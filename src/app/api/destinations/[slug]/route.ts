import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination } from '@/lib/models/tourism'

// GET - Get single destination by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase()
    
    const destination = await Destination.findOne({ 
      slug: params.slug, 
      status: 'published' 
    })
    .select('-createdBy -updatedBy -__v') // Exclude sensitive fields
    .lean()

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      )
    }

    // Increment view count (async, don't wait)
    Destination.findByIdAndUpdate(
      (destination as any)._id,
      { $inc: { 'statistics.views': 1 } }
    ).catch(err => console.error('Failed to update view count:', err))

    // Get related destinations (same category or district)
    const relatedDestinations = await Destination.find({
      _id: { $ne: (destination as any)._id },
      status: 'published',
      $or: [
        { category: (destination as any).category },
        { 'location.district': (destination as any).location?.district }
      ]
    })
    .select('name slug shortDescription category location.district images rating')
    .limit(4)
    .lean()

    return NextResponse.json({
      success: true,
      data: {
        destination,
        related: relatedDestinations
      }
    })

  } catch (error) {
    console.error('Get destination error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destination' },
      { status: 500 }
    )
  }
}
