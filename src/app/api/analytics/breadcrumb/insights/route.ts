import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { BreadcrumbAnalytics } from '@/models/BreadcrumbAnalytics'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const groupBy = searchParams.get('group_by') || 'day' // day, week, month
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    const query = Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {}

    // Get basic metrics using static methods
    const ctrData = await BreadcrumbAnalytics.getClickThroughRate(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    const popularPaths = await BreadcrumbAnalytics.getPopularPaths(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    const dropOffData = await BreadcrumbAnalytics.getDropOffAnalysis(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    // Time-based analytics
    let groupByFormat: string
    switch (groupBy) {
      case 'hour':
        groupByFormat = '%Y-%m-%d %H:00:00'
        break
      case 'week':
        groupByFormat = '%Y-%U'
        break
      case 'month':
        groupByFormat = '%Y-%m'
        break
      default: // day
        groupByFormat = '%Y-%m-%d'
    }

    const timeSeriesData = await BreadcrumbAnalytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupByFormat, date: '$timestamp' } },
            action: '$action'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ])

    // Format time series data
    const timeSeriesFormatted: Record<string, { views: number; clicks: number }> = {}
    timeSeriesData.forEach(item => {
      const date = item._id.date
      if (!timeSeriesFormatted[date]) {
        timeSeriesFormatted[date] = { views: 0, clicks: 0 }
      }
      if (item._id.action === 'breadcrumb_view') {
        timeSeriesFormatted[date].views = item.count
      } else if (item._id.action === 'breadcrumb_click') {
        timeSeriesFormatted[date].clicks = item.count
      }
    })

    // User behavior analysis
    const userBehavior = await BreadcrumbAnalytics.aggregate([
      { $match: query },
      { $match: { sessionId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$sessionId',
          totalEvents: { $sum: 1 },
          totalClicks: {
            $sum: { $cond: [{ $eq: ['$action', 'breadcrumb_click'] }, 1, 0] }
          },
          totalViews: {
            $sum: { $cond: [{ $eq: ['$action', 'breadcrumb_view'] }, 1, 0] }
          },
          firstEvent: { $min: '$timestamp' },
          lastEvent: { $max: '$timestamp' },
          uniquePages: { $addToSet: '$label' }
        }
      },
      {
        $project: {
          sessionId: '$_id',
          totalEvents: 1,
          totalClicks: 1,
          totalViews: 1,
          sessionDuration: {
            $divide: [{ $subtract: ['$lastEvent', '$firstEvent'] }, 1000 * 60] // minutes
          },
          uniquePagesCount: { $size: '$uniquePages' },
          clickThroughRate: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              { $multiply: [{ $divide: ['$totalClicks', '$totalViews'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalEvents: -1 } },
      { $limit: limit }
    ])

    // Device and browser analysis
    const deviceAnalysis = await BreadcrumbAnalytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            userAgent: '$userAgent',
            screenResolution: '$screen_resolution',
            viewportSize: '$viewport_size'
          },
          count: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' }
        }
      },
      {
        $project: {
          userAgent: '$_id.userAgent',
          screenResolution: '$_id.screenResolution',
          viewportSize: '$_id.viewportSize',
          eventCount: '$count',
          uniqueSessionCount: { $size: '$uniqueSessions' }
        }
      },
      { $sort: { eventCount: -1 } },
      { $limit: 20 }
    ])

    // Page performance analysis
    const pagePerformance = await BreadcrumbAnalytics.aggregate([
      { $match: { ...query, action: 'breadcrumb_view' } },
      {
        $group: {
          _id: '$label',
          totalViews: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          avgDepth: { $avg: '$custom_parameters.breadcrumb_depth' }
        }
      },
      {
        $lookup: {
          from: 'breadcrumb_analytics',
          let: { page: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$action', 'breadcrumb_click'] },
                    { $eq: ['$custom_parameters.source_page', '$$page'] }
                  ]
                }
              }
            },
            { $count: 'clicks' }
          ],
          as: 'clickData'
        }
      },
      {
        $project: {
          page: '$_id',
          totalViews: 1,
          uniqueSessionCount: { $size: '$uniqueSessions' },
          avgDepth: { $round: ['$avgDepth', 2] },
          totalClicks: { $ifNull: [{ $arrayElemAt: ['$clickData.clicks', 0] }, 0] },
          clickThroughRate: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $ifNull: [{ $arrayElemAt: ['$clickData.clicks', 0] }, 0] },
                          '$totalViews'
                        ]
                      },
                      100
                    ]
                  },
                  2
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: 20 }
    ])

    return NextResponse.json({
      summary: {
        totalViews: ctrData.totalViews,
        totalClicks: ctrData.totalClicks,
        clickThroughRate: Math.round(ctrData.clickThroughRate * 100) / 100,
        dateRange: {
          start: startDate || 'all time',
          end: endDate || 'now'
        }
      },
      popularPaths,
      dropOffAnalysis: {
        positionClicks: dropOffData.positionData,
        depthViews: dropOffData.depthData
      },
      timeSeries: Object.entries(timeSeriesFormatted).map(([date, data]) => ({
        date,
        ...data,
        clickThroughRate: data.views > 0 ? Math.round((data.clicks / data.views) * 10000) / 100 : 0
      })),
      userBehavior: userBehavior.slice(0, 10), // Top 10 most active sessions
      deviceAnalysis,
      pagePerformance,
      metadata: {
        generatedAt: new Date().toISOString(),
        queryParameters: {
          startDate,
          endDate,
          groupBy,
          limit
        }
      }
    })

  } catch (error) {
    console.error('Analytics insights error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics insights' },
      { status: 500 }
    )
  }
}
