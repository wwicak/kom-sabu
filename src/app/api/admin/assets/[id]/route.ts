import { NextRequest, NextResponse } from 'next/server'
import { Asset } from '@/lib/models'
import { withCSRF } from '@/lib/csrf'
import mongoose from 'mongoose'
import { z } from 'zod'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

// Validation schema for asset update
const assetUpdateSchema = z.object({
  key: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  alt: z.string().max(200).optional(),
  type: z.enum(['image', 'video', 'document', 'audio']).optional(),
  category: z.enum(['hero', 'landscape', 'culture', 'tourism', 'profile', 'logo', 'icon', 'background', 'gallery', 'content']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  order: z.number().optional(),
  metadata: z.object({
    fileSize: z.number().optional(),
    dimensions: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    format: z.string().optional(),
    originalName: z.string().optional()
  }).optional()
})

// GET /api/admin/assets/[id] - Get single asset
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid asset ID' },
        { status: 400 }
      )
    }

    const asset = await Asset.findById(id)

    if (!asset) {
      return NextResponse.json(
        { success: false, message: 'Asset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      asset
    })

  } catch (error) {
    console.error('Error fetching asset:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch asset' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/assets/[id] - Update single asset
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withCSRF(async () => {
    try {
      const { id } = await params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: 'Invalid asset ID' },
          { status: 400 }
        )
      }

      const body = await request.json()
      
      // Validate input
      const validatedData = assetUpdateSchema.parse(body)

      // Check if key is being updated and if it conflicts with existing asset
      if (validatedData.key) {
        const existingAsset = await Asset.findOne({ 
          key: validatedData.key,
          _id: { $ne: id }
        })
        
        if (existingAsset) {
          return NextResponse.json(
            { success: false, message: 'Asset with this key already exists' },
            { status: 400 }
          )
        }
      }

      // Update asset
      const updatedAsset = await Asset.findByIdAndUpdate(
        id,
        { ...validatedData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )

      if (!updatedAsset) {
        return NextResponse.json(
          { success: false, message: 'Asset not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Asset updated successfully',
        asset: updatedAsset
      })

    } catch (error) {
      console.error('Error updating asset:', error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Validation error',
            errors: error.errors
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { success: false, message: 'Failed to update asset' },
        { status: 500 }
      )
    }
  })(request)
}

// DELETE /api/admin/assets/[id] - Delete single asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withCSRF(async () => {
    try {
      const { id } = await params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, message: 'Invalid asset ID' },
          { status: 400 }
        )
      }

      const deletedAsset = await Asset.findByIdAndDelete(id)

      if (!deletedAsset) {
        return NextResponse.json(
          { success: false, message: 'Asset not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Asset deleted successfully',
        asset: deletedAsset
      })

    } catch (error) {
      console.error('Error deleting asset:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete asset' },
        { status: 500 }
      )
    }
  })(request)
}
