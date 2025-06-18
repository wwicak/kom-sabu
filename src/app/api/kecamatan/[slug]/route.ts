import { NextRequest, NextResponse } from 'next/server'
import { Kecamatan } from '@/lib/models'
import { z } from 'zod'
import mongoose from 'mongoose'

// Ensure mongoose connection
async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }
}

// GET /api/kecamatan/[slug] - Get specific kecamatan data
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToMongoDB()
    
    const kecamatan = await Kecamatan.findOne({ 
      slug: params.slug,
      isActive: true 
    })
      .select('-__v')
      .lean()
    
    if (!kecamatan) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kecamatan not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: kecamatan
    })
  } catch (error) {
    console.error('Error fetching kecamatan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch kecamatan data' 
      },
      { status: 500 }
    )
  }
}

// PUT /api/kecamatan/[slug] - Update kecamatan data (admin only)
const updateKecamatanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  area: z.number().positive().optional(),
  population: z.number().int().positive().optional(),
  villages: z.number().int().positive().optional(),
  coordinates: z.object({
    center: z.object({
      lat: z.number(),
      lng: z.number()
    }),
    bounds: z.object({
      north: z.number(),
      south: z.number(),
      east: z.number(),
      west: z.number()
    }).optional()
  }).optional(),
  polygon: z.object({
    type: z.enum(['Polygon', 'MultiPolygon']),
    coordinates: z.array(z.array(z.array(z.number())))
  }).optional(),
  potency: z.object({
    agriculture: z.object({
      mainCrops: z.array(z.string()),
      productivity: z.string(),
      farmingArea: z.number()
    }).optional(),
    fishery: z.object({
      mainSpecies: z.array(z.string()),
      productivity: z.string(),
      fishingArea: z.number()
    }).optional(),
    tourism: z.object({
      attractions: z.array(z.string()),
      facilities: z.array(z.string()),
      annualVisitors: z.number()
    }).optional(),
    economy: z.object({
      mainSectors: z.array(z.string()),
      averageIncome: z.number(),
      businessUnits: z.number()
    }).optional(),
    infrastructure: z.object({
      roads: z.string(),
      electricity: z.number(),
      water: z.number(),
      internet: z.number()
    }).optional()
  }).optional(),
  demographics: z.object({
    ageGroups: z.object({
      children: z.number(),
      adults: z.number(),
      elderly: z.number()
    }),
    education: z.object({
      elementary: z.number(),
      junior: z.number(),
      senior: z.number(),
      higher: z.number()
    }),
    occupation: z.object({
      agriculture: z.number(),
      fishery: z.number(),
      trade: z.number(),
      services: z.number(),
      others: z.number()
    })
  }).optional(),
  images: z.array(z.object({
    url: z.string(),
    caption: z.string(),
    category: z.enum(['landscape', 'culture', 'economy', 'infrastructure', 'tourism'])
  })).optional(),
  headOffice: z.object({
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    head: z.string()
  }).optional(),
  isActive: z.boolean().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToMongoDB()
    
    const body = await request.json()
    const validatedData = updateKecamatanSchema.parse(body)
    
    const updatedKecamatan = await Kecamatan.findOneAndUpdate(
      { slug: params.slug },
      { 
        ...validatedData,
        lastUpdated: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v')
    
    if (!updatedKecamatan) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kecamatan not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedKecamatan
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    console.error('Error updating kecamatan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update kecamatan' 
      },
      { status: 500 }
    )
  }
}

// DELETE /api/kecamatan/[slug] - Soft delete kecamatan (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToMongoDB()
    
    const updatedKecamatan = await Kecamatan.findOneAndUpdate(
      { slug: params.slug },
      { 
        isActive: false,
        lastUpdated: new Date()
      },
      { new: true }
    )
    
    if (!updatedKecamatan) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kecamatan not found' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Kecamatan deactivated successfully'
    })
  } catch (error) {
    console.error('Error deactivating kecamatan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to deactivate kecamatan' 
      },
      { status: 500 }
    )
  }
}
