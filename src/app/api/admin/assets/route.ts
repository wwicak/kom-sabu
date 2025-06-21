import { NextRequest, NextResponse } from 'next/server'
import { Asset } from '@/lib/models'
import { withCSRF } from '@/lib/csrf'
import mongoose from 'mongoose'
import { z } from 'zod'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

// Validation schema for asset creation/update
const assetSchema = z.object({
  key: z.string().min(1).max(100),
  url: z.string().url(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  alt: z.string().max(200).optional(),
  type: z.enum(['image', 'video', 'document', 'audio']).default('image'),
  category: z.enum(['hero', 'landscape', 'culture', 'tourism', 'profile', 'logo', 'icon', 'background', 'gallery', 'content']).default('content'),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  order: z.number().default(0),
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

// GET /api/admin/assets - List all assets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build filter query
    const filter: any = {}
    if (category && category !== 'all') filter.category = category
    if (status && status !== 'all') filter.status = status
    if (type && type !== 'all') filter.type = type

    // Get assets with pagination
    const [assets, total] = await Promise.all([
      Asset.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Asset.countDocuments(filter)
    ])

    return NextResponse.json({
      success: true,
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

// POST /api/admin/assets - Create new asset
export async function POST(request: NextRequest) {
  return withCSRF(async () => {
    try {
      const body = await request.json()
      
      // Validate input
      const validatedData = assetSchema.parse(body)

      // Check if asset key already exists
      const existingAsset = await Asset.findOne({ key: validatedData.key })
      if (existingAsset) {
        return NextResponse.json(
          { success: false, message: 'Asset with this key already exists' },
          { status: 400 }
        )
      }

      // Create new asset
      const asset = await Asset.create(validatedData)

      return NextResponse.json({
        success: true,
        message: 'Asset created successfully',
        asset
      })

    } catch (error) {
      console.error('Error creating asset:', error)
      
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
        { success: false, message: 'Failed to create asset' },
        { status: 500 }
      )
    }
  })(request)
}

// PUT /api/admin/assets - Bulk update assets
export async function PUT(request: NextRequest) {
  return withCSRF(async () => {
    try {
      const body = await request.json()
      const { updates } = body

      if (!Array.isArray(updates)) {
        return NextResponse.json(
          { success: false, message: 'Updates must be an array' },
          { status: 400 }
        )
      }

      const results = []

      for (const update of updates) {
        const { _id, ...updateData } = update
        
        if (!_id) {
          results.push({ _id, success: false, error: 'Missing asset ID' })
          continue
        }

        try {
          const validatedData = assetSchema.partial().parse(updateData)
          
          const updatedAsset = await Asset.findByIdAndUpdate(
            _id,
            { ...validatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
          )

          if (!updatedAsset) {
            results.push({ _id, success: false, error: 'Asset not found' })
          } else {
            results.push({ _id, success: true, asset: updatedAsset })
          }
        } catch (error) {
          results.push({ 
            _id, 
            success: false, 
            error: error instanceof Error ? error.message : 'Update failed' 
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Bulk update completed',
        results
      })

    } catch (error) {
      console.error('Error bulk updating assets:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to update assets' },
        { status: 500 }
      )
    }
  })(request)
}

// DELETE /api/admin/assets - Bulk delete assets
export async function DELETE(request: NextRequest) {
  return withCSRF(async () => {
    try {
      const { searchParams } = new URL(request.url)
      const ids = searchParams.get('ids')?.split(',') || []

      if (ids.length === 0) {
        return NextResponse.json(
          { success: false, message: 'No asset IDs provided' },
          { status: 400 }
        )
      }

      // Validate all IDs are valid ObjectIds
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id))
      
      if (validIds.length !== ids.length) {
        return NextResponse.json(
          { success: false, message: 'Some asset IDs are invalid' },
          { status: 400 }
        )
      }

      // Delete assets
      const result = await Asset.deleteMany({
        _id: { $in: validIds }
      })

      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} asset(s) deleted successfully`,
        deletedCount: result.deletedCount
      })

    } catch (error) {
      console.error('Error deleting assets:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to delete assets' },
        { status: 500 }
      )
    }
  })(request)
}
