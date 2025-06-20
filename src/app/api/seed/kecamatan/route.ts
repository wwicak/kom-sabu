import { NextRequest, NextResponse } from 'next/server'
import { seedKecamatanData } from '@/scripts/seed-kecamatan'

// POST /api/seed/kecamatan - Seed kecamatan data (development only)
export async function POST() {
  // Only allow in development environment
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        success: false,
        error: 'Seeding is only allowed in development environment'
      },
      { status: 403 }
    )
  }

  try {
    const result = await seedKecamatanData()

    return NextResponse.json({
      success: true,
      message: `Successfully seeded kecamatan data`,
      data: result
    })
  } catch (error) {
    console.error('Error seeding kecamatan data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed kecamatan data'
      },
      { status: 500 }
    )
  }
}
