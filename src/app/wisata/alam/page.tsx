'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Waves,
  Mountain,
  TreePine,
  MapPin,
  Star,
  Camera,
  Clock,
  Users,
  Car,
  Info
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
}

export default function WisataAlamPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/destinations?category=wisata-alam&limit=20')
      if (!response.ok) {
        throw new Error('Failed to fetch destinations')
      }

      const data = await response.json()
      if (data.success) {
        setDestinations(data.data.destinations || data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch destinations')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch destinations')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratis'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency || 'IDR'
    }).format(price)
  }

  // Dynamic categories based on fetched destinations
  const getCategories = () => {
    const categoryCount: { [key: string]: number } = {}
    destinations.forEach(dest => {
      const category = dest.subcategory || dest.category
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
      icon: name.toLowerCase().includes('pantai') ? Waves :
        name.toLowerCase().includes('bukit') || name.toLowerCase().includes('gunung') ? Mountain :
          name.toLowerCase().includes('hutan') || name.toLowerCase().includes('mangrove') ? TreePine :
            Waves,
      color: name.toLowerCase().includes('pantai') ? 'bg-blue-500' :
        name.toLowerCase().includes('bukit') || name.toLowerCase().includes('gunung') ? 'bg-green-500' :
          name.toLowerCase().includes('hutan') || name.toLowerCase().includes('mangrove') ? 'bg-emerald-500' :
            'bg-cyan-500'
    }))
  }

  const categories = getCategories()

  const tips = [
    {
      title: 'Persiapan Perjalanan',
      items: [
        'Bawa perlengkapan snorkeling sendiri',
        'Gunakan sunscreen dengan SPF tinggi',
        'Bawa air minum yang cukup',
        'Kenakan alas kaki yang nyaman'
      ]
    },
    {
      title: 'Keselamatan',
      items: [
        'Selalu berenang di area yang aman',
        'Jangan berenang sendirian',
        'Perhatikan kondisi cuaca dan gelombang',
        'Ikuti petunjuk guide lokal'
      ]
    },
    {
      title: 'Lingkungan',
      items: [
        'Jangan membuang sampah sembarangan',
        'Jangan mengambil karang atau biota laut',
        'Gunakan sunscreen yang ramah lingkungan',
        'Hormati habitat satwa liar'
      ]
    }
  ]

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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wisata Alam Sabu Raijua</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDestinations}>Coba Lagi</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Wisata', href: '/wisata' },
              { label: 'Wisata Alam', current: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wisata Alam Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jelajahi keindahan alam Sabu Raijua yang memukau, dari pantai berpasir putih
            hingga bukit dengan pemandangan spektakuler.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <div className={`p-2 ${category.color} rounded-full`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} destinasi</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Destinations */}
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {destinations.map((destination) => (
              <Card key={destination._id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {destination.images && destination.images.length > 0 && (
                    <Image
                      src={destination.images[0].url}
                      alt={destination.images[0].alt || destination.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white text-gray-900">
                      {destination.subcategory || destination.category}
                    </Badge>
                  </div>
                  {destination.statistics.rating > 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{destination.statistics.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.location.village}, {destination.location.district}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{destination.accessibility.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{destination.accessibility.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span>{formatPrice(destination.entryFee.local, destination.entryFee.currency)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span>{destination.bestTimeToVisit}</span>
                    </div>
                  </div>

                  {destination.activities && destination.activities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Aktivitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {destination.activities.map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {destination.facilities && destination.facilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Fasilitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {destination.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Akses
                    </h4>
                    <p className="text-blue-800 text-sm">{destination.accessibility.transportation}</p>
                    {destination.location.address && (
                      <p className="text-blue-800 text-sm mt-1">{destination.location.address}</p>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => router.push(`/wisata/${destination.slug}`)}
                  >
                    Lihat Detail & Rute
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum ada destinasi wisata alam yang tersedia.</p>
            <Button onClick={fetchDestinations}>Muat Ulang</Button>
          </div>
        )}

        {/* Tips */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tips Wisata Alam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi & Bantuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Dinas Pariwisata</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Telepon: (0380) 21006</p>
                  <p>WhatsApp: +62 812-3456-7890</p>
                  <p>Email: dispar@saburajua.go.id</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Guide Lokal</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Yohanes Rihi: +62 813-1234-5678</p>
                  <p>Maria Seran: +62 814-2345-6789</p>
                  <p>Tarif: Rp 150.000 - 300.000/hari</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
