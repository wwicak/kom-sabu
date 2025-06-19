import { IKecamatan } from '@/lib/models/kecamatan'

// Mock data for testing the map component without database
export const MOCK_KECAMATAN_DATA: Partial<IKecamatan>[] = [
  {
    _id: '507f1f77bcf86cd799439011' as any,
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
    area: 45.2,
    
    capital: 'Menia',
    villages: [
      { name: 'Menia', type: 'kelurahan', population: 3500 },
      { name: 'Dimu', type: 'desa', population: 2800 },
      { name: 'Namata', type: 'desa', population: 2200 },
      { name: 'Ledeae', type: 'desa', population: 1900 }
    ],
    
    demographics: {
      totalPopulation: 15420,
      malePopulation: 7850,
      femalePopulation: 7570,
      households: 3855,
      populationDensity: 341,
      ageGroups: {
        under15: 4626,
        age15to64: 9252,
        over64: 1542
      },
      education: {
        noEducation: 1850,
        elementary: 6168,
        juniorHigh: 3855,
        seniorHigh: 2625,
        university: 922
      },
      religion: {
        christian: 14800,
        catholic: 420,
        islam: 150,
        hindu: 30,
        buddhist: 10,
        other: 10
      },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Perikanan', 'Perdagangan', 'Pemerintahan'],
      employmentRate: 68.5,
      unemploymentRate: 8.2,
      povertyRate: 15.3,
      averageIncome: 2800000,
      economicSectors: {
        agriculture: 45,
        industry: 15,
        services: 40
      },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 2850,
      riceFields: 450,
      dryFields: 1800,
      plantations: 600,
      mainCrops: [
        { name: 'Jagung', area: 800, production: 2400, productivity: 3.0 },
        { name: 'Padi', area: 450, production: 1800, productivity: 4.0 },
        { name: 'Kacang Tanah', area: 300, production: 450, productivity: 1.5 },
        { name: 'Kelapa', area: 400, production: 800, productivity: 2.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 1200 },
        { type: 'Kerbau', count: 800 },
        { type: 'Kambing', count: 2500 },
        { type: 'Babi', count: 1800 },
        { type: 'Ayam', count: 15000 }
      ],
      fishery: {
        marineCapture: 850,
        aquaculture: 120
      },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Sedang', status: 'explored' },
        { type: 'Pasir', reserves: 'Besar', status: 'exploited' }
      ],
      forestArea: 580,
      coastalLength: 25,
      waterResources: [
        { type: 'spring', name: 'Mata Air Menia', capacity: 50 },
        { type: 'reservoir', name: 'Bendungan Dimu', capacity: 150 }
      ],
      renewableEnergy: [
        { type: 'solar', potential: 'Tinggi', status: 'potential' },
        { type: 'wind', potential: 'Sedang', status: 'potential' }
      ],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: {
        totalLength: 85,
        pavedRoads: 45,
        unpavedRoads: 40
      },
      healthFacilities: {
        hospitals: 1,
        healthCenters: 2,
        clinics: 4,
        doctors: 3,
        nurses: 12
      },
      education: {
        kindergartens: 8,
        elementarySchools: 12,
        juniorHighSchools: 3,
        seniorHighSchools: 2,
        universities: 0,
        teachers: 85
      },
      utilities: {
        electricityAccess: 85,
        cleanWaterAccess: 70,
        internetAccess: 45,
        wasteManagement: true
      },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        {
          name: 'Pantai Menia',
          type: 'beach',
          description: 'Pantai indah dengan pasir putih dan air jernih',
          coordinates: { type: 'Point', coordinates: [121.7450, -10.5350] }
        },
        {
          name: 'Pasar Tradisional Menia',
          type: 'cultural',
          description: 'Pasar tradisional dengan kerajinan lokal dan makanan khas',
          coordinates: { type: 'Point', coordinates: [121.7500, -10.5500] }
        }
      ],
      accommodations: {
        hotels: 2,
        guesthouses: 5,
        homestays: 12
      },
      annualVisitors: 2500,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  },
  
  {
    _id: '507f1f77bcf86cd799439013' as any,
    name: 'Sabu Timur',
    nameEnglish: 'East Sabu',
    code: '5320020',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7800, -10.5200],
        [121.8400, -10.5200],
        [121.8400, -10.5800],
        [121.7800, -10.5800],
        [121.7800, -10.5200]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.8100, -10.5500]
    },
    area: 38.7,
    
    capital: 'Lobohede',
    villages: [
      { name: 'Lobohede', type: 'kelurahan', population: 2800 },
      { name: 'Raemadia', type: 'desa', population: 2200 },
      { name: 'Bohara', type: 'desa', population: 1900 },
      { name: 'Tadamanu', type: 'desa', population: 1600 }
    ],
    
    demographics: {
      totalPopulation: 12850,
      malePopulation: 6550,
      femalePopulation: 6300,
      households: 3213,
      populationDensity: 332,
      ageGroups: {
        under15: 3855,
        age15to64: 7710,
        over64: 1285
      },
      education: {
        noEducation: 1542,
        elementary: 5140,
        juniorHigh: 3213,
        seniorHigh: 2184,
        university: 771
      },
      religion: {
        christian: 12350,
        catholic: 350,
        islam: 100,
        hindu: 30,
        buddhist: 10,
        other: 10
      },
      lastUpdated: new Date()
    },
    
    economy: {
      mainIndustries: ['Pertanian', 'Perikanan', 'Kerajinan'],
      employmentRate: 72.3,
      unemploymentRate: 7.8,
      povertyRate: 18.2,
      averageIncome: 2600000,
      economicSectors: {
        agriculture: 55,
        industry: 10,
        services: 35
      },
      lastUpdated: new Date()
    },
    
    agriculture: {
      totalAgriculturalArea: 2400,
      riceFields: 300,
      dryFields: 1600,
      plantations: 500,
      mainCrops: [
        { name: 'Jagung', area: 900, production: 2700, productivity: 3.0 },
        { name: 'Kacang Hijau', area: 400, production: 600, productivity: 1.5 },
        { name: 'Ubi Kayu', area: 350, production: 3500, productivity: 10.0 },
        { name: 'Kelapa', area: 350, production: 700, productivity: 2.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 1000 },
        { type: 'Kerbau', count: 600 },
        { type: 'Kambing', count: 2200 },
        { type: 'Babi', count: 1500 },
        { type: 'Ayam', count: 12000 }
      ],
      fishery: {
        marineCapture: 950,
        aquaculture: 80
      },
      lastUpdated: new Date()
    },
    
    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Besar', status: 'explored' },
        { type: 'Kerikil', reserves: 'Sedang', status: 'exploited' }
      ],
      forestArea: 420,
      coastalLength: 22,
      waterResources: [
        { type: 'spring', name: 'Mata Air Lobohede' },
        { type: 'river', name: 'Sungai Raemadia' }
      ],
      renewableEnergy: [
        { type: 'solar', potential: 'Tinggi', status: 'potential' },
        { type: 'wind', potential: 'Tinggi', status: 'potential' }
      ],
      lastUpdated: new Date()
    },
    
    infrastructure: {
      roads: {
        totalLength: 72,
        pavedRoads: 35,
        unpavedRoads: 37
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 3,
        doctors: 1,
        nurses: 8
      },
      education: {
        kindergartens: 6,
        elementarySchools: 10,
        juniorHighSchools: 2,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 68
      },
      utilities: {
        electricityAccess: 78,
        cleanWaterAccess: 65,
        internetAccess: 35,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },
    
    tourism: {
      attractions: [
        {
          name: 'Pantai Lobohede',
          type: 'beach',
          description: 'Pantai dengan pemandangan matahari terbit yang indah',
          coordinates: { type: 'Point', coordinates: [121.8150, -10.5350] }
        },
        {
          name: 'Desa Wisata Raemadia',
          type: 'cultural',
          description: 'Desa dengan tradisi tenun ikat khas Sabu',
          coordinates: { type: 'Point', coordinates: [121.8050, -10.5650] }
        }
      ],
      accommodations: {
        hotels: 1,
        guesthouses: 3,
        homestays: 8
      },
      annualVisitors: 1800,
      lastUpdated: new Date()
    },
    
    isActive: true,
    displayOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  }
]
