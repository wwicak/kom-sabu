import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination, Accommodation, Culinary } from '@/lib/models/tourism'
import { Village } from '@/lib/models/village'

// GET - Tourism statistics
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Get counts and statistics
    const [
      destinationStats,
      accommodationCount,
      culinaryCount,
      villageStats
    ] = await Promise.all([
      // Destination statistics
      Destination.aggregate([
        { $match: { status: 'published' } },
        {
          $group: {
            _id: null,
            totalDestinations: { $sum: 1 },
            averageRating: { $avg: '$rating.average' },
            totalViews: { $sum: '$statistics.views' },
            featuredCount: { $sum: { $cond: ['$featured', 1, 0] } },
            byCategory: {
              $push: {
                category: '$category',
                subcategory: '$subcategory',
                district: '$location.district'
              }
            }
          }
        }
      ]),
      
      // Accommodation count
      Accommodation.countDocuments({ status: 'published' }),
      
      // Culinary count
      Culinary.countDocuments({ status: 'published' }),
      
      // Village statistics
      Village.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            totalVillages: { $sum: 1 },
            totalPopulation: { $sum: '$demographics.population.total' },
            totalArea: { $sum: '$geography.area' }
          }
        }
      ])
    ])

    // Process category breakdown
    const categoryBreakdown: Record<string, number> = {}
    const districtBreakdown: Record<string, number> = {}
    
    if (destinationStats[0]?.byCategory) {
      destinationStats[0].byCategory.forEach((item: any) => {
        categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1
        districtBreakdown[item.district] = (districtBreakdown[item.district] || 0) + 1
      })
    }

    // Calculate estimated annual visitors (based on views and some assumptions)
    const totalViews = destinationStats[0]?.totalViews || 0
    const estimatedVisitors = Math.round(totalViews * 0.1) // Assume 10% of views convert to actual visits

    const stats = {
      totalDestinations: destinationStats[0]?.totalDestinations || 0,
      totalVisitors: estimatedVisitors,
      averageRating: destinationStats[0]?.averageRating || 0,
      totalAccommodations: accommodationCount,
      totalCulinary: culinaryCount,
      totalVillages: villageStats[0]?.totalVillages || 0,
      totalPopulation: villageStats[0]?.totalPopulation || 0,
      totalArea: villageStats[0]?.totalArea || 0,
      featuredDestinations: destinationStats[0]?.featuredCount || 0,
      totalViews: totalViews,
      categoryBreakdown,
      districtBreakdown,
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Get tourism stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tourism statistics' },
      { status: 500 }
    )
  }
}
