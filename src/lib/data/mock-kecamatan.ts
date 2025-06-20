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
  },

  // Sabu Timur
  {
    _id: '507f1f77bcf86cd799439013' as any,
    name: 'Sabu Timur',
    nameEnglish: 'East Sabu',
    code: '5320030',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',

    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.8200, -10.5200],
        [121.8800, -10.5200],
        [121.8800, -10.5800],
        [121.8200, -10.5800],
        [121.8200, -10.5200]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.8500, -10.5500]
    },

    area: 45.2,
    population: 11500,
    villages: 15,

    demographics: {
      totalPopulation: 11500,
      malePopulation: 5800,
      femalePopulation: 5700,
      households: 2875,
      populationDensity: 254,
      ageGroups: {
        under15: 3450,
        age15to64: 6900,
        over64: 1150
      },
      education: {
        noEducation: 1380,
        elementary: 4600,
        juniorHigh: 2875,
        seniorHigh: 1955,
        university: 690
      },
      religion: {
        christian: 11040,
        catholic: 315,
        islam: 90,
        hindu: 35,
        buddhist: 15,
        other: 5
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Pertanian', 'Perikanan', 'Pariwisata'],
      employmentRate: 74.1,
      unemploymentRate: 7.2,
      povertyRate: 16.8,
      averageIncome: 2750000,
      economicSectors: {
        agriculture: 52,
        industry: 12,
        services: 36
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 2200,
      riceFields: 280,
      dryFields: 1500,
      plantations: 420,
      mainCrops: [
        { name: 'Jagung', area: 850, production: 2550, productivity: 3.0 },
        { name: 'Kacang Tanah', area: 380, production: 570, productivity: 1.5 },
        { name: 'Ubi Kayu', area: 320, production: 3200, productivity: 10.0 },
        { name: 'Kelapa', area: 320, production: 640, productivity: 2.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 950 },
        { type: 'Kerbau', count: 580 },
        { type: 'Kambing', count: 2100 },
        { type: 'Babi', count: 1400 },
        { type: 'Ayam', count: 11500 }
      ],
      fishery: {
        marineCapture: 920,
        aquaculture: 75
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Sedang', status: 'Aktif' },
        { type: 'Pasir', reserves: 'Besar', status: 'Aktif' }
      ],
      forestry: {
        forestArea: 850,
        protectedForest: 320,
        productionForest: 530
      },
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 78,
        pavedRoads: 42,
        unpavedRoads: 36
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 3,
        doctors: 2,
        nurses: 9
      },
      education: {
        kindergartens: 7,
        elementarySchools: 11,
        juniorHighSchools: 2,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 72
      },
      utilities: {
        electricityAccess: 82,
        cleanWaterAccess: 68,
        internetAccess: 38,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        {
          name: 'Pantai Namosain',
          type: 'beach',
          description: 'Pantai dengan terumbu karang yang indah',
          coordinates: { type: 'Point', coordinates: [121.8450, -10.5350] }
        }
      ],
      accommodations: {
        hotels: 1,
        guesthouses: 2,
        homestays: 6
      },
      annualVisitors: 1500,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  },

  // Sabu Liae
  {
    _id: '507f1f77bcf86cd799439014' as any,
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
        [121.7500, -10.4500],
        [121.8100, -10.4500],
        [121.8100, -10.5100],
        [121.7500, -10.5100],
        [121.7500, -10.4500]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7800, -10.4800]
    },

    area: 38.5,
    population: 9800,
    villages: 12,

    demographics: {
      totalPopulation: 9800,
      malePopulation: 4950,
      femalePopulation: 4850,
      households: 2450,
      populationDensity: 254,
      ageGroups: {
        under15: 2940,
        age15to64: 5880,
        over64: 980
      },
      education: {
        noEducation: 1176,
        elementary: 3920,
        juniorHigh: 2450,
        seniorHigh: 1666,
        university: 588
      },
      religion: {
        christian: 9408,
        catholic: 294,
        islam: 68,
        hindu: 20,
        buddhist: 8,
        other: 2
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Pertanian', 'Perikanan'],
      employmentRate: 71.5,
      unemploymentRate: 8.1,
      povertyRate: 19.5,
      averageIncome: 2450000,
      economicSectors: {
        agriculture: 58,
        industry: 8,
        services: 34
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 1850,
      riceFields: 220,
      dryFields: 1280,
      plantations: 350,
      mainCrops: [
        { name: 'Jagung', area: 720, production: 2160, productivity: 3.0 },
        { name: 'Kacang Hijau', area: 320, production: 480, productivity: 1.5 },
        { name: 'Ubi Kayu', area: 280, production: 2800, productivity: 10.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 800 },
        { type: 'Kerbau', count: 480 },
        { type: 'Kambing', count: 1800 },
        { type: 'Babi', count: 1200 },
        { type: 'Ayam', count: 9800 }
      ],
      fishery: {
        marineCapture: 780,
        aquaculture: 60
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Kecil', status: 'Aktif' }
      ],
      forestry: {
        forestArea: 720,
        protectedForest: 280,
        productionForest: 440
      },
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 65,
        pavedRoads: 32,
        unpavedRoads: 33
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 2,
        doctors: 1,
        nurses: 6
      },
      education: {
        kindergartens: 5,
        elementarySchools: 9,
        juniorHighSchools: 2,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 58
      },
      utilities: {
        electricityAccess: 75,
        cleanWaterAccess: 62,
        internetAccess: 32,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        {
          name: 'Desa Adat Liae',
          type: 'cultural',
          description: 'Desa dengan tradisi budaya Hawu yang masih kental',
          coordinates: { type: 'Point', coordinates: [121.7800, -10.4800] }
        }
      ],
      accommodations: {
        hotels: 0,
        guesthouses: 1,
        homestays: 4
      },
      annualVisitors: 800,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  },

  // Hawu Mehara
  {
    _id: '507f1f77bcf86cd799439015' as any,
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
        [121.6800, -10.4200],
        [121.7400, -10.4200],
        [121.7400, -10.4800],
        [121.6800, -10.4800],
        [121.6800, -10.4200]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7100, -10.4500]
    },

    area: 32.8,
    population: 8500,
    villages: 10,

    demographics: {
      totalPopulation: 8500,
      malePopulation: 4300,
      femalePopulation: 4200,
      households: 2125,
      populationDensity: 259,
      ageGroups: {
        under15: 2550,
        age15to64: 5100,
        over64: 850
      },
      education: {
        noEducation: 1020,
        elementary: 3400,
        juniorHigh: 2125,
        seniorHigh: 1445,
        university: 510
      },
      religion: {
        christian: 8160,
        catholic: 255,
        islam: 59,
        hindu: 17,
        buddhist: 7,
        other: 2
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Pertanian', 'Perikanan'],
      employmentRate: 69.8,
      unemploymentRate: 8.5,
      povertyRate: 21.2,
      averageIncome: 2300000,
      economicSectors: {
        agriculture: 62,
        industry: 6,
        services: 32
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 1600,
      riceFields: 180,
      dryFields: 1120,
      plantations: 300,
      mainCrops: [
        { name: 'Jagung', area: 640, production: 1920, productivity: 3.0 },
        { name: 'Kacang Hijau', area: 280, production: 420, productivity: 1.5 },
        { name: 'Ubi Kayu', area: 240, production: 2400, productivity: 10.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 680 },
        { type: 'Kerbau', count: 410 },
        { type: 'Kambing', count: 1530 },
        { type: 'Babi', count: 1020 },
        { type: 'Ayam', count: 8500 }
      ],
      fishery: {
        marineCapture: 680,
        aquaculture: 50
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Kecil', status: 'Aktif' }
      ],
      forestry: {
        forestArea: 620,
        protectedForest: 240,
        productionForest: 380
      },
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 55,
        pavedRoads: 25,
        unpavedRoads: 30
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 2,
        doctors: 1,
        nurses: 5
      },
      education: {
        kindergartens: 4,
        elementarySchools: 7,
        juniorHighSchools: 1,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 48
      },
      utilities: {
        electricityAccess: 68,
        cleanWaterAccess: 55,
        internetAccess: 28,
        wasteManagement: false
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        {
          name: 'Pantai Mehara',
          type: 'beach',
          description: 'Pantai dengan pemandangan sunset yang menakjubkan',
          coordinates: { type: 'Point', coordinates: [121.7100, -10.4300] }
        }
      ],
      accommodations: {
        hotels: 0,
        guesthouses: 1,
        homestays: 3
      },
      annualVisitors: 600,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  },

  // Raijua
  {
    _id: '507f1f77bcf86cd799439016' as any,
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
        [121.6200, -10.3800],
        [121.6800, -10.3800],
        [121.6800, -10.4400],
        [121.6200, -10.4400],
        [121.6200, -10.3800]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.6500, -10.4100]
    },

    area: 36.2,
    population: 7200,
    villages: 8,

    demographics: {
      totalPopulation: 7200,
      malePopulation: 3650,
      femalePopulation: 3550,
      households: 1800,
      populationDensity: 199,
      ageGroups: {
        under15: 2160,
        age15to64: 4320,
        over64: 720
      },
      education: {
        noEducation: 864,
        elementary: 2880,
        juniorHigh: 1800,
        seniorHigh: 1224,
        university: 432
      },
      religion: {
        christian: 6912,
        catholic: 216,
        islam: 50,
        hindu: 14,
        buddhist: 6,
        other: 2
      },
      lastUpdated: new Date()
    },

    economy: {
      mainIndustries: ['Pertanian', 'Perikanan', 'Pariwisata'],
      employmentRate: 73.2,
      unemploymentRate: 7.8,
      povertyRate: 17.5,
      averageIncome: 2650000,
      economicSectors: {
        agriculture: 48,
        industry: 8,
        services: 44
      },
      lastUpdated: new Date()
    },

    agriculture: {
      totalAgriculturalArea: 1400,
      riceFields: 150,
      dryFields: 980,
      plantations: 270,
      mainCrops: [
        { name: 'Jagung', area: 560, production: 1680, productivity: 3.0 },
        { name: 'Kacang Tanah', area: 240, production: 360, productivity: 1.5 },
        { name: 'Kelapa', area: 200, production: 400, productivity: 2.0 }
      ],
      livestock: [
        { type: 'Sapi', count: 580 },
        { type: 'Kerbau', count: 350 },
        { type: 'Kambing', count: 1300 },
        { type: 'Babi', count: 870 },
        { type: 'Ayam', count: 7200 }
      ],
      fishery: {
        marineCapture: 1200,
        aquaculture: 80
      },
      lastUpdated: new Date()
    },

    naturalResources: {
      minerals: [
        { type: 'Batu Kapur', reserves: 'Sedang', status: 'Aktif' },
        { type: 'Pasir Laut', reserves: 'Besar', status: 'Aktif' }
      ],
      forestry: {
        forestArea: 540,
        protectedForest: 200,
        productionForest: 340
      },
      lastUpdated: new Date()
    },

    infrastructure: {
      roads: {
        totalLength: 48,
        pavedRoads: 28,
        unpavedRoads: 20
      },
      healthFacilities: {
        hospitals: 0,
        healthCenters: 1,
        clinics: 1,
        doctors: 1,
        nurses: 4
      },
      education: {
        kindergartens: 3,
        elementarySchools: 6,
        juniorHighSchools: 1,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 38
      },
      utilities: {
        electricityAccess: 85,
        cleanWaterAccess: 72,
        internetAccess: 42,
        wasteManagement: true
      },
      lastUpdated: new Date()
    },

    tourism: {
      attractions: [
        {
          name: 'Pantai Raijua',
          type: 'beach',
          description: 'Pantai eksotis dengan air laut yang jernih dan terumbu karang',
          coordinates: { type: 'Point', coordinates: [121.6500, -10.3900] }
        },
        {
          name: 'Pulau Raijua',
          type: 'island',
          description: 'Pulau kecil dengan keindahan alam yang masih alami',
          coordinates: { type: 'Point', coordinates: [121.6500, -10.4100] }
        }
      ],
      accommodations: {
        hotels: 1,
        guesthouses: 2,
        homestays: 5
      },
      annualVisitors: 3200,
      lastUpdated: new Date()
    },

    isActive: true,
    displayOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '507f1f77bcf86cd799439012' as any,
    updatedBy: '507f1f77bcf86cd799439012' as any
  }
]
