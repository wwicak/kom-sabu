import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Kecamatan } from '@/lib/models'
import { z } from 'zod'

// GET /api/kecamatan - Get all kecamatan data
export async function GET(request: NextRequest) {
  try {
    // Ensure database connection
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const filter = includeInactive ? {} : { isActive: true }

    // Add timeout and error handling
    const kecamatanData = await Promise.race([
      Kecamatan.find(filter)
        .select('-__v')
        .sort({ name: 1 })
        .lean()
        .exec(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      )
    ])

    return NextResponse.json({
      success: true,
      data: kecamatanData
    })
  } catch (error) {
    console.error('Error fetching kecamatan data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch kecamatan data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/kecamatan - Create new kecamatan (admin only)
const createKecamatanSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  area: z.number().positive(),
  population: z.number().int().positive(),
  villages: z.number().int().positive(),
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
  }),
  polygon: z.object({
    type: z.enum(['Polygon', 'MultiPolygon']),
    coordinates: z.array(z.array(z.array(z.number())))
  }),
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
  }),
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
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const validatedData = createKecamatanSchema.parse(body)
    
    // Check if slug already exists
    const existingKecamatan = await Kecamatan.findOne({ slug: validatedData.slug })
    if (existingKecamatan) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Kecamatan with this slug already exists' 
        },
        { status: 400 }
      )
    }
    
    const newKecamatan = new Kecamatan(validatedData)
    await newKecamatan.save()
    
    return NextResponse.json({
      success: true,
      data: newKecamatan
    }, { status: 201 })
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
    
    console.error('Error creating kecamatan:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create kecamatan' 
      },
      { status: 500 }
    )
  }
}
