'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, Grid, List } from 'lucide-react'

// Sample gallery data
const galleryItems = [
  {
    id: 1,
    title: 'Kegiatan Pemerintahan Daerah',
    description: 'Dokumentasi kegiatan rutin pemerintahan daerah',
    image: '/images/gallery/government-activity-1.jpg',
    category: 'Pemerintahan',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Pembangunan Infrastruktur',
    description: 'Progress pembangunan infrastruktur daerah',
    image: '/images/gallery/infrastructure-1.jpg',
    category: 'Pembangunan',
    date: '2024-01-10'
  },
  {
    id: 3,
    title: 'Kegiatan Sosial Masyarakat',
    description: 'Program pemberdayaan masyarakat',
    image: '/images/gallery/social-activity-1.jpg',
    category: 'Sosial',
    date: '2024-01-08'
  },
  {
    id: 4,
    title: 'Festival Budaya Sabu Raijua',
    description: 'Perayaan budaya lokal dan tradisi',
    image: '/images/gallery/culture-festival-1.jpg',
    category: 'Budaya',
    date: '2024-01-05'
  },
  {
    id: 5,
    title: 'Pelayanan Kesehatan',
    description: 'Program kesehatan masyarakat',
    image: '/images/gallery/health-service-1.jpg',
    category: 'Kesehatan',
    date: '2024-01-03'
  },
  {
    id: 6,
    title: 'Pendidikan dan Pelatihan',
    description: 'Program pendidikan dan pelatihan SDM',
    image: '/images/gallery/education-1.jpg',
    category: 'Pendidikan',
    date: '2024-01-01'
  }
]

const categories = ['Semua', 'Pemerintahan', 'Pembangunan', 'Sosial', 'Budaya', 'Kesehatan', 'Pendidikan']

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <SidebarLayout title="Galeri">
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Cari foto atau video..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3E${item.title}%3C/text%3E%3C/svg%3E`
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='64' viewBox='0 0 96 64'%3E%3Crect width='96' height='64' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='10' fill='%236b7280'%3EImg%3C/text%3E%3C/svg%3E`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="outline">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
