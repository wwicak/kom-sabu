import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Kecamatan } from '@/lib/models/kecamatan'

// GET - Public endpoint for fetching a specific kecamatan by code
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await connectToDatabase()
    
    const kecamatan = await Kecamatan.findOne({ 
      code: params.code,
      status: 'active' 
    })
      .select('-createdBy -updatedBy -__v')
      .lean()

    if (!kecamatan) {
      return NextResponse.json(
        { error: 'Kecamatan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: kecamatan
    })

  } catch (error) {
    console.error('Get kecamatan error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch kecamatan' },
      { status: 500 }
    )
  }
}
