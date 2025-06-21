import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, validateFile } from '@/lib/storage'
import { GalleryItem, AuditLog } from '@/lib/models'
import mongoose from 'mongoose'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

// Test upload endpoint without CSRF protection for testing
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test upload endpoint called')
    
    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string

    console.log('📁 File info:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    // Validate required fields
    if (!file || !title || !description || !category) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { success: false, message: 'Missing required fields: file, title, description, category' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      console.log('❌ File validation failed:', validation.error)
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed')

    // Validate category
    const allowedCategories = ['Pemerintahan', 'Pembangunan', 'Sosial', 'Budaya', 'Kesehatan', 'Pendidikan']
    if (!allowedCategories.includes(category)) {
      console.log('❌ Invalid category:', category)
      return NextResponse.json(
        { success: false, message: 'Invalid category' },
        { status: 400 }
      )
    }

    console.log('📤 Starting upload to R2...')

    // Upload to Cloudflare R2
    const uploadResult = await uploadImage(file, {
      optimize: true,
      createThumbnail: true,
      folder: 'test-gallery'
    })

    console.log('✅ Upload to R2 successful:', {
      originalUrl: uploadResult.original.url,
      thumbnailUrl: uploadResult.thumbnail?.url,
      metadata: uploadResult.metadata
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

        console.log('✅ Gallery item created:', savedGalleryItem[0]._id)

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
            title,
            testUpload: true
          },
          ipAddress: ip,
          userAgent,
        }], { session })

        console.log('✅ Audit log created')
      })
    } finally {
      await session.endSession()
    }

    console.log('🎉 Test upload completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Test upload completed successfully',
      data: {
        id: savedGalleryItem[0]._id,
        imageUrl: uploadResult.original.url,
        thumbnailUrl: uploadResult.thumbnail?.url,
        metadata: uploadResult.metadata
      }
    })

  } catch (error) {
    console.error('❌ Test upload error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
