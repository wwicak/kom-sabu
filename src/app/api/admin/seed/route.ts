import { NextRequest, NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

// POST - Seed database with initial data
export async function POST(request: NextRequest) {
  try {
    // Only allow in development environment for security
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      )
    }

    await seedDatabase()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully'
    })

  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
