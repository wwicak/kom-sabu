'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Building2, TrendingUp, Phone, Mail, Clock } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { IKecamatan } from '@/lib/models/kecamatan'

// Mock data for kecamatan
const KECAMATAN_DATA = [
  {
    id: '1',
    name: 'Sabu Barat',
    slug: 'sabu-barat',
    code: 'SB01',
    description: 'Kecamatan Sabu Barat merupakan salah satu kecamatan di Kabupaten Sabu Raijua yang terletak di bagian barat Pulau Sabu.',
    area: 45.2,
    population: 8500,
    villages: 12,
    headOffice: {
      address: 'Jl. Raya Sabu Barat No. 1, Sabu Barat',
      phone: '(0380) 123456',
      email: 'kec.sabubarat@saburajua.go.id',
      head: 'Drs. I Made Sutrisna'
    },
    facilities: ['Puskesmas', 'Sekolah Dasar', 'Sekolah Menengah', 'Kantor Pos', 'Pasar Tradisional'],
    economy: {
      mainSectors: ['Pertanian', 'Perikanan', 'Perdagangan'],
      gdp: 15.2
    }
  },
  {
    id: '2',
    name: 'Sabu Tengah',
    slug: 'sabu-tengah',
    code: 'SB02',
    description: 'Kecamatan Sabu Tengah adalah pusat pemerintahan Kabupaten Sabu Raijua yang terletak di bagian tengah Pulau Sabu.',
    area: 52.8,
    population: 12300,
    villages: 15,
    headOffice: {
      address: 'Jl. Raya Sabu Tengah No. 25, Seba',
      phone: '(0380) 234567',
      email: 'kec.sabutengah@saburajua.go.id',
      head: 'Dra. Maria Magdalena'
    },
    facilities: ['Rumah Sakit', 'Puskesmas', 'Sekolah Dasar', 'SMP', 'SMA', 'Bank', 'Pasar Modern'],
    economy: {
      mainSectors: ['Pemerintahan', 'Perdagangan', 'Jasa'],
      gdp: 22.5
    }
  },
  {
    id: '3',
    name: 'Sabu Timur',
    slug: 'sabu-timur',
    code: 'SB03',
    description: 'Kecamatan Sabu Timur terletak di bagian timur Pulau Sabu dengan potensi wisata bahari yang menarik.',
    area: 38.6,
    population: 7200,
    villages: 10,
    headOffice: {
      address: 'Jl. Pantai Timur No. 15, Sabu Timur',
      phone: '(0380) 345678',
      email: 'kec.sabutimur@saburajua.go.id',
      head: 'Bapak Yosef Ndolu'
    },
    facilities: ['Puskesmas', 'Sekolah Dasar', 'Pelabuhan Kecil', 'Tempat Wisata'],
    economy: {
      mainSectors: ['Perikanan', 'Pariwisata', 'Pertanian'],
      gdp: 12.8
    }
  },
  {
    id: '4',
    name: 'Raijua',
    slug: 'raijua',
    code: 'RJ01',
    description: 'Kecamatan Raijua terletak di Pulau Raijua dengan keindahan alam yang masih alami dan budaya yang khas.',
    area: 36.4,
    population: 5800,
    villages: 8,
    headOffice: {
      address: 'Jl. Pulau Raijua No. 8, Raijua',
      phone: '(0380) 456789',
      email: 'kec.raijua@saburajua.go.id',
      head: 'Ibu Christina Bani'
    },
    facilities: ['Puskesmas', 'Sekolah Dasar', 'Pelabuhan', 'Objek Wisata'],
    economy: {
      mainSectors: ['Perikanan', 'Pariwisata', 'Kerajinan'],
      gdp: 8.9
    }
  }
]

async function fetchKecamatanData() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return KECAMATAN_DATA
}

export default function KecamatanPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null)

  const { data: kecamatanData, isLoading, error } = useQuery({
    queryKey: ['kecamatan-list'],
    queryFn: fetchKecamatanData,
    staleTime: 5 * 60 * 1000,
  })

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Kecamatan</h1>
            <p className="text-red-600 mb-4">Gagal memuat data kecamatan</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kecamatan</h1>
          <p className="text-gray-600">
            Kabupaten Sabu Raijua terdiri dari 4 kecamatan yang tersebar di Pulau Sabu dan Pulau Raijua
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Kecamatan</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Penduduk</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(kecamatanData?.reduce((sum, k) => sum + k.population, 0) || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Desa</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kecamatanData?.reduce((sum, k) => sum + k.villages, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Luas Wilayah</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kecamatanData?.reduce((sum, k) => sum + k.area, 0).toFixed(1) || 0} km²
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map Link */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Peta Interaktif Kecamatan</h3>
                <p className="text-gray-600">
                  Jelajahi peta interaktif untuk melihat batas wilayah dan informasi detail setiap kecamatan
                </p>
              </div>
              <Button asChild>
                <Link href="/peta-kecamatan">
                  <MapPin className="mr-2 h-4 w-4" />
                  Lihat Peta
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kecamatan List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kecamatanData?.map((kecamatan) => (
              <Card key={kecamatan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{kecamatan.name}</CardTitle>
                    <Badge variant="secondary">{kecamatan.code}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{kecamatan.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Luas</p>
                      <p className="font-semibold">{kecamatan.area} km²</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Penduduk</p>
                      <p className="font-semibold">{formatNumber(kecamatan.population)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Desa</p>
                      <p className="font-semibold">{kecamatan.villages}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {kecamatan.headOffice.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {kecamatan.headOffice.email}
                    </div>
                  </div>

                  {/* Main Sectors */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sektor Utama:</p>
                    <div className="flex flex-wrap gap-1">
                      {kecamatan.economy.mainSectors.map((sector) => (
                        <Badge key={sector} variant="outline" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
