'use client'

import { useState } from 'react'
import { InteractiveMap, KecamatanDetailCard } from './InteractiveMap'
import { useKecamatanList } from '@/hooks/useKecamatan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Building2, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { IKecamatan } from '@/lib/models/kecamatan'

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
  geometry?: {
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

// Helper function to convert KecamatanData to IKecamatan format
function convertToIKecamatan(data: KecamatanData): IKecamatan {
  return {
    _id: data._id as any,
    name: data.name,
    nameEnglish: data.name,
    code: data.slug,
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    geometry: data.geometry || data.polygon,
    centroid: {
      type: 'Point',
      coordinates: [data.coordinates.center.lng, data.coordinates.center.lat]
    },
    area: data.area,
    capital: data.name,
    villages: Array.from({ length: data.villages }, (_, i) => ({
      name: `Desa ${i + 1}`,
      type: 'desa' as const,
      population: Math.floor(data.population / data.villages)
    })),
    demographics: {
      totalPopulation: data.population,
      malePopulation: Math.floor(data.population * 0.51),
      femalePopulation: Math.floor(data.population * 0.49),
      households: Math.floor(data.population / 4),
      populationDensity: data.population / data.area,
      ageGroups: {
        under15: Math.floor(data.population * 0.25),
        age15to64: Math.floor(data.population * 0.65),
        over64: Math.floor(data.population * 0.1)
      },
      education: {
        noEducation: Math.floor(data.population * 0.1),
        elementary: Math.floor(data.population * 0.3),
        juniorHigh: Math.floor(data.population * 0.25),
        seniorHigh: Math.floor(data.population * 0.25),
        university: Math.floor(data.population * 0.1)
      },
      religion: {
        christian: Math.floor(data.population * 0.8),
        catholic: Math.floor(data.population * 0.1),
        islam: Math.floor(data.population * 0.05),
        hindu: Math.floor(data.population * 0.03),
        buddhist: Math.floor(data.population * 0.01),
        other: Math.floor(data.population * 0.01)
      },
      lastUpdated: new Date()
    },
    agriculture: {
      mainCrops: data.potency?.agriculture?.mainCrops?.map((crop: string) => ({ name: crop, area: 100, productivity: 'Tinggi' })) || [],
      totalFarmingArea: data.potency?.agriculture?.farmingArea || 0,
      productivity: data.potency?.agriculture?.productivity || 'Sedang',
      lastUpdated: new Date()
    },
    fishery: {
      mainSpecies: data.potency?.fishery?.mainSpecies?.map((species: string) => ({ name: species, annualCatch: 100, marketValue: 'Tinggi' })) || [],
      totalFishingArea: data.potency?.fishery?.fishingArea || 0,
      productivity: data.potency?.fishery?.productivity || 'Sedang',
      lastUpdated: new Date()
    },
    tourism: {
      attractions: data.potency?.tourism?.attractions?.map((attraction: string) => ({ name: attraction, type: 'Alam', description: attraction })) || [],
      facilities: data.potency?.tourism?.facilities?.map((facility: string) => ({ name: facility, type: 'Akomodasi', capacity: 50 })) || [],
      annualVisitors: data.potency?.tourism?.annualVisitors || 0,
      lastUpdated: new Date()
    },
    infrastructure: {
      roads: {
        totalLength: 50,
        pavedRoads: 30,
        unpavedRoads: 20
      },
      healthFacilities: {
        hospitals: 1,
        healthCenters: 2,
        clinics: 3,
        doctors: 5,
        nurses: 10
      },
      education: {
        kindergartens: 2,
        elementarySchools: 5,
        juniorHighSchools: 2,
        seniorHighSchools: 1,
        universities: 0,
        teachers: 20
      },
      utilities: {
        electricityAccess: 85,
        cleanWaterAccess: 70,
        internetAccess: 60,
        wasteManagement: true
      },
      lastUpdated: new Date()
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  } as IKecamatan
}

export function KecamatanMap() {
  const { data: kecamatanData, isLoading, error } = useKecamatanList()
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanData | null>(null)
  const [hoveredKecamatan, setHoveredKecamatan] = useState<KecamatanData | null>(null)

  // Convert KecamatanData to IKecamatan format for the map
  const convertedKecamatanData = kecamatanData?.map(convertToIKecamatan) || []

  // Handler functions to convert between types
  const handleKecamatanSelect = (kecamatan: IKecamatan | null) => {
    if (kecamatan) {
      // Find the original KecamatanData by matching the code/slug
      const originalData = kecamatanData?.find(k => k.slug === kecamatan.code)
      setSelectedKecamatan(originalData || null)
    } else {
      setSelectedKecamatan(null)
    }
  }

  const handleKecamatanHover = (kecamatan: IKecamatan | null) => {
    if (kecamatan) {
      // Find the original KecamatanData by matching the code/slug
      const originalData = kecamatanData?.find(k => k.slug === kecamatan.code)
      setHoveredKecamatan(originalData || null)
    } else {
      setHoveredKecamatan(null)
    }
  }

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
                {convertedKecamatanData && convertedKecamatanData.length > 0 ? (
                  <div className="relative">
                    <InteractiveMap
                      kecamatanData={convertedKecamatanData}
                      selectedKecamatan={selectedKecamatan?.slug}
                      onKecamatanSelect={handleKecamatanSelect}
                      onKecamatanHover={handleKecamatanHover}
                      showHoverInfo={true}
                    />

                    {/* Hover Info Overlay */}
                    {hoveredKecamatan && !selectedKecamatan && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm z-10 border">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Kecamatan {hoveredKecamatan.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{hoveredKecamatan.population?.toLocaleString('id-ID') || 'N/A'} jiwa</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{hoveredKecamatan.area?.toFixed(1) || 'N/A'} km²</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{hoveredKecamatan.villages || 'N/A'} desa/kelurahan</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Klik untuk melihat detail lengkap
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="mb-2">🗺️</div>
                      <p>Data kecamatan tidak tersedia</p>
                      <p className="text-sm mt-1">Silakan coba lagi nanti</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kecamatan Details or List */}
          <div className="space-y-6">
            {selectedKecamatan ? (
              <KecamatanDetailCard
                kecamatan={convertToIKecamatan(selectedKecamatan)}
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
