'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  MapPin,
  Users,
  Building2,
  Phone,
  Search,
  Home
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

interface Village {
  _id: string
  name: string
  code: string
  type: 'desa' | 'kelurahan'
  district: string
  head: {
    name: string
    title: string
    contact?: {
      phone?: string
      email?: string
    }
  }
  demographics: {
    population: {
      total: number
      male?: number
      female?: number
      families?: number
    }
  }
  geography: {
    area: number
  }
  contact: {
    office: {
      address: string
      phone?: string
      email?: string
    }
  }
  description?: string
  featured: boolean
  status: string
}

interface VillageStats {
  totalVillages: number
  totalDesa: number
  totalKelurahan: number
  totalPopulation: number
}

export default function DesaPage() {
  const [villages, setVillages] = useState<Village[]>([])
  const [villageStats, setVillageStats] = useState<VillageStats>({
    totalVillages: 0,
    totalDesa: 0,
    totalKelurahan: 0,
    totalPopulation: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVillages = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDistrict !== 'all' && { district: selectedDistrict })
      })

      const response = await fetch(`/api/villages?${params}`)
      const data = await response.json()

      if (data.success) {
        setVillages(data.data)
        setTotalPages(data.pagination.pages)
        setVillageStats({
          totalVillages: data.statistics.totalVillages,
          totalDesa: data.statistics.totalDesa,
          totalKelurahan: data.statistics.totalKelurahan,
          totalPopulation: data.statistics.totalPopulation
        })
      }
    } catch (error) {
      console.error('Failed to fetch villages:', error)
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm, selectedDistrict])

  useEffect(() => {
    fetchVillages()
  }, [fetchVillages])

  // Remove static data - now using dynamic content from API

  const districts = ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']

  const filteredVillages = villages.filter(village => {
    const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.head.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDistrict = selectedDistrict === 'all' || village.district === selectedDistrict
    return matchesSearch && matchesDistrict
  })

  const getVillageIcon = (type: string) => {
    return type === 'kelurahan' ? Building2 : Home
  }

  const getVillageTypeColor = (type: string) => {
    return type === 'kelurahan' ? 'bg-blue-600' : 'bg-green-600'
  }

  // Use the stats from API instead of calculating from current page
  const totalVillages = villageStats.totalVillages
  const totalKelurahan = villageStats.totalKelurahan
  const totalDesa = villageStats.totalDesa
  const totalPopulation = villageStats.totalPopulation

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Desa dan Kelurahan Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Informasi lengkap tentang desa dan kelurahan di seluruh wilayah
            Kabupaten Sabu Raijua beserta data kepala desa dan kontak.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Desa/Kelurahan</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVillages}</div>
              <p className="text-xs text-muted-foreground">Seluruh wilayah</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelurahan</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalKelurahan}</div>
              <p className="text-xs text-muted-foreground">Status kelurahan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desa</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalDesa}</div>
              <p className="text-xs text-muted-foreground">Status desa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penduduk</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPopulation.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Jiwa</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cari Desa/Kelurahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari nama desa/kelurahan atau kepala desa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:w-64">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Kecamatan</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredVillages.length} dari {totalVillages} desa/kelurahan
            </div>
          </CardContent>
        </Card>

        {/* Villages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="w-full h-4 bg-gray-200 rounded"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredVillages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Tidak ada desa/kelurahan yang ditemukan.</p>
            </div>
          ) : (
            filteredVillages.map((village) => {
              const VillageIcon = getVillageIcon(village.type)
              return (
                <Card key={village._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <VillageIcon className="h-5 w-5" />
                          {village.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">Kecamatan {village.district}</p>
                      </div>
                      <Badge className={getVillageTypeColor(village.type)}>
                        {village.type === 'kelurahan' ? 'Kelurahan' : 'Desa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kepala {village.type === 'kelurahan' ? 'Lurah' : 'Desa'}:</span>
                        <span className="font-medium">{village.head.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Penduduk:</span>
                        <span className="font-medium">{village.demographics.population.total.toLocaleString()} jiwa</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Luas:</span>
                        <span className="font-medium">{village.geography.area} km²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kontak:</span>
                        <span className="font-medium">{village.contact.office.phone || 'Tidak tersedia'}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Hubungi
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}

        {/* Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Perbedaan Desa dan Kelurahan</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Desa:</strong> Wilayah administratif yang dipimpin oleh Kepala Desa yang dipilih langsung oleh masyarakat</p>
                  <p><strong>Kelurahan:</strong> Wilayah administratif yang dipimpin oleh Lurah yang merupakan pegawai negeri sipil</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kontak Darurat</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Polisi: 110
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Pemadam Kebakaran: 113
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Ambulans: 118
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
