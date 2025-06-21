import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ContactForm } from '@/lib/models'
import { verifyAdminAuth } from '@/lib/auth'

// GET - List all contact messages with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build filter query
    const filter: any = {}
    
    if (status && status !== 'all') {
      filter.status = status
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ]
    }

    // Build sort query
    let sortQuery: any = { createdAt: -1 } // Default: newest first
    
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'name':
        sortQuery = { name: 1 }
        break
      case 'status':
        sortQuery = { status: 1, createdAt: -1 }
        break
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get contacts with pagination
    const contacts = await ContactForm.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .select('-submissionToken -ipAddress -userAgent') // Exclude sensitive fields
      .lean()

    // Get total count for pagination
    const total = await ContactForm.countDocuments(filter)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    })

  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// PATCH - Update contact status
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const body = await request.json()
    const { ids, status } = body

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Contact IDs are required' },
        { status: 400 }
      )
    }

    if (!status || !['pending', 'read', 'replied', 'archived'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      )
    }

    // Update contacts
    const result = await ContactForm.updateMany(
      { _id: { $in: ids } },
      { 
        status,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} contact(s) updated successfully`
      }
    })

  } catch (error) {
    console.error('Update contacts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contacts' },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact messages
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',')

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { error: 'Contact IDs are required' },
        { status: 400 }
      )
    }

    // Delete contacts
    const result = await ContactForm.deleteMany({
      _id: { $in: ids }
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} contact(s) deleted successfully`
      }
    })

  } catch (error) {
    console.error('Delete contacts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contacts' },
      { status: 500 }
    )
  }
}
