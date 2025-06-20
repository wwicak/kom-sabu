'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout/Layout'
import { IKecamatan } from '@/lib/models/kecamatan'
import { MOCK_KECAMATAN_DATA } from '@/lib/data/mock-kecamatan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Users, BarChart3, Wheat, Building2 } from 'lucide-react'

// Dynamically import the map component to avoid SSR issues
const SabuRaijuaMap = dynamic(
  () => import('@/components/maps/SabuRaijuaMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat peta...</p>
        </div>
      </div>
    )
  }
)

// Fetch kecamatan data with fallback to mock data
async function fetchKecamatanData(): Promise<IKecamatan[]> {
  try {
    // First try the GeoJSON API for accurate polygon data
    const geoJsonResponse = await fetch('/api/geojson/kecamatan')
    if (geoJsonResponse.ok) {
      const geoJsonResult = await geoJsonResponse.json()
      if (geoJsonResult.success && geoJsonResult.data) {
        console.log('Using GeoJSON data for accurate polygons:', geoJsonResult.data.length, 'kecamatan')
        console.log('First kecamatan geometry:', geoJsonResult.data[0]?.geometry)
        return geoJsonResult.data
      }
    }

    // Fallback to regular kecamatan API
    const response = await fetch('/api/kecamatan?includeGeometry=true&regencyCode=5320')
    if (!response.ok) {
      console.warn('API failed, using mock data')
      return MOCK_KECAMATAN_DATA as IKecamatan[]
    }
    const result = await response.json()
    return result.data
  } catch (error) {
    console.warn('API error, using mock data:', error)
    return MOCK_KECAMATAN_DATA as IKecamatan[]
  }
}

