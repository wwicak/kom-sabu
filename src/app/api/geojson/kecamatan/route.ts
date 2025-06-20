import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Helper functions to provide realistic data for each kecamatan
function getKecamatanArea(name: string): number {
  const areas: Record<string, number> = {
    'Sabu Barat': 89.5,
    'Sabu Tengah': 76.8,
    'Sabu Timur': 82.7,
    'Sabu Liae': 95.2,
    'Hawu Mehara': 78.9,
    'Raijua': 36.5
  }
  return areas[name] || 75.0
}

function getKecamatanPopulation(name: string): number {
  const populations: Record<string, number> = {
    'Sabu Barat': 18500,
    'Sabu Tengah': 15200,
    'Sabu Timur': 14800,
    'Sabu Liae': 16900,
    'Hawu Mehara': 13200,
    'Raijua': 8400
  }
  return populations[name] || 15000
}

function getKecamatanDemographics(name: string) {
  const population = getKecamatanPopulation(name)
  const area = getKecamatanArea(name)

  return {
    totalPopulation: population,
    malePopulation: Math.round(population * 0.51),
    femalePopulation: Math.round(population * 0.49),
    populationDensity: Math.round(population / area),
    ageGroups: {
      children: Math.round(population * 0.28),
      adults: Math.round(population * 0.65),
      elderly: Math.round(population * 0.07)
    },
    education: {
      elementary: Math.round(population * 0.35),
      junior: Math.round(population * 0.25),
      senior: Math.round(population * 0.20),
      higher: Math.round(population * 0.08)
    }
  }
}

function getKecamatanEconomy(name: string) {
  return {
    employmentRate: 68.5 + Math.random() * 10,
    averageIncome: 2500000 + Math.random() * 1000000,
    povertyRate: 8.2 + Math.random() * 5,
    mainSectors: ['Pertanian', 'Perikanan', 'Perdagangan']
  }
}

function getKecamatanAgriculture(name: string) {
  const area = getKecamatanArea(name)
  const agriculturalArea = Math.round(area * 0.6)

  return {
    totalAgriculturalArea: agriculturalArea,
    riceFields: Math.round(agriculturalArea * 0.15),
    dryFields: Math.round(agriculturalArea * 0.70),
    plantations: Math.round(agriculturalArea * 0.15),
    mainCrops: [
      { name: 'Jagung', area: Math.round(agriculturalArea * 0.4), production: Math.round(agriculturalArea * 0.4 * 3), productivity: 3.0 },
      { name: 'Ubi Kayu', area: Math.round(agriculturalArea * 0.2), production: Math.round(agriculturalArea * 0.2 * 10), productivity: 10.0 },
      { name: 'Kacang Hijau', area: Math.round(agriculturalArea * 0.15), production: Math.round(agriculturalArea * 0.15 * 1.5), productivity: 1.5 }
    ],
    livestock: [
      { type: 'Sapi', count: 600 + Math.round(Math.random() * 400) },
      { type: 'Kambing', count: 1200 + Math.round(Math.random() * 800) },
      { type: 'Ayam', count: 6000 + Math.round(Math.random() * 4000) }
    ],
    fishery: { marineCapture: 400 + Math.round(Math.random() * 300), aquaculture: 30 + Math.round(Math.random() * 20) },
    lastUpdated: new Date()
  }
}

function getKecamatanNaturalResources(name: string) {
  return {
    minerals: [
      { type: 'Pasir', reserves: 'Sedang', status: 'exploited' },
      { type: 'Batu Kapur', reserves: 'Kecil', status: 'potential' }
    ],
    forestArea: Math.round(getKecamatanArea(name) * 0.25),
    coastalLength: name === 'Raijua' ? 15 : 20 + Math.round(Math.random() * 10),
    waterResources: [{ type: 'spring', name: `Mata Air ${name}` }],
    renewableEnergy: [{ type: 'solar', potential: 'Sedang', status: 'potential' }],
    lastUpdated: new Date()
  }
}

function getKecamatanInfrastructure(name: string) {
  return {
    roads: {
      totalLength: 45 + Math.round(Math.random() * 30),
      pavedRoads: 25 + Math.round(Math.random() * 20),
      unpavedRoads: 20 + Math.round(Math.random() * 15)
    },
    utilities: {
      electricityAccess: 85 + Math.round(Math.random() * 10),
      cleanWaterAccess: 75 + Math.round(Math.random() * 15),
      internetAccess: 60 + Math.round(Math.random() * 20)
    },
    education: {
      elementarySchools: 8 + Math.round(Math.random() * 5),
      juniorHighSchools: 2 + Math.round(Math.random() * 2),
      seniorHighSchools: 1 + Math.round(Math.random() * 1)
    },
    health: {
      hospitals: name === 'Sabu Barat' ? 1 : 0,
      healthCenters: 1 + Math.round(Math.random() * 1),
      healthPosts: 3 + Math.round(Math.random() * 3)
    },
    lastUpdated: new Date()
  }
}

