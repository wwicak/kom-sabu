import { connectToDatabase } from './mongodb'
import { Official, News, Page, Service, Gallery } from './models/content'
import { Destination, Accommodation, Culinary } from './models/tourism'
import { Village } from './models/village'
import { Event } from './models/event'
import { User } from './models/index'
import bcrypt from 'bcryptjs'

// Create admin user for seeding
async function createAdminUser() {
  try {
    // Try to find existing admin user by email or username
    const existingAdmin = await User.findOne({
      $or: [
        { email: 'admin@saburajua.go.id' },
        { username: 'admin' }
      ]
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return existingAdmin._id
    }

    const hashedPassword = await bcrypt.hash('admin123', 12)
    const adminUser = new User({
      username: 'admin-seed',
      fullName: 'Administrator',
      email: 'admin@saburajua.go.id',
      password: hashedPassword,
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      isActive: true
    })

    await adminUser.save()
    console.log('Admin user created successfully')
    return adminUser._id
  } catch (error) {
    console.error('Error creating admin user:', error)
    // If user creation fails, try to find any admin user
    const anyAdmin = await User.findOne({ role: 'admin' })
    if (anyAdmin) {
      console.log('Using existing admin user for seeding')
      return anyAdmin._id
    }
    throw error
  }
}

// Seed officials data
async function seedOfficials(adminId: string) {
  try {
    const existingCount = await Official.countDocuments()
    if (existingCount > 0) {
      console.log('Officials already seeded')
      return
    }

    const officials = [
      {
        name: 'H. Nikodemus N. Rihi Heke, S.Sos',
        position: 'Bupati Sabu Raijua',
        level: 'kabupaten',
        category: 'pimpinan',
        department: 'Pemerintah Kabupaten Sabu Raijua',
        period: {
          start: new Date('2021-02-26'),
          end: new Date('2026-02-26')
        },
        education: 'S1 Ilmu Sosial dan Politik',
        experience: [
          'Anggota DPRD Sabu Raijua (2014-2019)',
          'Ketua Fraksi Partai Demokrat DPRD (2016-2019)',
          'Aktivis Pemuda dan Mahasiswa'
        ],
        achievements: [
          'Peningkatan infrastruktur jalan 40%',
          'Program Sabu Raijua Digital',
          'Pengembangan sektor pariwisata'
        ],
        vision: 'Mewujudkan Sabu Raijua yang maju, mandiri, dan berbudaya',
        contact: {
          phone: '(0380) 21001',
          email: 'bupati@saburajua.go.id',
          office: 'Kantor Bupati Sabu Raijua'
        },
        order: 1,
        status: 'active',
        featured: true,
        createdBy: adminId
      },
      {
        name: 'Drs. Yohanis Uly Kale',
        position: 'Wakil Bupati Sabu Raijua',
        level: 'kabupaten',
        category: 'pimpinan',
        department: 'Pemerintah Kabupaten Sabu Raijua',
        period: {
          start: new Date('2021-02-26'),
          end: new Date('2026-02-26')
        },
        education: 'S1 Administrasi Negara',
        experience: [
          'Camat Sabu Tengah (2010-2015)',
          'Kepala Bagian Pemerintahan (2015-2020)',
          'ASN Kabupaten Sabu Raijua (1995-2021)'
        ],
        achievements: [
          'Reformasi birokrasi daerah',
          'Peningkatan pelayanan publik',
          'Program pemberdayaan masyarakat'
        ],
        vision: 'Mendukung pembangunan yang berkelanjutan dan inklusif',
        contact: {
          phone: '(0380) 21002',
          email: 'wabup@saburajua.go.id',
          office: 'Kantor Wakil Bupati Sabu Raijua'
        },
        order: 2,
        status: 'active',
        featured: true,
        createdBy: adminId
      },
      {
        name: 'Drs. Marthen Dira Tome, M.Si',
        position: 'Sekretaris Daerah',
        level: 'kabupaten',
        category: 'pimpinan',
        department: 'Sekretariat Daerah',
        period: {
          start: new Date('2020-01-15'),
          end: new Date('2025-01-15')
        },
        education: 'S2 Administrasi Publik',
        experience: [
          'Asisten Sekda Bidang Pemerintahan (2018-2020)',
          'Kepala Bappeda Sabu Raijua (2015-2018)',
          'Kepala Dinas PMD (2012-2015)'
        ],
        achievements: [
          'Digitalisasi administrasi pemerintahan',
          'Peningkatan koordinasi antar SKPD',
          'Implementasi e-government'
        ],
        vision: 'Terwujudnya pemerintahan yang efektif dan efisien',
        contact: {
          phone: '(0380) 21003',
          email: 'sekda@saburajua.go.id',
          office: 'Sekretariat Daerah'
        },
        order: 3,
        status: 'active',
        featured: true,
        createdBy: adminId
      },
      // Department heads
      {
        name: 'Drs. Yosef Haning, M.Pd',
        position: 'Kepala Dinas Pendidikan dan Kebudayaan',
        level: 'dinas',
        category: 'kepala_dinas',
        department: 'Dinas Pendidikan dan Kebudayaan',
        education: 'S2 Pendidikan',
        contact: {
          phone: '(0380) 21010',
          email: 'disdikbud@saburajua.go.id'
        },
        order: 10,
        status: 'active',
        createdBy: adminId
      },
      {
        name: 'dr. Maria Goreti Bria, M.Kes',
        position: 'Kepala Dinas Kesehatan',
        level: 'dinas',
        category: 'kepala_dinas',
        department: 'Dinas Kesehatan',
        education: 'S2 Kesehatan Masyarakat',
        contact: {
          phone: '(0380) 21011',
          email: 'dinkes@saburajua.go.id'
        },
        order: 11,
        status: 'active',
        createdBy: adminId
      },
      {
        name: 'Ir. Yohanes Seran, M.T',
        position: 'Kepala Dinas PU dan Penataan Ruang',
        level: 'dinas',
        category: 'kepala_dinas',
        department: 'Dinas Pekerjaan Umum dan Penataan Ruang',
        education: 'S2 Teknik Sipil',
        contact: {
          phone: '(0380) 21012',
          email: 'dpupr@saburajua.go.id'
        },
        order: 12,
        status: 'active',
        createdBy: adminId
      },
      // District heads (Camat)
      {
        name: 'Drs. Yohanes Manu',
        position: 'Camat Sabu Barat',
        level: 'kecamatan',
        category: 'camat',
        department: 'Kecamatan Sabu Barat',
        period: {
          start: new Date('2020-01-01'),
          end: new Date('2025-01-01')
        },
        contact: {
          phone: '(0380) 21020',
          office: 'Kantor Camat Sabu Barat'
        },
        order: 20,
        status: 'active',
        createdBy: adminId
      },
      {
        name: 'Kornelius Haning, S.Sos',
        position: 'Camat Sabu Tengah',
        level: 'kecamatan',
        category: 'camat',
        department: 'Kecamatan Sabu Tengah',
        period: {
          start: new Date('2021-01-01'),
          end: new Date('2026-01-01')
        },
        contact: {
          phone: '(0380) 21021',
          office: 'Kantor Camat Sabu Tengah'
        },
        order: 21,
        status: 'active',
        createdBy: adminId
      }
    ]

    await Official.insertMany(officials)
    console.log('Officials seeded successfully')
  } catch (error) {
    console.error('Error seeding officials:', error)
    throw error
  }
}

// Seed destinations data
async function seedDestinations(adminId: string) {
  try {
    const existingCount = await Destination.countDocuments()
    if (existingCount > 0) {
      console.log('Destinations already seeded')
      return
    }

    const destinations = [
      {
        name: 'Pantai Namosain',
        slug: 'pantai-namosain',
        shortDescription: 'Pantai indah dengan pasir putih dan air laut yang jernih, cocok untuk berenang dan snorkeling',
        description: 'Pantai Namosain adalah salah satu destinasi wisata unggulan di Sabu Raijua dengan keindahan alam yang memukau. Pantai ini memiliki pasir putih yang halus dan air laut yang jernih berwarna biru kehijauan. Lokasi yang tenang dan pemandangan yang indah menjadikan pantai ini tempat yang sempurna untuk bersantai dan menikmati keindahan alam.',
        category: 'Pantai',
        subcategory: 'Wisata Alam',
        location: {
          district: 'Sabu Barat',
          village: 'Namosain',
          address: 'Desa Namosain, Kecamatan Sabu Barat'
        },
        images: [
          {
            url: '/images/destinations/pantai-namosain-1.jpg',
            caption: 'Pemandangan Pantai Namosain dari atas bukit',
            alt: 'Pantai Namosain dengan pasir putih dan air jernih',
            isPrimary: true
          }
        ],
        facilities: ['Parkir', 'Toilet', 'Warung', 'Gazebo', 'Area Piknik'],
        activities: ['Berenang', 'Snorkeling', 'Fotografi', 'Sunset viewing', 'Piknik'],
        highlights: ['Pasir putih halus', 'Air laut jernih', 'Pemandangan sunset', 'Spot snorkeling'],
        accessibility: {
          difficulty: 'Mudah',
          duration: '2-3 jam',
          bestTime: 'April - Oktober',
          access: 'Jalan aspal 15 km dari pusat kota Seba'
        },
        pricing: {
          entrance: 'Gratis',
          parking: 'Rp 5.000',
          guide: 'Rp 50.000/hari'
        },
        contact: {
          phone: '(0380) 21100',
          email: 'info@pantainamosain.com'
        },
        rating: {
          average: 4.5,
          count: 127
        },
        statistics: {
          views: 2450,
          visitors: {
            annual: 4500,
            monthly: 375
          }
        },
        status: 'published',
        featured: true,
        publishedAt: new Date(),
        createdBy: adminId
      },
      {
        name: 'Desa Adat Raijua',
        slug: 'desa-adat-raijua',
        shortDescription: 'Desa tradisional dengan rumah adat dan kebudayaan yang masih terjaga dengan baik',
        description: 'Desa Adat Raijua merupakan destinasi wisata budaya yang menawarkan pengalaman autentik kehidupan masyarakat tradisional Sabu Raijua. Di desa ini, wisatawan dapat melihat rumah-rumah adat yang masih terawat dengan baik, serta menyaksikan berbagai aktivitas budaya dan tradisi yang masih dijalankan oleh masyarakat setempat.',
        category: 'Budaya',
        subcategory: 'Wisata Budaya',
        location: {
          district: 'Raijua',
          village: 'Raijua',
          address: 'Desa Raijua, Kecamatan Raijua'
        },
        images: [
          {
            url: '/images/destinations/desa-adat-raijua-1.jpg',
            caption: 'Rumah adat tradisional di Desa Raijua',
            alt: 'Rumah adat dengan arsitektur tradisional Sabu',
            isPrimary: true
          }
        ],
        facilities: ['Guide lokal', 'Homestay', 'Toko souvenir', 'Area parkir'],
        activities: ['Cultural tour', 'Homestay experience', 'Workshop kerajinan', 'Fotografi'],
        highlights: ['Rumah adat asli', 'Tradisi yang terjaga', 'Kerajinan lokal', 'Cerita rakyat'],
        accessibility: {
          difficulty: 'Mudah',
          duration: '3-4 jam',
          bestTime: 'Sepanjang tahun',
          access: 'Perahu dari Pelabuhan Seba (1 jam), lalu jalan kaki 20 menit'
        },
        pricing: {
          entrance: 'Rp 25.000',
          guide: 'Rp 100.000/hari',
          homestay: 'Rp 150.000/malam'
        },
        contact: {
          phone: '(0380) 21200'
        },
        rating: {
          average: 4.8,
          count: 89
        },
        statistics: {
          views: 1890,
          visitors: {
            annual: 2500,
            monthly: 208
          }
        },
        status: 'published',
        featured: true,
        publishedAt: new Date(),
        createdBy: adminId
      }
    ]

    await Destination.insertMany(destinations)
    console.log('Destinations seeded successfully')
  } catch (error) {
    console.error('Error seeding destinations:', error)
    throw error
  }
}

// Main seeding function
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')
    
    await connectToDatabase()
    console.log('Connected to database')

    // Create admin user first
    const adminId = await createAdminUser()

    // Seed all data
    await Promise.all([
      seedOfficials(adminId),
      seedDestinations(adminId)
    ])

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Database seeding failed:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}
