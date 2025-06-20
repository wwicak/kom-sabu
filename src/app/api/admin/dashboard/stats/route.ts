import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Destination } from '@/lib/models/tourism'
import { Official, Page, Gallery } from '@/lib/models/content'
import { Village } from '@/lib/models/village'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(_request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Fetch real statistics from database
    const [
      destinationsCount,
      officialsCount,
      villagesCount,
      pagesCount,
      galleryCount,
      recentDestinations,
      recentOfficials
    ] = await Promise.all([
      Destination.countDocuments(),
      Official.countDocuments(),
      Village.countDocuments(),
      Page.countDocuments(),
      Gallery.countDocuments(),
      Destination.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title status createdAt')
        .lean(),
      Official.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select('name position createdAt')
        .lean()
    ])

    // Calculate total views (mock for now, you can implement view tracking)
    const totalViews = destinationsCount * 150 + villagesCount * 75

    // Format recent activity
    const recentActivity = [
      ...recentDestinations.map((dest: any) => ({
        type: 'destination',
        title: dest.title,
        date: new Date(dest.createdAt).toLocaleDateString('id-ID'),
        status: dest.status || 'draft'
      })),
      ...recentOfficials.map((official: any) => ({
        type: 'official',
        title: `${official.name} - ${official.position}`,
        date: new Date(official.createdAt).toLocaleDateString('id-ID'),
        status: 'published'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const stats = {
      destinations: destinationsCount,
      officials: officialsCount,
      villages: villagesCount,
      pages: pagesCount,
      gallery: galleryCount,
      totalViews,
      recentActivity
    }

    return NextResponse.json({ success: true, stats })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