function getKecamatanTourism(name: string) {
  const attractions = {
    'Sabu Barat': [
      { name: 'Pantai Namosain', description: 'Pantai dengan pasir putih dan air jernih', type: 'Pantai' },
      { name: 'Desa Adat Menia', description: 'Desa tradisional dengan rumah adat', type: 'Budaya' }
    ],
    'Raijua': [
      { name: 'Pantai Raijua', description: 'Pantai eksotis di pulau kecil', type: 'Pantai' },
      { name: 'Bukit Raijua', description: 'Pemandangan sunset terbaik', type: 'Alam' }
    ]
  }

  return {
    attractions: attractions[name as keyof typeof attractions] || [
      { name: `Pantai ${name}`, description: 'Pantai indah dengan pemandangan menawan', type: 'Pantai' }
    ],
    annualVisitors: 1000 + Math.round(Math.random() * 2000),
    accommodations: Math.round(Math.random() * 5),
    lastUpdated: new Date()
  }
}

// GET /api/geojson/kecamatan - Serve kecamatan GeoJSON data
export async function GET(request: NextRequest) {
  try {
    // Path to the GeoJSON file
    const geoJsonPath = join(process.cwd(), 'geojson', '53.20_kecamatan.geojson')
    
    // Read the GeoJSON file
    const geoJsonData = await readFile(geoJsonPath, 'utf-8')
    const parsedData = JSON.parse(geoJsonData)
    
    // Transform the GeoJSON to match the expected format for the map components
    const transformedFeatures = parsedData.features.map((feature: any) => {
      const properties = feature.properties
      
      // Create a standardized kecamatan object
      const kecamatan = {
        _id: `kec_${properties.kd_kecamatan}`,
        name: properties.nm_kecamatan,
        slug: properties.nm_kecamatan.toLowerCase().replace(/\s+/g, '-'),
        code: properties.kd_kecamatan,
        regencyCode: properties.kd_dati2,
        provinceCode: properties.kd_propinsi,
        kode_kemendagri: properties.kode_kemendagri || `${properties.kd_propinsi}.${properties.kd_dati2}.${properties.kd_kecamatan}`,
        nama_lengkap: properties.nama_lengkap || `Kecamatan ${properties.nm_kecamatan}`,
        jumlah_kelurahan: properties.jumlah_kelurahan || 0,
        jumlah_desa: properties.jumlah_desa || 0,
        ibukota: properties.ibukota || '',
        pulau: properties.pulau || 'Sabu',
        description: `Kecamatan ${properties.nm_kecamatan} adalah salah satu kecamatan di Kabupaten Sabu Raijua, Provinsi Nusa Tenggara Timur.`,
        area: getKecamatanArea(properties.nm_kecamatan),
        population: getKecamatanPopulation(properties.nm_kecamatan),
        villages: properties.jumlah_desa || 0,
        capital: properties.ibukota || '',
        coordinates: {
          center: { lat: -10.4833, lng: 121.8267 }, // Default center, will be calculated from geometry
          bounds: {
            north: 0,
            south: 0,
            east: 0,
            west: 0
          }
        },
        geometry: feature.geometry,
        polygon: feature.geometry, // For backward compatibility
        potency: {},
        demographics: getKecamatanDemographics(properties.nm_kecamatan),
        economy: getKecamatanEconomy(properties.nm_kecamatan),
        agriculture: getKecamatanAgriculture(properties.nm_kecamatan),
        naturalResources: getKecamatanNaturalResources(properties.nm_kecamatan),
        infrastructure: getKecamatanInfrastructure(properties.nm_kecamatan),
        tourism: getKecamatanTourism(properties.nm_kecamatan),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Calculate center from geometry
      if (feature.geometry && feature.geometry.coordinates) {
        const coords = feature.geometry.type === 'Polygon' 
          ? feature.geometry.coordinates[0]
          : feature.geometry.coordinates[0][0]
        
        if (coords && coords.length > 0) {
          const lngs = coords.map((coord: number[]) => coord[0])
          const lats = coords.map((coord: number[]) => coord[1])
          
          const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
          const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
          
          kecamatan.coordinates.center = { lat: centerLat, lng: centerLng }
          kecamatan.coordinates.bounds = {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs)
          }
        }
      }
      
      return kecamatan
    })
    
    // Return in the expected API format
    return NextResponse.json({
      success: true,
      data: transformedFeatures,
      count: transformedFeatures.length,
      source: 'geojson_file',
      metadata: parsedData.metadata || {
        source: 'Badan Informasi Geospasial (BIG)',
        year: '2024',
        coordinate_system: 'WGS84',
        total_kecamatan: transformedFeatures.length,
        kabupaten: 'Sabu Raijua',
        provinsi: 'Nusa Tenggara Timur',
        kode_kabupaten: '53.20'
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    console.error('Error reading GeoJSON file:', error)
    
    // Return error response
    return NextResponse.json({
      success: false,
      error: 'Failed to load kecamatan GeoJSON data',
      details: (error as Error).message
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
