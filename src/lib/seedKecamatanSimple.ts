import mongoose from 'mongoose'
import { Kecamatan } from './models/kecamatan'
import { User } from './models'

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
  }
}

// Get or create system user for seeding
async function getSystemUser() {
  let systemUser = await User.findOne({ email: 'system@saburaijua.go.id' })
  
  if (!systemUser) {
    console.log('Creating system user for seeding...')
    systemUser = new User({
      username: 'system',
      email: 'system@saburaijua.go.id',
      password: 'system-user-not-for-login',
      fullName: 'System User',
      role: 'super_admin',
      isActive: false // System user, not for login
    })
    await systemUser.save()
    console.log('✅ System user created')
  }
  
  return systemUser._id
}

// Simplified kecamatan data that matches the schema requirements
const SIMPLE_KECAMATAN_DATA = [
  {
    name: 'Sabu Barat',
    nameEnglish: 'West Sabu',
    code: '5320010',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7200, -10.5200],
        [121.7800, -10.5200],
        [121.7800, -10.5800],
        [121.7200, -10.5800],
        [121.7200, -10.5200]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7500, -10.5500]
    },
    area: 76.8,
    capital: 'Menia',
    villages: [
      { name: 'Menia', type: 'kelurahan', population: 2500 },
      { name: 'Dimu', type: 'desa', population: 1200 },
      { name: 'Namosain', type: 'desa', population: 1100 }
    ],
    
    demographics: {
      totalPopulation: 18500,
      malePopulation: 9200,
      femalePopulation: 9300,
      households: 4200,
      populationDensity: 241,
      ageGroups: {
        under15: 5200,
        age15to64: 11800,
        over64: 1500
      },
      education: {
        noEducation: 1200,
        elementary: 8500,
        juniorHigh: 4200,
        seniorHigh: 3800,
        university: 800
      },
      religion: {
        christian: 15000,
        catholic: 2000,
        islam: 1200,
        hindu: 200,
        buddhist: 50,
        other: 50
      },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Perikanan', 'Perdagangan'],
      employmentRate: 85,
      unemploymentRate: 15,
      povertyRate: 12,
      averageIncome: 3500000,
      economicSectors: {
        agriculture: 45,
        industry: 25,
        services: 30
      },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 3200,
      riceFields: 800,
      dryFields: 1800,
      plantations: 600,
      mainCrops: [
        { name: 'Jagung', area: 1200, production: 2400, productivity: 2.0 },
        { name: 'Kacang Tanah', area: 600, production: 900, productivity: 1.5 }
      ],
      livestock: [
        { type: 'Sapi', count: 450 },
        { type: 'Kambing', count: 800 }
      ],
      fishery: {
        marineCapture: 180,
        aquaculture: 50
      },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', status: 'potential' }
      ],
      forestArea: 500,
      coastalLength: 25,
      waterResources: [
        { type: 'river', name: 'Sungai Menia' }
      ],
      renewableEnergy: [
        { type: 'solar', potential: 'Tinggi', status: 'potential' }
      ],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: {
        totalLength: 45,
        pavedRoads: 30,
        unpavedRoads: 15
      },
      healthFacilities: {
        hospitals: 1,
        healthCenters: 2,
        clinics: 3,
        doctors: 5,
        nurses: 12
      },
      education: {
        kindergartens: 8,
        elementarySchools: 15,
        juniorHighSchools: 4,
        seniorHighSchools: 3,
        universities: 1,
        teachers: 85
      },
      utilities: {
        electricityAccess: 90,
        cleanWaterAccess: 85,
        internetAccess: 65,
        wasteManagement: true
      },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        { name: 'Pantai Namosain', type: 'beach', description: 'Pantai indah dengan pasir putih' },
        { name: 'Pusat Kota Menia', type: 'cultural', description: 'Pusat pemerintahan kabupaten' }
      ],
      accommodations: {
        hotels: 2,
        guesthouses: 5,
        homestays: 8
      },
      annualVisitors: 4500,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 1
  },
  {
    name: 'Sabu Tengah',
    nameEnglish: 'Central Sabu',
    code: '5320020',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',

    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7600, -10.4600],
        [121.8800, -10.4600],
        [121.8800, -10.5600],
        [121.7600, -10.5600],
        [121.7600, -10.4600]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.8200, -10.5100]
    },
    area: 68.5,
    capital: 'Sabu Tengah',
    villages: [
      { name: 'Sabu Tengah', type: 'desa', population: 2200 },
      { name: 'Liae', type: 'desa', population: 1800 },
      { name: 'Bohela', type: 'desa', population: 1600 }
    ],

    demographics: {
      totalPopulation: 16200,
      malePopulation: 8100,
      femalePopulation: 8100,
      households: 3800,
      populationDensity: 236,
      ageGroups: {
        under15: 4500,
        age15to64: 10200,
        over64: 1500
      },
      education: {
        noEducation: 1100,
        elementary: 7500,
        juniorHigh: 3800,
        seniorHigh: 3200,
        university: 600
      },
      religion: {
        christian: 13000,
        catholic: 1800,
        islam: 1200,
        hindu: 150,
        buddhist: 30,
        other: 20
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Pertanian', 'Perdagangan', 'Kerajinan'],
      employmentRate: 82,
      unemploymentRate: 18,
      povertyRate: 15,
      averageIncome: 2800000,
      economicSectors: {
        agriculture: 55,
        industry: 20,
        services: 25
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 2800,
      riceFields: 1200,
      dryFields: 1200,
      plantations: 400,
      mainCrops: [
        { name: 'Padi', area: 1200, production: 3600, productivity: 3.0 },
        { name: 'Jagung', area: 800, production: 1600, productivity: 2.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 380 },
        { type: 'Kambing', count: 650 }
      ],
      fishery: {
        marineCapture: 120,
        aquaculture: 80
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Tanah Liat', status: 'exploited' }
      ],
      forestArea: 400,
      coastalLength: 18,
      waterResources: [
        { type: 'river', name: 'Sungai Tengah' }
      ],
      renewableEnergy: [
        { type: 'solar', potential: 'Sedang', status: 'potential' }
      ],
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 38,
        pavedRoads: 25,
        unpavedRoads: 13
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 2,
        doctors: 3,
        nurses: 8
      },
      education: {
        kindergartens: 6,
        elementarySchools: 12,
        juniorHighSchools: 3,
        seniorHighSchools: 2,
        universities: 0,
        teachers: 65
      },
      utilities: {
        electricityAccess: 85,
        cleanWaterAccess: 80,
        internetAccess: 55,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        { name: 'Situs Budaya Tradisional', type: 'cultural', description: 'Situs budaya dan tradisi lokal' },
        { name: 'Pasar Tradisional', type: 'cultural', description: 'Pasar tradisional dengan produk lokal' }
      ],
      accommodations: {
        hotels: 1,
        guesthouses: 3,
        homestays: 6
      },
      annualVisitors: 2800,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 2
  },
  {
    name: 'Raijua',
    nameEnglish: 'Raijua',
    code: '5320030',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',

    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6600, -10.6000],
        [121.7800, -10.6000],
        [121.7800, -10.7000],
        [121.6600, -10.7000],
        [121.6600, -10.6000]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7200, -10.6500]
    },
    area: 72.6,
    capital: 'Raijua',
    villages: [
      { name: 'Raijua', type: 'desa', population: 3000 },
      { name: 'Lela', type: 'desa', population: 2500 },
      { name: 'Namo', type: 'desa', population: 2200 }
    ],

    demographics: {
      totalPopulation: 17060,
      malePopulation: 8530,
      femalePopulation: 8530,
      households: 4000,
      populationDensity: 235,
      ageGroups: {
        under15: 4800,
        age15to64: 10800,
        over64: 1460
      },
      education: {
        noEducation: 1200,
        elementary: 8000,
        juniorHigh: 4000,
        seniorHigh: 3200,
        university: 660
      },
      religion: {
        christian: 14000,
        catholic: 2000,
        islam: 800,
        hindu: 200,
        buddhist: 40,
        other: 20
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Perikanan', 'Kerajinan', 'Pariwisata'],
      employmentRate: 88,
      unemploymentRate: 12,
      povertyRate: 10,
      averageIncome: 3100000,
      economicSectors: {
        agriculture: 30,
        industry: 35,
        services: 35
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 1800,
      riceFields: 200,
      dryFields: 1200,
      plantations: 400,
      mainCrops: [
        { name: 'Kelapa', area: 400, production: 800, productivity: 2.0 },
        { name: 'Jagung', area: 600, production: 900, productivity: 1.5 }
      ],
      livestock: [
        { type: 'Kambing', count: 500 },
        { type: 'Babi', count: 300 }
      ],
      fishery: {
        marineCapture: 280,
        aquaculture: 100
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Pasir Laut', status: 'potential' }
      ],
      forestArea: 300,
      coastalLength: 35,
      waterResources: [
        { type: 'spring', name: 'Mata Air Raijua' }
      ],
      renewableEnergy: [
        { type: 'wind', potential: 'Tinggi', status: 'potential' }
      ],
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 32,
        pavedRoads: 20,
        unpavedRoads: 12
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 1,
        doctors: 2,
        nurses: 6
      },
      education: {
        kindergartens: 4,
        elementarySchools: 8,
        juniorHighSchools: 2,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 45
      },
      utilities: {
        electricityAccess: 72,
        cleanWaterAccess: 65,
        internetAccess: 28,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        { name: 'Pantai Pasir Putih', type: 'beach', description: 'Pantai dengan pasir putih yang indah' },
        { name: 'Desa Adat', type: 'cultural', description: 'Desa dengan tradisi dan budaya unik' },
        { name: 'Tenun Tradisional', type: 'cultural', description: 'Kerajinan tenun tradisional Raijua' }
      ],
      accommodations: {
        hotels: 0,
        guesthouses: 2,
        homestays: 8
      },
      annualVisitors: 2500,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 3
  }
]

