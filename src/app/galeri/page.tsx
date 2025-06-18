'use client'

import { useState, useEffect } from 'react'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface GalleryItem {
  _id: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl?: string
  category: string
  createdAt: string
  isPublished: boolean
}

interface GalleryResponse {
  success: boolean
  data: GalleryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const categories = ['Semua', 'Pemerintahan', 'Pembangunan', 'Sosial', 'Budaya', 'Kesehatan', 'Pendidikan']

// Fetch gallery items
async function fetchGalleryItems(params: {
  page: number
  category: string
  search: string
}): Promise<GalleryResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: '12',
    ...(params.category !== 'Semua' && { category: params.category }),
    ...(params.search && { search: params.search })
  })

  const response = await fetch(`/api/gallery?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch gallery items')
  }
  return response.json()
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  // Fetch gallery items with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['gallery', page, selectedCategory, searchTerm],
    queryFn: () => fetchGalleryItems({
      page,
      category: selectedCategory,
      search: searchTerm
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, searchTerm])

  const galleryItems = data?.data || []
  const pagination = data?.pagination

  if (error) {
    return (
      <SidebarLayout title="Galeri">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Gagal memuat galeri</p>
          <Button onClick={() => refetch()}>Coba Lagi</Button>
        </div>
      </SidebarLayout>
    )
  }

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.thumbnailUrl || item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3E${encodeURIComponent(item.title)}%3C/text%3E%3C/svg%3E`
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
                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
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
            {galleryItems.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.thumbnailUrl || item.imageUrl}
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
                          {new Date(item.createdAt).toLocaleDateString('id-ID')}
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

        {/* Empty State */}
        {!isLoading && galleryItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Tidak ada item galeri yang ditemukan</p>
            {(selectedCategory !== 'Semua' || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('Semua')
                  setSearchTerm('')
                }}
              >
                Reset Filter
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasPrev}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(
                  pagination.totalPages - 4,
                  Math.max(1, page - 2)
                )) + i

                if (pageNum <= pagination.totalPages) {
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={pageNum === page ? 'default' : 'outline'}
                      className={pageNum === page ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                }
                return null
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={!pagination.hasNext}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {!isLoading && pagination && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} item
          </div>
        )}
      </div>
    </SidebarLayout>
  )
}
