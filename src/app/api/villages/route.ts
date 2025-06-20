import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Village } from '@/lib/models/village'

// GET - Public endpoint for fetching active villages
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const district = searchParams.get('district')
    const type = searchParams.get('type')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'name'

    // Build filter query - only active villages
    const filter: any = { status: 'active' }
    
    if (district) filter.district = district
    if (type) filter.type = type
    if (featured) filter.featured = featured === 'true'
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'head.name': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort query
    let sortQuery: any = { district: 1, name: 1 } // default: by district then name
    switch (sort) {
      case 'name':
        sortQuery = { name: 1 }
        break
      case 'district':
        sortQuery = { district: 1, name: 1 }
        break
      case 'population':
        sortQuery = { 'demographics.population.total': -1 }
        break
      case 'area':
        sortQuery = { 'geography.area': -1 }
        break
      case 'type':
        sortQuery = { type: 1, name: 1 }
        break
    }

    const skip = (page - 1) * limit

    const [villages, total] = await Promise.all([
      Village.find(filter)
        .select('-createdBy -updatedBy -__v -lastUpdated') // Exclude sensitive/internal fields
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Village.countDocuments(filter)
    ])

    // Calculate summary statistics
    const stats = await Village.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalVillages: { $sum: 1 },
          totalDesa: { $sum: { $cond: [{ $eq: ['$type', 'desa'] }, 1, 0] } },
          totalKelurahan: { $sum: { $cond: [{ $eq: ['$type', 'kelurahan'] }, 1, 0] } },
          totalPopulation: { $sum: '$demographics.population.total' },
          totalArea: { $sum: '$geography.area' },
          byDistrict: {
            $push: {
              district: '$district',
              count: 1,
              population: '$demographics.population.total'
            }
          }
        }
      }
    ])

    // Group by district for summary
    const districtSummary = await Village.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 },
          population: { $sum: '$demographics.population.total' },
          area: { $sum: '$geography.area' },
          desa: { $sum: { $cond: [{ $eq: ['$type', 'desa'] }, 1, 0] } },
          kelurahan: { $sum: { $cond: [{ $eq: ['$type', 'kelurahan'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return NextResponse.json({
      success: true,
      data: villages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: stats[0] || {
        totalVillages: 0,
        totalDesa: 0,
        totalKelurahan: 0,
        totalPopulation: 0,
        totalArea: 0
      },
      districtSummary,
      filters: {
        districts: await getUniqueDistricts(),
        types: ['desa', 'kelurahan']
      }
    })

  } catch (error) {
    console.error('Get villages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch villages' },
      { status: 500 }
    )
  }
}

// Helper function to get unique districts
async function getUniqueDistricts() {
  try {
    const districts = await Village.distinct('district', { status: 'active' })
    return districts.sort()
  } catch (error) {
    console.error('Failed to get unique districts:', error)
    return []
  }
}
