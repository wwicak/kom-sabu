'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Camera,
  Users,
  Clock,
  MapPin,
  Star,
  Calendar,
  Music,
  Palette,
  Home
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

export default function WisataBudayaPage() {
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
      const response = await fetch('/api/destinations?category=wisata-budaya&limit=20')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wisata Budaya Sabu Raijua</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchDestinations}>Coba Lagi</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const culturalSites = destinations // Use CMS data instead of mock data

  const culturalEvents = [
    {
      name: 'Festival Tenun Sabu',
      date: '15-17 Agustus',
      location: 'Sabu Tengah',
      description: 'Festival tahunan yang menampilkan kerajinan tenun ikat dari seluruh Sabu Raijua',
      activities: ['Pameran tenun', 'Kompetisi', 'Workshop', 'Pasar rakyat']
    },
    {
      name: 'Pesta Adat Raijua',
      date: '20-22 September',
      location: 'Raijua',
      description: 'Perayaan adat tradisional masyarakat Raijua dengan berbagai ritual dan pertunjukan',
      activities: ['Upacara adat', 'Tarian tradisional', 'Musik tradisional', 'Kuliner khas']
    },
    {
      name: 'Sabu Cultural Week',
      date: '10-15 Oktober',
      location: 'Seluruh Kabupaten',
      description: 'Minggu budaya dengan berbagai pertunjukan seni dan pameran budaya',
      activities: ['Pertunjukan seni', 'Pameran budaya', 'Seminar', 'Lomba tradisional']
    }
  ]

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
      icon: name.toLowerCase().includes('desa') || name.toLowerCase().includes('rumah') ? Home :
        name.toLowerCase().includes('kerajinan') || name.toLowerCase().includes('tenun') ? Palette :
          name.toLowerCase().includes('seni') || name.toLowerCase().includes('tari') || name.toLowerCase().includes('musik') ? Music :
            Home,
      color: name.toLowerCase().includes('desa') ? 'bg-blue-500' :
        name.toLowerCase().includes('kerajinan') ? 'bg-purple-500' :
          name.toLowerCase().includes('seni') ? 'bg-red-500' :
            'bg-green-500'
    }))
  }

  const culturalCategories = getCategories()

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wisata Budaya Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jelajahi kekayaan budaya dan tradisi masyarakat Sabu Raijua yang telah
            diwariskan turun-temurun selama berabad-abad.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {culturalCategories.map((category, index) => (
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

        {/* Cultural Sites */}
        {culturalSites.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {culturalSites.map((site) => (
              <Card key={site._id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {site.images && site.images.length > 0 && (
                    <Image
                      src={site.images[0].url}
                      alt={site.images[0].alt || site.name}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white text-gray-900">
                      {site.subcategory || site.category}
                    </Badge>
                  </div>
                  {site.statistics.rating > 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{site.statistics.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h3 className="text-xl font-bold mb-1">{site.name}</h3>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{site.location.village}, {site.location.district}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{site.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{site.accessibility.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{site.bestTimeToVisit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{formatPrice(site.entryFee.local, site.entryFee.currency)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span>Foto diizinkan</span>
                    </div>
                  </div>

                  {site.activities && site.activities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Aktivitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {site.activities.map((activity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {site.facilities && site.facilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Fasilitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {site.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => router.push(`/wisata/${site.slug}`)}
                  >
                    Lihat Detail & Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Belum ada destinasi wisata budaya yang tersedia.</p>
            <Button onClick={fetchDestinations}>Muat Ulang</Button>
          </div>
        )}

        {/* Cultural Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Event Budaya Tahunan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {culturalEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Aktivitas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.activities.map((activity, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cultural Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Etika Wisata Budaya</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Hormati adat istiadat dan tradisi setempat
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Berpakaian sopan saat mengunjungi tempat suci
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Minta izin sebelum memotret orang atau upacara
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Ikuti petunjuk guide lokal
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                  Jangan menyentuh benda-benda suci tanpa izin
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dinas Pariwisata</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Telepon: (0380) 21006</p>
                    <p>WhatsApp: +62 812-3456-7890</p>
                    <p>Email: dispar@saburajua.go.id</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Guide Budaya</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Maria Haning: +62 813-2345-6789</p>
                    <p>Kornelius Rihi: +62 814-3456-7890</p>
                    <p>Tarif: Rp 200.000 - 400.000/hari</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
