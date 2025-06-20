import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination } from '@/lib/models/tourism'

// GET - Public endpoint for fetching published destinations
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const district = searchParams.get('district')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter query - only published destinations
    const filter: any = { status: 'published' }
    
    if (category) filter.category = category
    if (subcategory) filter.subcategory = subcategory
    if (district) filter['location.district'] = district
    if (featured) filter.featured = featured === 'true'
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { highlights: { $in: [new RegExp(search, 'i')] } },
        { activities: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Build sort query
    let sortQuery: any = { createdAt: -1 } // default: newest first
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'name-asc':
        sortQuery = { name: 1 }
        break
      case 'name-desc':
        sortQuery = { name: -1 }
        break
      case 'rating':
        sortQuery = { 'rating.average': -1, 'rating.count': -1 }
        break
      case 'popular':
        sortQuery = { 'statistics.views': -1 }
        break
      case 'featured':
        sortQuery = { featured: -1, createdAt: -1 }
        break
    }

    const skip = (page - 1) * limit

    const [destinations, total] = await Promise.all([
      Destination.find(filter)
        .select('-createdBy -updatedBy -__v') // Exclude sensitive fields
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Destination.countDocuments(filter)
    ])

    // Increment view count for each destination (async, don't wait)
    if (destinations.length > 0) {
      const destinationIds = destinations.map(d => d._id)
      Destination.updateMany(
        { _id: { $in: destinationIds } },
        { $inc: { 'statistics.views': 1 } }
      ).catch(err => console.error('Failed to update view counts:', err))
    }

    return NextResponse.json({
      success: true,
      data: destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories: await getUniqueValues('category'),
        subcategories: await getUniqueValues('subcategory'),
        districts: await getUniqueValues('location.district')
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

// Helper function to get unique filter values
async function getUniqueValues(field: string) {
  try {
    const values = await Destination.distinct(field, { status: 'published' })
    return values.filter(Boolean) // Remove null/undefined values
  } catch (error) {
    console.error(`Failed to get unique values for ${field}:`, error)
    return []
  }
}
