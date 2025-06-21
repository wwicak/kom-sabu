'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'

interface GalleryItem {
  _id: string
  title: string
  description: string
  category: string
  images: Array<{
    url: string
    caption?: string
    alt?: string
  }>
  author: {
    fullName: string
    username: string
  }
  createdAt: string
  statistics: {
    views: number
  }
  tags: string[]
}

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [gallery, setGallery] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`/api/gallery/${params.id}`)
        if (!response.ok) {
          throw new Error('Gallery item not found')
        }

        const data = await response.json()
        setGallery(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery item')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchGallery()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViews = (views: number) => {
    return new Intl.NumberFormat('id-ID').format(views)
  }

  const handleShare = async () => {
    if (navigator.share && gallery) {
      try {
        await navigator.share({
          title: gallery.title,
          text: gallery.description,
          url: window.location.href,
        })
      } catch {
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const nextImage = () => {
    if (gallery && gallery.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === gallery.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (gallery && gallery.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? gallery.images.length - 1 : prev - 1
      )
    }
  }

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

  if (error || !gallery) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Galeri Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Galeri yang Anda cari tidak dapat ditemukan.'}</p>
            <Button onClick={() => router.push('/galeri')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Galeri
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
            onClick={() => router.push('/galeri')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Galeri
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            {gallery.images && gallery.images.length > 0 && (
              <div className="mb-6">
                <div
                  className="relative h-64 md:h-96 mb-4 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Image
                    src={gallery.images[selectedImageIndex]?.url}
                    alt={gallery.images[selectedImageIndex]?.alt || gallery.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {gallery.images[selectedImageIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {gallery.images[selectedImageIndex].caption}
                    </div>
                  )}

                  {/* Navigation arrows for multiple images */}
                  {gallery.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {gallery.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {gallery.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `${gallery.title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{gallery.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {formatViews(gallery.statistics.views)} views
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {gallery.title}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {gallery.author.fullName}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(gallery.createdAt)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(
                      gallery.images[selectedImageIndex]?.url || '',
                      `${gallery.title}-${selectedImageIndex + 1}.jpg`
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Unduh
                  </Button>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {gallery.description}
              </p>
            </div>

            {/* Tags */}
            {gallery.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {gallery.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Galeri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Kategori:</span>
                    <p className="text-gray-600">{gallery.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Jumlah Foto:</span>
                    <p className="text-gray-600">{gallery.images.length} foto</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Dibuat oleh:</span>
                    <p className="text-gray-600">{gallery.author.fullName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Tanggal:</span>
                    <p className="text-gray-600">{formatDate(gallery.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Dilihat:</span>
                    <p className="text-gray-600">{formatViews(gallery.statistics.views)} kali</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Lightbox */}
        {isLightboxOpen && gallery.images && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative max-w-4xl max-h-full p-4">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-6 w-6" />
              </button>

              <Image
                src={gallery.images[selectedImageIndex]?.url}
                alt={gallery.images[selectedImageIndex]?.alt || gallery.title}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />

              {gallery.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
