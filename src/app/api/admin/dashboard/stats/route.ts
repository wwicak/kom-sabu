import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard statistics
    // In a real application, this would fetch from your database
    const stats = {
      totalUsers: 15,
      totalContent: 45,
      totalKecamatan: 6,
      totalImages: 128,
      recentActivity: [
        {
          id: '1',
          action: 'Menambahkan berita baru: "Pembangunan Jalan Sabu Tengah"',
          timestamp: '2 jam yang lalu',
          user: 'Admin Sabu'
        },
        {
          id: '2',
          action: 'Memperbarui data kecamatan Raijua',
          timestamp: '5 jam yang lalu',
          user: 'Admin Raijua'
        },
        {
          id: '3',
          action: 'Mengunggah foto galeri wisata',
          timestamp: '1 hari yang lalu',
          user: 'Admin Pariwisata'
        },
        {
          id: '4',
          action: 'Memperbarui informasi layanan publik',
          timestamp: '2 hari yang lalu',
          user: 'Admin Layanan'
        }
      ]
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
