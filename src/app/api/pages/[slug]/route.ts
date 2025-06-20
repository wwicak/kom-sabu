import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Page } from '@/lib/models/content'

// GET - Get page content by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectToDatabase()

    const { slug } = await params
    const page = await Page.findOne({
      slug,
      status: 'published'
    })
    .select('-createdBy -updatedBy -__v') // Exclude sensitive fields
    .lean()

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: page
    })

  } catch (error) {
    console.error('Get page error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}
