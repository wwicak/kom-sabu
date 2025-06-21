'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Star,
  Clock,
  Calendar,
  Camera,
  Navigation,
  ArrowLeft,
  Share2,
  Eye,
  Phone,
  Globe
} from 'lucide-react'

interface Destination {
  _id: string
  name: string
  slug: string
  description: string
  category: string
  subcategory: string
  location: {
    district: string
    village: string
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  images: Array<{
    url: string
    caption?: string
    alt?: string
  }>
  facilities: string[]
  activities: string[]
  bestTimeToVisit: string
  entryFee: {
    local: number
    foreign: number
    currency: string
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  statistics: {
    views: number
    rating: number
    reviewCount: number
  }
  accessibility: {
    transportation: string
    difficulty: string
    duration: string
  }
  tips: string[]
  createdAt: string
  updatedAt: string
}

export default function DestinationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${params.slug}`)
        if (!response.ok) {
          throw new Error('Destination not found')
        }

        const data = await response.json()
        setDestination(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load destination')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchDestination()
    }
  }, [params.slug])

  const formatViews = (views: number) => {
    return new Intl.NumberFormat('id-ID').format(views)
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency || 'IDR'
    }).format(price)
  }

  const handleShare = async () => {
    if (navigator.share && destination) {
      try {
        await navigator.share({
          title: destination.name,
          text: destination.description,
          url: window.location.href,
        })
      } catch (err) {
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const openMaps = () => {
    if (destination?.location.coordinates) {
      const { latitude, longitude } = destination.location.coordinates
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`
      window.open(url, '_blank')
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

  if (error || !destination) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Destinasi Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Destinasi yang Anda cari tidak dapat ditemukan.'}</p>
            <Button onClick={() => router.push('/wisata')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Wisata
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
            onClick={() => router.push('/wisata')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Wisata
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {destination.images && destination.images.length > 0 && (
              <div className="mb-6">
                <div className="relative h-64 md:h-96 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={destination.images[selectedImageIndex]?.url}
                    alt={destination.images[selectedImageIndex]?.alt || destination.name}
                    fill
                    className="object-cover"
                  />
                  {destination.images[selectedImageIndex]?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {destination.images[selectedImageIndex].caption}
                    </div>
                  )}
                </div>

                {destination.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {destination.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt || `${destination.name} ${index + 1}`}
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

            {/* Destination Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{destination.category}</Badge>
                <Badge variant="outline">{destination.subcategory}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="h-4 w-4 mr-1" />
                  {formatViews(destination.statistics.views)} views
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {destination.name}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {destination.location.village}, {destination.location.district}
                    </span>
                  </div>
                  {destination.statistics.rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {destination.statistics.rating.toFixed(1)} ({destination.statistics.reviewCount} ulasan)
                      </span>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Facilities & Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {destination.facilities && destination.facilities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fasilitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {destination.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          {facility}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {destination.activities && destination.activities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aktivitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {destination.activities.map((activity, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tips */}
            {destination.tips && destination.tips.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Tips Berkunjung</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {destination.tips.map((tip, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Informasi Kunjungan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Waktu Terbaik
                  </h4>
                  <p className="text-sm text-gray-600">{destination.bestTimeToVisit}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Tiket Masuk</h4>
                  <p className="text-sm text-gray-600">
                    Lokal: {formatPrice(destination.entryFee.local, destination.entryFee.currency)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Asing: {formatPrice(destination.entryFee.foreign, destination.entryFee.currency)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Durasi Kunjungan
                  </h4>
                  <p className="text-sm text-gray-600">{destination.accessibility.duration}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Tingkat Kesulitan</h4>
                  <Badge variant="outline">{destination.accessibility.difficulty}</Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1">Transportasi</h4>
                  <p className="text-sm text-gray-600">{destination.accessibility.transportation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Location */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Kontak & Lokasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">Alamat</h4>
                  <p className="text-sm text-gray-600">{destination.location.address}</p>
                </div>

                {destination.contact.phone && (
                  <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Telepon
                    </h4>
                    <p className="text-sm text-gray-600">{destination.contact.phone}</p>
                  </div>
                )}

                {destination.contact.website && (
                  <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </h4>
                    <a
                      href={destination.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {destination.contact.website}
                    </a>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={openMaps}
                  disabled={!destination.location.coordinates}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Lihat di Peta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