export default function PetaKecamatanPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<IKecamatan | null>(null)
  const [hoveredKecamatan, setHoveredKecamatan] = useState<IKecamatan | null>(null)

  const { data: kecamatanData, isLoading, error } = useQuery({
    queryKey: ['kecamatan', 'sabu-raijua'],
    queryFn: fetchKecamatanData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const handleKecamatanClick = (kecamatan: IKecamatan) => {
    setSelectedKecamatan(kecamatan)
  }

  const handleKecamatanHover = (kecamatan: IKecamatan | null) => {
    setHoveredKecamatan(kecamatan)
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Peta Interaktif Kecamatan</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Gagal memuat data kecamatan. Silakan coba lagi nanti.</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Peta Interaktif Kecamatan Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jelajahi informasi demografis, ekonomi, dan potensi setiap kecamatan di Kabupaten Sabu Raijua.
            Klik pada area kecamatan untuk melihat detail informasi.
          </p>
        </div>

        {/* Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Peta Interaktif Kecamatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="w-full h-[600px]" />
                ) : kecamatanData ? (
                  <SabuRaijuaMap
                    kecamatanData={kecamatanData}
                    onKecamatanClick={handleKecamatanClick}
                    onKecamatanHover={handleKecamatanHover}
                    selectedKecamatan={selectedKecamatan?.code || null}
                    height="600px"
                  />
                ) : (
                  <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Tidak ada data kecamatan tersedia</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Kecamatan List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Kecamatan</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : kecamatanData ? (
                  <div className="space-y-3">
                    {kecamatanData.map((kecamatan) => (
                      <div
                        key={kecamatan.code}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedKecamatan?.code === kecamatan.code
                          ? 'border-blue-500 bg-blue-50'
                          : hoveredKecamatan?.code === kecamatan.code
                            ? 'border-gray-300 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => handleKecamatanClick(kecamatan)}
                      >
                        <h3 className="font-semibold text-gray-900">
                          Kecamatan {kecamatan.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatNumber(kecamatan.demographics.totalPopulation)} jiwa
                        </p>
                        <p className="text-xs text-gray-500">
                          {kecamatan.area.toFixed(1)} km² • {kecamatan.villages.length} desa/kelurahan
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Tidak ada data tersedia</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Kecamatan Details */}
        {selectedKecamatan && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Kecamatan {selectedKecamatan.name}
              </h2>
              <p className="text-gray-600">
                Ibukota: {selectedKecamatan.capital} • Luas: {selectedKecamatan.area.toFixed(2)} km²
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Demographics Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    Demografi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(selectedKecamatan.demographics.totalPopulation)}
                    </p>
                    <p className="text-sm text-gray-600">Total Penduduk</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{formatNumber(selectedKecamatan.demographics.malePopulation)}</p>
                      <p className="text-gray-600">Laki-laki</p>
                    </div>
                    <div>
                      <p className="font-semibold">{formatNumber(selectedKecamatan.demographics.femalePopulation)}</p>
                      <p className="text-gray-600">Perempuan</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{Math.round(selectedKecamatan.demographics.populationDensity)} jiwa/km²</p>
                    <p className="text-sm text-gray-600">Kepadatan Penduduk</p>
                  </div>
                </CardContent>
              </Card>

              {/* Economy Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Ekonomi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedKecamatan.economy.employmentRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Tingkat Kerja</p>
                  </div>
                  {selectedKecamatan.economy.averageIncome && (
                    <div>
                      <p className="font-semibold">{formatCurrency(selectedKecamatan.economy.averageIncome)}</p>
                      <p className="text-sm text-gray-600">Rata-rata Pendapatan</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{selectedKecamatan.economy.povertyRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-600">Tingkat Kemiskinan</p>
                  </div>
                </CardContent>
              </Card>

              {/* Agriculture Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wheat className="h-5 w-5 text-amber-600" />
                    Pertanian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatNumber(selectedKecamatan.agriculture.totalAgriculturalArea)}
                    </p>
                    <p className="text-sm text-gray-600">Luas Lahan (Ha)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-700">Komoditas Utama:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedKecamatan.agriculture.mainCrops.slice(0, 3).map((crop, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {crop.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Infrastructure Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Infrastruktur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold">{selectedKecamatan.infrastructure.utilities.electricityAccess}%</p>
                      <p className="text-gray-600">Listrik</p>
                    </div>
                    <div>
                      <p className="font-semibold">{selectedKecamatan.infrastructure.utilities.cleanWaterAccess}%</p>
                      <p className="text-gray-600">Air Bersih</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedKecamatan.infrastructure.roads.totalLength} km</p>
                    <p className="text-sm text-gray-600">Total Jalan</p>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedKecamatan.infrastructure.education.elementarySchools + selectedKecamatan.infrastructure.education.juniorHighSchools + selectedKecamatan.infrastructure.education.seniorHighSchools}</p>
                    <p className="text-sm text-gray-600">Sekolah</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Natural Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Sumber Daya Alam</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedKecamatan.naturalResources.minerals.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mineral</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedKecamatan.naturalResources.minerals.map((mineral, index) => (
                          <Badge key={index} variant="outline">
                            {mineral.type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedKecamatan.naturalResources.coastalLength && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Panjang Pantai</h4>
                      <p className="text-gray-600">{selectedKecamatan.naturalResources.coastalLength} km</p>
                    </div>
                  )}

                  {selectedKecamatan.naturalResources.forestArea > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Luas Hutan</h4>
                      <p className="text-gray-600">{formatNumber(selectedKecamatan.naturalResources.forestArea)} ha</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tourism */}
              <Card>
                <CardHeader>
                  <CardTitle>Pariwisata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedKecamatan.tourism.attractions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Objek Wisata</h4>
                      <div className="space-y-2">
                        {selectedKecamatan.tourism.attractions.map((attraction, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-3">
                            <h5 className="font-medium text-gray-900">{attraction.name}</h5>
                            <p className="text-sm text-gray-600">{attraction.description}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {attraction.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedKecamatan.tourism.annualVisitors && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Kunjungan Wisatawan</h4>
                      <p className="text-gray-600">{formatNumber(selectedKecamatan.tourism.annualVisitors)} per tahun</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
