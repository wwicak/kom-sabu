'use client'

import { useState } from 'react'
import { InteractiveMap, KecamatanDetailCard } from './InteractiveMap'
import { useKecamatanList } from '@/hooks/useKecamatan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Building2, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface KecamatanData {
  _id: string
  name: string
  slug: string
  description?: string
  area: number
  population: number
  villages: number
  coordinates: {
    center: { lat: number; lng: number }
    bounds?: {
      north: number
      south: number
      east: number
      west: number
    }
  }
  polygon: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][]
  }
  potency: any
  demographics: any
  images?: Array<{
    url: string
    caption: string
    category: string
  }>
  headOffice?: {
    address: string
    phone: string
    email: string
    head: string
  }
}

export function KecamatanMap() {
  const { data: kecamatanData, isLoading, error } = useKecamatanList()
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanData | null>(null)

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Peta Kecamatan Sabu Raijua
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Jelajahi potensi dan data setiap kecamatan di Kabupaten Sabu Raijua
            </p>
          </div>
          
          <div className="mt-12 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Memuat data kecamatan...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Peta Kecamatan Sabu Raijua
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Jelajahi potensi dan data setiap kecamatan di Kabupaten Sabu Raijua
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <div className="text-red-600 mb-4">
              Gagal memuat data kecamatan. Silakan coba lagi nanti.
            </div>
            <Button onClick={() => window.location.reload()}>
              Muat Ulang
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Calculate total statistics
  const totalPopulation = kecamatanData?.reduce((sum, k) => sum + k.population, 0) || 0
  const totalVillages = kecamatanData?.reduce((sum, k) => sum + k.villages, 0) || 0
  const totalArea = kecamatanData?.reduce((sum, k) => sum + k.area, 0) || 0

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Peta Kecamatan Sabu Raijua
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Jelajahi potensi dan data setiap kecamatan di Kabupaten Sabu Raijua
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {kecamatanData?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kecamatan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalPopulation.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Penduduk</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MapPin className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalVillages}
                  </div>
                  <div className="text-sm text-gray-600">Desa/Kelurahan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalArea.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">km² Luas Wilayah</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map and Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Peta Interaktif Kecamatan
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Klik pada area kecamatan untuk melihat detail informasi
                </p>
              </CardHeader>
              <CardContent className="p-0">
                {kecamatanData && (
                  <InteractiveMap
                    kecamatanData={kecamatanData}
                    selectedKecamatan={selectedKecamatan?.slug}
                    onKecamatanSelect={setSelectedKecamatan}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kecamatan Details or List */}
          <div className="space-y-6">
            {selectedKecamatan ? (
              <KecamatanDetailCard
                kecamatan={selectedKecamatan}
                onClose={() => setSelectedKecamatan(null)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Daftar Kecamatan
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Pilih kecamatan untuk melihat detail
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {kecamatanData?.map((kecamatan) => (
                    <div
                      key={kecamatan._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedKecamatan(kecamatan)}
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {kecamatan.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {kecamatan.population.toLocaleString()} penduduk
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {kecamatan.villages} desa
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Ingin Tahu Lebih Detail?
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Jelajahi profil lengkap setiap kecamatan dengan data terkini dan potensi unggulan
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/kecamatan">
                    Lihat Semua Kecamatan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
