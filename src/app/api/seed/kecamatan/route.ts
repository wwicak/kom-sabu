import { NextRequest, NextResponse } from 'next/server'
import { seedKecamatanData } from '@/lib/seedKecamatan'

// POST /api/seed/kecamatan - Seed kecamatan data (development only)
export async function POST(request: NextRequest) {
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
      message: `Successfully seeded ${result.length} kecamatan records`,
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
