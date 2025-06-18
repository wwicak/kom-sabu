import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, validateFile } from '@/lib/storage'
import { GalleryItem, AuditLog } from '@/lib/models'
import mongoose from 'mongoose'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

export async function POST(request: NextRequest) {
  try {
    // Get client information
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Check content type
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content type must be multipart/form-data' },
        { status: 400 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and category are required' },
        { status: 400 }
      )
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.isValid) {
      return NextResponse.json(
        { success: false, message: fileValidation.error },
        { status: 400 }
      )
    }

    // Validate category
    const allowedCategories = ['Pemerintahan', 'Pembangunan', 'Sosial', 'Budaya', 'Kesehatan', 'Pendidikan']
    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category' },
        { status: 400 }
      )
    }

    // Upload to Cloudflare R2
    const uploadResult = await uploadImage(file, {
      optimize: true,
      createThumbnail: true,
      folder: 'gallery'
    })

    // Save to MongoDB
    const session = await mongoose.startSession()
    let savedGalleryItem

    try {
      await session.withTransaction(async () => {
        // Create gallery item
        savedGalleryItem = await GalleryItem.create([{
          title: title.trim(),
          description: description.trim(),
          imageUrl: uploadResult.original.url,
          thumbnailUrl: uploadResult.thumbnail?.url,
          category,
          isPublished: false, // Require manual approval
          metadata: {
            fileSize: uploadResult.metadata.originalSize,
            dimensions: uploadResult.metadata.dimensions,
            format: file.type
          }
        }], { session })

        // Log the upload for audit
        await AuditLog.create([{
          action: 'FILE_UPLOADED',
          resource: 'gallery_item',
          resourceId: savedGalleryItem[0]._id.toString(),
          details: {
            filename: file.name,
            fileSize: file.size,
            fileType: file.type,
            category,
            title
          },
          ipAddress: ip,
          userAgent,
        }], { session })
      })
    } finally {
      await session.endSession()
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully and pending approval',
      data: {
        id: savedGalleryItem[0]._id,
        title,
        imageUrl: uploadResult.original.url,
        thumbnailUrl: uploadResult.thumbnail?.url,
        category,
        isPublished: false
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Log the error
    try {
      await AuditLog.create({
        action: 'FILE_UPLOAD_ERROR',
        resource: 'gallery_item',
        details: { 
          error: error.message,
          stack: error.stack 
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to upload file'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}
