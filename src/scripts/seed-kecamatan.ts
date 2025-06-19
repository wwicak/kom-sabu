import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

import mongoose from 'mongoose'
import { Kecamatan } from '@/lib/models/kecamatan'
import { User } from '@/lib/models'
import { SABU_RAIJUA_KECAMATAN_DATA, createKecamatanData } from '@/lib/data/sabu-raijua-kecamatan'
import { connectToDatabase } from '@/lib/mongodb'

async function seedKecamatanData() {
  try {
    console.log('🌱 Starting kecamatan data seeding...')
    
    // Connect to database
    await connectToDatabase()
    console.log('✅ Connected to database')

    // Find or create a system user for seeding
    let systemUser = await User.findOne({ email: 'system@saburaijua.go.id' })
    
    if (!systemUser) {
      console.log('Creating system user for seeding...')
      systemUser = new User({
        name: 'System',
        email: 'system@saburaijua.go.id',
        password: 'system-user', // This won't be used for login
        role: 'super_admin',
        isActive: false // System user, not for login
      })
      await systemUser.save()
      console.log('✅ System user created')
    }

    // Clear existing kecamatan data for Sabu Raijua
    const deleteResult = await Kecamatan.deleteMany({ regencyCode: '5320' })
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing kecamatan records`)

    // Prepare kecamatan data with required fields
    const kecamatanToInsert = SABU_RAIJUA_KECAMATAN_DATA.map(data => 
      createKecamatanData(data, systemUser!._id.toString(), systemUser!._id.toString())
    )

    // Insert kecamatan data
    const insertedKecamatan = await Kecamatan.insertMany(kecamatanToInsert)
    console.log(`✅ Inserted ${insertedKecamatan.length} kecamatan records`)

    // Display summary
    console.log('\n📊 Seeding Summary:')
    console.log('==================')
    insertedKecamatan.forEach((kecamatan, index) => {
      console.log(`${index + 1}. ${kecamatan.name} (${kecamatan.code})`)
      console.log(`   - Population: ${kecamatan.demographics.totalPopulation.toLocaleString()} people`)
      console.log(`   - Area: ${kecamatan.area} km²`)
      console.log(`   - Villages: ${kecamatan.villages.length}`)
      console.log(`   - Capital: ${kecamatan.capital}`)
      console.log('')
    })

    console.log('🎉 Kecamatan data seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding kecamatan data:', error)
    throw error
  }
}

// Additional kecamatan data for the remaining 4 districts
const ADDITIONAL_KECAMATAN_DATA = [
  {
    name: 'Sabu Tengah',
    nameEnglish: 'Central Sabu',
    code: '5320030',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7500, -10.4800],
        [121.8100, -10.4800],
        [121.8100, -10.5400],
        [121.7500, -10.5400],
        [121.7500, -10.4800]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7800, -10.5100]
    },
    area: 42.3,
    capital: 'Rae Jua',
    villages: [
      { name: 'Rae Jua', type: 'kelurahan', population: 2500 },
      { name: 'Daiama', type: 'desa', population: 2000 },
      { name: 'Kelabba Maja', type: 'desa', population: 1800 }
    ],
    
    demographics: {
      totalPopulation: 11200,
      malePopulation: 5700,
      femalePopulation: 5500,
      households: 2800,
      populationDensity: 265,
      ageGroups: { under15: 3360, age15to64: 6720, over64: 1120 },
      education: { noEducation: 1344, elementary: 4480, juniorHigh: 2800, seniorHigh: 1904, university: 672 },
      religion: { christian: 10750, catholic: 300, islam: 100, hindu: 30, buddhist: 10, other: 10 },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Peternakan', 'Kerajinan'],
      employmentRate: 70.5,
      unemploymentRate: 8.5,
      povertyRate: 16.8,
      averageIncome: 2700000,
      economicSectors: { agriculture: 50, industry: 12, services: 38 },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 2200,
      riceFields: 250,
      dryFields: 1500,
      plantations: 450,
      mainCrops: [
        { name: 'Jagung', area: 750, production: 2250, productivity: 3.0 },
        { name: 'Sorgum', area: 400, production: 800, productivity: 2.0 },
        { name: 'Kacang Tanah', area: 300, production: 450, productivity: 1.5 }
      ],
      livestock: [
        { type: 'Sapi', count: 900 },
        { type: 'Kambing', count: 2000 },
        { type: 'Babi', count: 1200 },
        { type: 'Ayam', count: 10000 }
      ],
      fishery: { marineCapture: 200, aquaculture: 50 },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [{ type: 'Batu Kapur', reserves: 'Sedang', status: 'explored' }],
      forestArea: 350,
      coastalLength: 15,
      waterResources: [{ type: 'spring', name: 'Mata Air Rae Jua' }],
      renewableEnergy: [{ type: 'solar', potential: 'Tinggi', status: 'potential' }],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: { totalLength: 65, pavedRoads: 30, unpavedRoads: 35 },
      healthFacilities: { hospitals: 0, healthCenters: 1, clinics: 2, doctors: 1, nurses: 6 },
      education: { kindergartens: 5, elementarySchools: 8, juniorHighSchools: 2, seniorHighSchools: 1, universities: 0, teachers: 55 },
      utilities: { electricityAccess: 75, cleanWaterAccess: 60, internetAccess: 30, wasteManagement: false },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        { name: 'Bukit Kelabba Maja', type: 'natural', description: 'Bukit dengan pemandangan indah', coordinates: { type: 'Point', coordinates: [121.7850, -10.5050] } }
      ],
      accommodations: { hotels: 0, guesthouses: 2, homestays: 5 },
      annualVisitors: 800,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 3
  },
  
  {
    name: 'Sabu Liae',
    nameEnglish: 'Sabu Liae',
    code: '5320040',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7200, -10.4400],
        [121.7800, -10.4400],
        [121.7800, -10.5000],
        [121.7200, -10.5000],
        [121.7200, -10.4400]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7500, -10.4700]
    },
    area: 39.8,
    capital: 'Liae',
    villages: [
      { name: 'Liae', type: 'kelurahan', population: 2200 },
      { name: 'Daiama', type: 'desa', population: 1800 },
      { name: 'Mesara', type: 'desa', population: 1600 }
    ],
    
    demographics: {
      totalPopulation: 9800,
      malePopulation: 5000,
      femalePopulation: 4800,
      households: 2450,
      populationDensity: 246,
      ageGroups: { under15: 2940, age15to64: 5880, over64: 980 },
      education: { noEducation: 1176, elementary: 3920, juniorHigh: 2450, seniorHigh: 1666, university: 588 },
      religion: { christian: 9400, catholic: 250, islam: 100, hindu: 30, buddhist: 10, other: 10 },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Perikanan'],
      employmentRate: 69.2,
      unemploymentRate: 9.1,
      povertyRate: 19.5,
      averageIncome: 2500000,
      economicSectors: { agriculture: 60, industry: 8, services: 32 },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 2000,
      riceFields: 200,
      dryFields: 1400,
      plantations: 400,
      mainCrops: [
        { name: 'Jagung', area: 700, production: 2100, productivity: 3.0 },
        { name: 'Ubi Kayu', area: 350, production: 3500, productivity: 10.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 800 },
        { type: 'Kambing', count: 1800 },
        { type: 'Ayam', count: 8000 }
      ],
      fishery: { marineCapture: 600, aquaculture: 40 },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [{ type: 'Pasir', reserves: 'Sedang', status: 'exploited' }],
      forestArea: 280,
      coastalLength: 18,
      waterResources: [{ type: 'spring', name: 'Mata Air Liae' }],
      renewableEnergy: [{ type: 'wind', potential: 'Sedang', status: 'potential' }],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: { totalLength: 55, pavedRoads: 25, unpavedRoads: 30 },
      healthFacilities: { hospitals: 0, healthCenters: 1, clinics: 2, doctors: 1, nurses: 5 },
      education: { kindergartens: 4, elementarySchools: 7, juniorHighSchools: 1, seniorHighSchools: 1, universities: 0, teachers: 45 },
      utilities: { electricityAccess: 70, cleanWaterAccess: 55, internetAccess: 25, wasteManagement: false },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        { name: 'Pantai Mesara', type: 'beach', description: 'Pantai dengan sunset yang indah', coordinates: { type: 'Point', coordinates: [121.7400, -10.4600] } }
      ],
      accommodations: { hotels: 0, guesthouses: 1, homestays: 4 },
      annualVisitors: 600,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 4
  },
  
  {
    name: 'Hawu Mehara',
    nameEnglish: 'Hawu Mehara',
    code: '5320050',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6800, -10.5000],
        [121.7400, -10.5000],
        [121.7400, -10.5600],
        [121.6800, -10.5600],
        [121.6800, -10.5000]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7100, -10.5300]
    },
    area: 35.6,
    capital: 'Mehara',
    villages: [
      { name: 'Mehara', type: 'kelurahan', population: 1800 },
      { name: 'Hawu', type: 'desa', population: 1500 },
      { name: 'Namata', type: 'desa', population: 1200 }
    ],
    
    demographics: {
      totalPopulation: 8200,
      malePopulation: 4200,
      femalePopulation: 4000,
      households: 2050,
      populationDensity: 230,
      ageGroups: { under15: 2460, age15to64: 4920, over64: 820 },
      education: { noEducation: 984, elementary: 3280, juniorHigh: 2050, seniorHigh: 1394, university: 492 },
      religion: { christian: 7900, catholic: 200, islam: 70, hindu: 20, buddhist: 5, other: 5 },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Peternakan'],
      employmentRate: 67.8,
      unemploymentRate: 10.2,
      povertyRate: 22.1,
      averageIncome: 2300000,
      economicSectors: { agriculture: 65, industry: 5, services: 30 },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 1800,
      riceFields: 150,
      dryFields: 1300,
      plantations: 350,
      mainCrops: [
        { name: 'Jagung', area: 600, production: 1800, productivity: 3.0 },
        { name: 'Kacang Hijau', area: 300, production: 450, productivity: 1.5 }
      ],
      livestock: [
        { type: 'Sapi', count: 700 },
        { type: 'Kambing', count: 1500 },
        { type: 'Ayam', count: 7000 }
      ],
      fishery: { marineCapture: 300, aquaculture: 20 },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [{ type: 'Batu Kapur', reserves: 'Kecil', status: 'potential' }],
      forestArea: 220,
      coastalLength: 12,
      waterResources: [{ type: 'spring', name: 'Mata Air Mehara' }],
      renewableEnergy: [{ type: 'solar', potential: 'Sedang', status: 'potential' }],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: { totalLength: 45, pavedRoads: 20, unpavedRoads: 25 },
      healthFacilities: { hospitals: 0, healthCenters: 1, clinics: 1, doctors: 0, nurses: 4 },
      education: { kindergartens: 3, elementarySchools: 6, juniorHighSchools: 1, seniorHighSchools: 1, universities: 0, teachers: 38 },
      utilities: { electricityAccess: 65, cleanWaterAccess: 50, internetAccess: 20, wasteManagement: false },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        { name: 'Desa Adat Hawu', type: 'cultural', description: 'Desa dengan tradisi adat yang masih kental', coordinates: { type: 'Point', coordinates: [121.7050, -10.5250] } }
      ],
      accommodations: { hotels: 0, guesthouses: 1, homestays: 3 },
      annualVisitors: 400,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 5
  },
  
  {
    name: 'Raijua',
    nameEnglish: 'Raijua',
    code: '5320060',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6200, -10.4800],
        [121.6800, -10.4800],
        [121.6800, -10.5400],
        [121.6200, -10.5400],
        [121.6200, -10.4800]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.6500, -10.5100]
    },
    area: 32.1,
    capital: 'Namo',
    villages: [
      { name: 'Namo', type: 'kelurahan', population: 1500 },
      { name: 'Raijua', type: 'desa', population: 1200 },
      { name: 'Lede Ketita', type: 'desa', population: 1000 }
    ],
    
    demographics: {
      totalPopulation: 6800,
      malePopulation: 3500,
      femalePopulation: 3300,
      households: 1700,
      populationDensity: 212,
      ageGroups: { under15: 2040, age15to64: 4080, over64: 680 },
      education: { noEducation: 816, elementary: 2720, juniorHigh: 1700, seniorHigh: 1156, university: 408 },
      religion: { christian: 6550, catholic: 150, islam: 70, hindu: 20, buddhist: 5, other: 5 },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Perikanan', 'Pertanian', 'Kerajinan'],
      employmentRate: 65.5,
      unemploymentRate: 11.8,
      povertyRate: 25.3,
      averageIncome: 2200000,
      economicSectors: { agriculture: 40, industry: 15, services: 45 },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 1200,
      riceFields: 80,
      dryFields: 900,
      plantations: 220,
      mainCrops: [
        { name: 'Jagung', area: 400, production: 1200, productivity: 3.0 },
        { name: 'Ubi Jalar', area: 250, production: 2500, productivity: 10.0 }
      ],
      livestock: [
        { type: 'Kambing', count: 1200 },
        { type: 'Babi', count: 800 },
        { type: 'Ayam', count: 5000 }
      ],
      fishery: { marineCapture: 1200, aquaculture: 60 },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [{ type: 'Karang', reserves: 'Besar', status: 'potential' }],
      forestArea: 150,
      coastalLength: 28,
      waterResources: [{ type: 'spring', name: 'Mata Air Namo' }],
      renewableEnergy: [
        { type: 'wind', potential: 'Tinggi', status: 'potential' },
        { type: 'solar', potential: 'Tinggi', status: 'potential' }
      ],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: { totalLength: 35, pavedRoads: 15, unpavedRoads: 20 },
      healthFacilities: { hospitals: 0, healthCenters: 1, clinics: 1, doctors: 0, nurses: 3 },
      education: { kindergartens: 2, elementarySchools: 4, juniorHighSchools: 1, seniorHighSchools: 0, universities: 0, teachers: 25 },
      utilities: { electricityAccess: 60, cleanWaterAccess: 45, internetAccess: 15, wasteManagement: false },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        { name: 'Pantai Raijua', type: 'beach', description: 'Pantai terpencil dengan keindahan alam yang masih asli', coordinates: { type: 'Point', coordinates: [121.6450, -10.5050] } },
        { name: 'Lede Ketita', type: 'natural', description: 'Bukit suci dalam kepercayaan lokal', coordinates: { type: 'Point', coordinates: [121.6550, -10.5200] } }
      ],
      accommodations: { hotels: 0, guesthouses: 1, homestays: 2 },
      annualVisitors: 300,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 6
  }
]

// Enhanced seeding function with all 6 kecamatan
async function seedAllKecamatanData() {
  try {
    console.log('🌱 Starting complete kecamatan data seeding...')
    
    // Connect to database
    await connectToDatabase()
    console.log('✅ Connected to database')

    // Find or create a system user for seeding
    let systemUser = await User.findOne({ email: 'system@saburaijua.go.id' })
    
    if (!systemUser) {
      console.log('Creating system user for seeding...')
      systemUser = new User({
        name: 'System',
        email: 'system@saburaijua.go.id',
        password: 'system-user',
        role: 'super_admin',
        isActive: false
      })
      await systemUser.save()
      console.log('✅ System user created')
    }

    // Clear existing kecamatan data for Sabu Raijua
    const deleteResult = await Kecamatan.deleteMany({ regencyCode: '5320' })
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing kecamatan records`)

    // Combine all kecamatan data
    const allKecamatanData = [...SABU_RAIJUA_KECAMATAN_DATA, ...ADDITIONAL_KECAMATAN_DATA]
    
    // Prepare kecamatan data with required fields
    const kecamatanToInsert = allKecamatanData.map(data => 
      createKecamatanData(data, systemUser!._id.toString(), systemUser!._id.toString())
    )

    // Insert kecamatan data
    const insertedKecamatan = await Kecamatan.insertMany(kecamatanToInsert)
    console.log(`✅ Inserted ${insertedKecamatan.length} kecamatan records`)

    // Display summary
    console.log('\n📊 Complete Seeding Summary:')
    console.log('============================')
    insertedKecamatan.forEach((kecamatan, index) => {
      console.log(`${index + 1}. ${kecamatan.name} (${kecamatan.code})`)
      console.log(`   - Population: ${kecamatan.demographics.totalPopulation.toLocaleString()} people`)
      console.log(`   - Area: ${kecamatan.area} km²`)
      console.log(`   - Villages: ${kecamatan.villages.length}`)
      console.log(`   - Capital: ${kecamatan.capital}`)
      console.log('')
    })

    console.log('🎉 Complete kecamatan data seeding finished successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding kecamatan data:', error)
    throw error
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Database connection closed')
  }
}

// Run the seeder
if (require.main === module) {
  seedAllKecamatanData()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedKecamatanData, seedAllKecamatanData }