export async function seedSimpleKecamatanData() {
  try {
    console.log('🌱 Starting simple kecamatan data seeding...')
    
    // Connect to database
    await connectToDatabase()
    console.log('✅ Connected to database')

    // Get system user
    const systemUserId = await getSystemUser()
    console.log('✅ System user ready')

    // Clear existing kecamatan data
    const deleteResult = await Kecamatan.deleteMany({})
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing kecamatan records`)

    // Add system user IDs to the data
    const kecamatanDataWithUser = SIMPLE_KECAMATAN_DATA.map(data => ({
      ...data,
      createdBy: systemUserId,
      updatedBy: systemUserId
    }))

    // Insert new data
    const result = await Kecamatan.insertMany(kecamatanDataWithUser)
    console.log(`✅ Successfully seeded ${result.length} kecamatan records`)

    // Display summary
    console.log('\n📋 Seeded Kecamatan:')
    console.log('=' .repeat(50))
    result.forEach((kec, index) => {
      console.log(`${index + 1}. ${kec.name} (${kec.code})`)
      console.log(`   Capital: ${kec.capital}`)
      console.log(`   Population: ${kec.demographics.totalPopulation.toLocaleString()}`)
      console.log(`   Area: ${kec.area} km²`)
      console.log('')
    })

    return result
  } catch (error) {
    console.error('❌ Error seeding kecamatan data:', error)
    throw error
  }
}

// Run this function to seed the database
if (require.main === module) {
  seedSimpleKecamatanData()
    .then(() => {
      console.log('✅ Kecamatan seeding completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Kecamatan seeding failed:', error.message)
      process.exit(1)
    })
}
