import mongoose from 'mongoose'
import { Kecamatan } from './models'

// Sample kecamatan data for Sabu Raijua
const kecamatanData = [
  {
    name: 'Sabu Barat',
    slug: 'sabu-barat',
    description: 'Kecamatan yang terletak di bagian barat Pulau Sabu dengan potensi pertanian dan perikanan yang melimpah.',
    area: 89.5,
    population: 15420,
    villages: 12,
    coordinates: {
      center: { lat: -10.5234, lng: 121.7456 },
      bounds: {
        north: -10.4800,
        south: -10.5800,
        east: 121.8000,
        west: 121.6800
      }
    },
    polygon: {
      type: 'Polygon' as const,
      coordinates: [[
        [121.6800, -10.4800],
        [121.8000, -10.4800],
        [121.8000, -10.5800],
        [121.6800, -10.5800],
        [121.6800, -10.4800]
      ]]
    },
    potency: {
      agriculture: {
        mainCrops: ['Jagung', 'Kacang Tanah', 'Ubi Kayu'],
        productivity: 'Tinggi',
        farmingArea: 2500
      },
      fishery: {
        mainSpecies: ['Ikan Tuna', 'Ikan Cakalang', 'Udang'],
        productivity: 'Sedang',
        fishingArea: 150
      },
      tourism: {
        attractions: ['Pantai Namosain', 'Bukit Wairinding'],
        facilities: ['Homestay', 'Warung Makan'],
        annualVisitors: 2500
      },
      economy: {
        mainSectors: ['Pertanian', 'Perikanan', 'Perdagangan'],
        averageIncome: 2500000,
        businessUnits: 145
      },
      infrastructure: {
        roads: 'Baik',
        electricity: 85,
        water: 78,
        internet: 45
      }
    },
    demographics: {
      ageGroups: {
        children: 4200,
        adults: 9800,
        elderly: 1420
      },
      education: {
        elementary: 12,
        junior: 3,
        senior: 2,
        higher: 0
      },
      occupation: {
        agriculture: 8500,
        fishery: 2800,
        trade: 1900,
        services: 1200,
        others: 1020
      }
    },
    images: [
      {
        url: '/images/kecamatan/sabu-barat-1.jpg',
        caption: 'Pemandangan sawah di Kecamatan Sabu Barat',
        category: 'landscape'
      }
    ],
    headOffice: {
      address: 'Jl. Trans Sabu No. 15, Desa Dimu',
      phone: '0380-21001',
      email: 'kec.sabubarat@saburaijuakab.go.id',
      head: 'Drs. Yosef Ndolu'
    }
  },
  {
    name: 'Sabu Tengah',
    slug: 'sabu-tengah',
    description: 'Kecamatan yang menjadi pusat pemerintahan dengan infrastruktur terbaik di Kabupaten Sabu Raijua.',
    area: 76.8,
    population: 18750,
    villages: 10,
    coordinates: {
      center: { lat: -10.5100, lng: 121.8200 },
      bounds: {
        north: -10.4600,
        south: -10.5600,
        east: 121.8800,
        west: 121.7600
      }
    },
    polygon: {
      type: 'Polygon' as const,
      coordinates: [[
        [121.7600, -10.4600],
        [121.8800, -10.4600],
        [121.8800, -10.5600],
        [121.7600, -10.5600],
        [121.7600, -10.4600]
      ]]
    },
    potency: {
      agriculture: {
        mainCrops: ['Padi', 'Jagung', 'Sayuran'],
        productivity: 'Sangat Tinggi',
        farmingArea: 1800
      },
      tourism: {
        attractions: ['Museum Sabu', 'Pasar Tradisional Seba', 'Pantai Seba'],
        facilities: ['Hotel', 'Restoran', 'Pusat Oleh-oleh'],
        annualVisitors: 8500
      },
      economy: {
        mainSectors: ['Pemerintahan', 'Perdagangan', 'Jasa'],
        averageIncome: 3200000,
        businessUnits: 285
      },
      infrastructure: {
        roads: 'Sangat Baik',
        electricity: 95,
        water: 90,
        internet: 75
      }
    },
    demographics: {
      ageGroups: {
        children: 5100,
        adults: 11800,
        elderly: 1850
      },
      education: {
        elementary: 15,
        junior: 5,
        senior: 3,
        higher: 1
      },
      occupation: {
        agriculture: 6200,
        fishery: 1800,
        trade: 4500,
        services: 5200,
        others: 1050
      }
    },
    headOffice: {
      address: 'Jl. Merdeka No. 1, Seba',
      phone: '0380-21002',
      email: 'kec.sabutengah@saburaijuakab.go.id',
      head: 'Ir. Maria Kaka, M.Si'
    }
  },
  {
    name: 'Sabu Timur',
    slug: 'sabu-timur',
    description: 'Kecamatan dengan potensi perikanan laut yang sangat besar dan pantai-pantai indah.',
    area: 95.2,
    population: 14680,
    villages: 14,
    coordinates: {
      center: { lat: -10.5300, lng: 121.9000 },
      bounds: {
        north: -10.4800,
        south: -10.5800,
        east: 121.9600,
        west: 121.8400
      }
    },
    polygon: {
      type: 'Polygon' as const,
      coordinates: [[
        [121.8400, -10.4800],
        [121.9600, -10.4800],
        [121.9600, -10.5800],
        [121.8400, -10.5800],
        [121.8400, -10.4800]
      ]]
    },
    potency: {
      fishery: {
        mainSpecies: ['Ikan Tuna', 'Ikan Tongkol', 'Cumi-cumi'],
        productivity: 'Sangat Tinggi',
        fishingArea: 280
      },
      tourism: {
        attractions: ['Pantai Namosain', 'Pantai Wadu', 'Spot Diving'],
        facilities: ['Homestay', 'Boat Rental'],
        annualVisitors: 3200
      },
      economy: {
        mainSectors: ['Perikanan', 'Pariwisata', 'Pertanian'],
        averageIncome: 2800000,
        businessUnits: 165
      },
      infrastructure: {
        roads: 'Baik',
        electricity: 80,
        water: 72,
        internet: 40
      }
    },
    demographics: {
      ageGroups: {
        children: 4000,
        adults: 9200,
        elderly: 1480
      },
      education: {
        elementary: 14,
        junior: 4,
        senior: 2,
        higher: 0
      },
      occupation: {
        agriculture: 4500,
        fishery: 6800,
        trade: 1600,
        services: 980,
        others: 800
      }
    },
    headOffice: {
      address: 'Jl. Pantai Timur No. 8, Desa Wadu',
      phone: '0380-21003',
      email: 'kec.sabutimur@saburaijuakab.go.id',
      head: 'Bapak Yohanis Dapa'
    }
  },
  {
    name: 'Raijua',
    slug: 'raijua',
    description: 'Kecamatan kepulauan dengan keunikan budaya dan potensi wisata bahari yang menawan.',
    area: 36.5,
    population: 8950,
    villages: 8,
    coordinates: {
      center: { lat: -10.6500, lng: 121.7200 },
      bounds: {
        north: -10.6000,
        south: -10.7000,
        east: 121.7800,
        west: 121.6600
      }
    },
    polygon: {
      type: 'Polygon' as const,
      coordinates: [[
        [121.6600, -10.6000],
        [121.7800, -10.6000],
        [121.7800, -10.7000],
        [121.6600, -10.7000],
        [121.6600, -10.6000]
      ]]
    },
    potency: {
      fishery: {
        mainSpecies: ['Ikan Kerapu', 'Lobster', 'Rumput Laut'],
        productivity: 'Tinggi',
        fishingArea: 120
      },
      tourism: {
        attractions: ['Pantai Pasir Putih', 'Desa Adat', 'Tenun Tradisional'],
        facilities: ['Homestay', 'Galeri Tenun'],
        annualVisitors: 1800
      },
      economy: {
        mainSectors: ['Perikanan', 'Kerajinan', 'Pariwisata'],
        averageIncome: 2200000,
        businessUnits: 85
      },
      infrastructure: {
        roads: 'Sedang',
        electricity: 70,
        water: 65,
        internet: 25
      }
    },
    demographics: {
      ageGroups: {
        children: 2400,
        adults: 5800,
        elderly: 750
      },
      education: {
        elementary: 8,
        junior: 2,
        senior: 1,
        higher: 0
      },
      occupation: {
        agriculture: 1800,
        fishery: 4200,
        trade: 1200,
        services: 950,
        others: 800
      }
    },
    headOffice: {
      address: 'Jl. Pelabuhan Raijua No. 3, Desa Raijua',
      phone: '0380-21004',
      email: 'kec.raijua@saburaijuakab.go.id',
      head: 'Ibu Theresia Lede, S.Sos'
    }
  }
]

export async function seedKecamatanData() {
  try {
    // Connect to MongoDB using mongoose
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }

    // Clear existing data
    await Kecamatan.deleteMany({})

    // Insert new data
    const result = await Kecamatan.insertMany(kecamatanData)

    console.log(`Successfully seeded ${result.length} kecamatan records`)
    return result
  } catch (error) {
    console.error('Error seeding kecamatan data:', error)
    throw error
  }
}

// Run this function to seed the database
if (require.main === module) {
  seedKecamatanData()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}
