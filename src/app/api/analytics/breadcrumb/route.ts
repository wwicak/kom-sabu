import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { BreadcrumbAnalytics } from '@/models/BreadcrumbAnalytics'

// POST - Track breadcrumb events
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    
    // Validate required fields
    if (!body.action || !body.category || !body.label) {
      return NextResponse.json(
        { error: 'Missing required fields: action, category, label' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create analytics record
    const analyticsData = {
      ...body,
      clientIP,
      userAgent,
      timestamp: new Date(),
      sessionId: body.custom_parameters?.user_session_id || null,
    }

    const analytics = new BreadcrumbAnalytics(analyticsData)
    await analytics.save()

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event tracked successfully' 
    })

  } catch (error) {
    console.error('Breadcrumb analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics event' },
      { status: 500 }
    )
  }
}

// GET - Retrieve analytics insights
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const action = searchParams.get('action') // 'breadcrumb_click' or 'breadcrumb_view'

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    // Build query
    const query: any = {}
    if (Object.keys(dateFilter).length > 0) {
      query.timestamp = dateFilter
    }
    if (action) {
      query.action = action
    }

    // Get analytics data
    const analytics = await BreadcrumbAnalytics.find(query).sort({ timestamp: -1 })

    // Calculate insights
    const totalViews = analytics.filter(a => a.action === 'breadcrumb_view').length
    const totalClicks = analytics.filter(a => a.action === 'breadcrumb_click').length
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

    // Popular paths analysis
    const pathViews: Record<string, { views: number; clicks: number }> = {}
    
    analytics.forEach(event => {
      const path = event.label
      if (!pathViews[path]) {
        pathViews[path] = { views: 0, clicks: 0 }
      }
      
      if (event.action === 'breadcrumb_view') {
        pathViews[path].views++
      } else if (event.action === 'breadcrumb_click') {
        pathViews[path].clicks++
      }
    })

    const popularPaths = Object.entries(pathViews)
      .map(([path, data]) => ({ path, ...data }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Drop-off analysis (positions where users don't click)
    const positionClicks: Record<number, number> = {}
    const positionViews: Record<number, number> = {}

    analytics.forEach(event => {
      if (event.action === 'breadcrumb_click' && event.custom_parameters?.breadcrumb_position) {
        const position = event.custom_parameters.breadcrumb_position
        positionClicks[position] = (positionClicks[position] || 0) + 1
      }
      if (event.action === 'breadcrumb_view' && event.custom_parameters?.breadcrumb_depth) {
        const depth = event.custom_parameters.breadcrumb_depth
        for (let i = 1; i <= depth; i++) {
          positionViews[i] = (positionViews[i] || 0) + 1
        }
      }
    })

    const dropOffPoints = Object.keys(positionViews)
      .map(position => {
        const pos = parseInt(position)
        const views = positionViews[pos] || 0
        const clicks = positionClicks[pos] || 0
        const dropOffRate = views > 0 ? ((views - clicks) / views) * 100 : 0
        return { position: pos, dropOffRate }
      })
      .sort((a, b) => b.dropOffRate - a.dropOffRate)

    return NextResponse.json({
      totalViews,
      totalClicks,
      clickThroughRate: Math.round(clickThroughRate * 100) / 100,
      popularPaths,
      dropOffPoints,
      totalEvents: analytics.length,
      dateRange: {
        start: startDate || 'all time',
        end: endDate || 'now'
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
