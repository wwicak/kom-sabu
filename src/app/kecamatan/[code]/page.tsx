'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MapPin,
  Users,
  Building2,
  Wheat,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Home,
  School,
  Hospital,
  ShoppingCart
} from 'lucide-react'
import { IKecamatan } from '@/lib/models/kecamatan'

export default function KecamatanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [kecamatan, setKecamatan] = useState<IKecamatan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        const response = await fetch(`/api/kecamatan/${params.code}`)
        if (!response.ok) {
          throw new Error('Kecamatan not found')
        }

        const data = await response.json()
        setKecamatan(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load kecamatan data')
      } finally {
        setLoading(false)
      }
    }

    if (params.code) {
      fetchKecamatan()
    }
  }, [params.code])

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !kecamatan) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kecamatan Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Kecamatan yang Anda cari tidak dapat ditemukan.'}</p>
            <Button onClick={() => router.push('/peta-kecamatan')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Peta Kecamatan
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/peta-kecamatan')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Peta Kecamatan
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Kecamatan {kecamatan.name}
          </h1>
          <p className="text-lg text-gray-600">
            Ibukota: {kecamatan.capital} • Kode: {kecamatan.code}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Gambaran Umum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">
                      {kecamatan.demographics.totalPopulation.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-700">Penduduk</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">
                      {kecamatan.villages.length}
                    </div>
                    <div className="text-sm text-green-700">Desa/Kelurahan</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">
                      {kecamatan.area.toFixed(1)}
                    </div>
                    <div className="text-sm text-orange-700">km²</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Home className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">
                      {Math.round(kecamatan.demographics.populationDensity)}
                    </div>
                    <div className="text-sm text-purple-700">jiwa/km²</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Demografi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Berdasarkan Jenis Kelamin</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Laki-laki:</span>
                        <span className="font-medium">{kecamatan.demographics.malePopulation.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Perempuan:</span>
                        <span className="font-medium">{kecamatan.demographics.femalePopulation.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold">{kecamatan.demographics.totalPopulation.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Berdasarkan Usia</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>0-14 tahun:</span>
                        <span className="font-medium">{kecamatan.demographics.ageGroups.under15.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>15-64 tahun:</span>
                        <span className="font-medium">{kecamatan.demographics.ageGroups.age15to64.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>65+ tahun:</span>
                        <span className="font-medium">{kecamatan.demographics.ageGroups.over64.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Villages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Desa/Kelurahan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kecamatan.villages.map((village, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-gray-900">{village.name}</h4>
                      <p className="text-sm text-gray-600">
                        {village.population?.toLocaleString() || 'N/A'} penduduk • {village.type}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Economy */}
            {kecamatan.economy && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wheat className="h-5 w-5" />
                    Ekonomi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {kecamatan.economy.mainIndustries && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Industri Utama</h4>
                        <div className="space-y-2">
                          {kecamatan.economy.mainIndustries.map((industry: string, index: number) => (
                            <Badge key={index} variant="outline">{industry}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {kecamatan.agriculture.mainCrops && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Komoditas Utama</h4>
                        <div className="space-y-2">
                          {kecamatan.agriculture.mainCrops.map((crop: any, index: number) => (
                            <Badge key={index} variant="secondary">{crop.name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Kantor Kecamatan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                      <span className="text-gray-600">
                        {kecamatan.capital}, Kecamatan {kecamatan.name}
                      </span>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kepadatan Penduduk:</span>
                  <span className="font-medium">{Math.round(kecamatan.demographics.populationDensity)} jiwa/km²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rasio Jenis Kelamin:</span>
                  <span className="font-medium">
                    {Math.round((kecamatan.demographics.malePopulation / kecamatan.demographics.femalePopulation) * 100)}:100
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rata-rata per Desa:</span>
                  <span className="font-medium">
                    {Math.round(kecamatan.demographics.totalPopulation / kecamatan.villages.length).toLocaleString()} jiwa
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/peta-kecamatan')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Lihat di Peta
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/kecamatan')}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Semua Kecamatan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
