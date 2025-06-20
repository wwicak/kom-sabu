'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MapPin,
  Users,
  Building2,
  Phone,
  Search,
  Home
} from 'lucide-react'
import { useState } from 'react'

export default function DesaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('all')

  const villages = [
    // Sabu Barat
    { name: 'Menia', type: 'kelurahan', district: 'Sabu Barat', population: 2500, head: 'Yohanes Rihi', phone: '(0380) 21101' },
    { name: 'Dimu', type: 'desa', district: 'Sabu Barat', population: 1200, head: 'Maria Seran', phone: '(0380) 21102' },
    { name: 'Namosain', type: 'desa', district: 'Sabu Barat', population: 1100, head: 'Kornelius Haning', phone: '(0380) 21103' },
    { name: 'Bohela', type: 'desa', district: 'Sabu Barat', population: 980, head: 'Yosef Kale', phone: '(0380) 21104' },
    { name: 'Lekik', type: 'desa', district: 'Sabu Barat', population: 850, head: 'Maria Rihi', phone: '(0380) 21105' },
    { name: 'Tardamu', type: 'desa', district: 'Sabu Barat', population: 920, head: 'Drs. Marthen Seran', phone: '(0380) 21106' },
    { name: 'Wunlah', type: 'desa', district: 'Sabu Barat', population: 780, head: 'Yustina Haning', phone: '(0380) 21107' },
    { name: 'Ledefoho', type: 'desa', district: 'Sabu Barat', population: 650, head: 'Kornelius Manu', phone: '(0380) 21108' },

    // Sabu Tengah
    { name: 'Sabu Tengah', type: 'desa', district: 'Sabu Tengah', population: 2200, head: 'Drs. Yohanes Kale', phone: '(0380) 21201' },
    { name: 'Liae', type: 'desa', district: 'Sabu Tengah', population: 1800, head: 'Maria Haning', phone: '(0380) 21202' },
    { name: 'Bohela', type: 'desa', district: 'Sabu Tengah', population: 1600, head: 'Yosef Rihi', phone: '(0380) 21203' },
    { name: 'Keka', type: 'desa', district: 'Sabu Tengah', population: 1400, head: 'Kornelius Seran', phone: '(0380) 21204' },
    { name: 'Mesara', type: 'desa', district: 'Sabu Tengah', population: 1200, head: 'Maria Kale', phone: '(0380) 21205' },
    { name: 'Tardamu Liae', type: 'desa', district: 'Sabu Tengah', population: 1100, head: 'Yohanes Haning', phone: '(0380) 21206' },
    { name: 'Wunlah Liae', type: 'desa', district: 'Sabu Tengah', population: 950, head: 'Maria Manu', phone: '(0380) 21207' },
    { name: 'Ledefoho Liae', type: 'desa', district: 'Sabu Tengah', population: 850, head: 'Yosef Seran', phone: '(0380) 21208' },

    // Sabu Timur
    { name: 'Timu', type: 'kelurahan', district: 'Sabu Timur', population: 2800, head: 'Dra. Maria Rihi', phone: '(0380) 21301' },
    { name: 'Ae Tadu', type: 'desa', district: 'Sabu Timur', population: 1500, head: 'Kornelius Kale', phone: '(0380) 21302' },
    { name: 'Dimu Timur', type: 'desa', district: 'Sabu Timur', population: 1300, head: 'Yohanes Manu', phone: '(0380) 21303' },
    { name: 'Namosain Timur', type: 'desa', district: 'Sabu Timur', population: 1200, head: 'Maria Haning', phone: '(0380) 21304' },
    { name: 'Bohela Timur', type: 'desa', district: 'Sabu Timur', population: 1100, head: 'Yosef Rihi', phone: '(0380) 21305' },
    { name: 'Keka Timur', type: 'desa', district: 'Sabu Timur', population: 980, head: 'Kornelius Seran', phone: '(0380) 21306' },
    { name: 'Mesara Timur', type: 'desa', district: 'Sabu Timur', population: 920, head: 'Maria Kale', phone: '(0380) 21307' },

    // Raijua
    { name: 'Raijua', type: 'desa', district: 'Raijua', population: 3000, head: 'Drs. Yosef Rihi', phone: '(0380) 21401' },
    { name: 'Lela', type: 'desa', district: 'Raijua', population: 2500, head: 'Maria Seran', phone: '(0380) 21402' },
    { name: 'Namo', type: 'desa', district: 'Raijua', population: 2200, head: 'Kornelius Haning', phone: '(0380) 21403' },
    { name: 'Batudaka', type: 'desa', district: 'Raijua', population: 1800, head: 'Yohanes Kale', phone: '(0380) 21404' },
    { name: 'Mukebuku', type: 'desa', district: 'Raijua', population: 1600, head: 'Maria Rihi', phone: '(0380) 21405' },
    { name: 'Padira', type: 'desa', district: 'Raijua', population: 1400, head: 'Yosef Manu', phone: '(0380) 21406' },

    // Sabu Liae
    { name: 'Liae Barat', type: 'desa', district: 'Sabu Liae', population: 800, head: 'Kornelius Rihi', phone: '(0380) 21501' },
    { name: 'Liae Tengah', type: 'desa', district: 'Sabu Liae', population: 750, head: 'Maria Haning', phone: '(0380) 21502' },
    { name: 'Liae Timur', type: 'desa', district: 'Sabu Liae', population: 700, head: 'Yohanes Seran', phone: '(0380) 21503' },
    { name: 'Tardamu Liae Barat', type: 'desa', district: 'Sabu Liae', population: 650, head: 'Yosef Kale', phone: '(0380) 21504' },
    { name: 'Wunlah Liae Barat', type: 'desa', district: 'Sabu Liae', population: 600, head: 'Maria Manu', phone: '(0380) 21505' },

    // Hawu Mehara
    { name: 'Mehara', type: 'desa', district: 'Hawu Mehara', population: 900, head: 'Drs. Maria Haning', phone: '(0380) 21601' },
    { name: 'Hawu', type: 'desa', district: 'Hawu Mehara', population: 850, head: 'Kornelius Rihi', phone: '(0380) 21602' },
    { name: 'Dimu Mehara', type: 'desa', district: 'Hawu Mehara', population: 800, head: 'Yohanes Kale', phone: '(0380) 21603' },
    { name: 'Namosain Mehara', type: 'desa', district: 'Hawu Mehara', population: 750, head: 'Maria Seran', phone: '(0380) 21604' },
    { name: 'Bohela Mehara', type: 'desa', district: 'Hawu Mehara', population: 700, head: 'Yosef Rihi', phone: '(0380) 21605' },
  ]

  const districts = ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']

  const filteredVillages = villages.filter(village => {
    const matchesSearch = village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.head.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDistrict = selectedDistrict === 'all' || village.district === selectedDistrict
    return matchesSearch && matchesDistrict
  })

  const getVillageIcon = (type: string) => {
    return type === 'kelurahan' ? Building2 : Home
  }

  const getVillageTypeColor = (type: string) => {
    return type === 'kelurahan' ? 'bg-blue-600' : 'bg-green-600'
  }

  const totalVillages = villages.length
  const totalKelurahan = villages.filter(v => v.type === 'kelurahan').length
  const totalDesa = villages.filter(v => v.type === 'desa').length
  const totalPopulation = villages.reduce((sum, v) => sum + v.population, 0)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
          {filteredVillages.map((village, index) => {
            const VillageIcon = getVillageIcon(village.type)
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
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
                      <span className="font-medium">{village.head}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Penduduk:</span>
                      <span className="font-medium">{village.population.toLocaleString()} jiwa</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kontak:</span>
                      <span className="font-medium">{village.phone}</span>
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
          })}
        </div>

        {/* No Results */}
        {filteredVillages.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada hasil ditemukan</h3>
                <p>Coba ubah kata kunci pencarian atau filter kecamatan</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedDistrict('all')
                }}
              >
                Reset Pencarian
              </Button>
            </CardContent>
          </Card>
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
