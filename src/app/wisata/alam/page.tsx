'use client'

import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export default function WisataAlamPage() {
  const router = useRouter()
  const naturalDestinations = [
    {
      id: 1,
      name: 'Pantai Namosain',
      slug: 'pantai-namosain',
      location: 'Sabu Barat',
      category: 'Pantai',
      description: 'Pantai dengan pasir putih yang halus dan air laut jernih berwarna biru kehijauan. Cocok untuk berenang, snorkeling, dan menikmati sunset.',
      image: '/images/destinations/pantai-namosain.jpg',
      rating: 4.5,
      difficulty: 'Mudah',
      duration: '2-3 jam',
      bestTime: 'April - Oktober',
      facilities: ['Parkir', 'Toilet', 'Warung', 'Gazebo'],
      activities: ['Berenang', 'Snorkeling', 'Fotografi', 'Sunset viewing'],
      access: 'Jalan aspal 15 km dari pusat kota Seba',
      entrance: 'Gratis'
    },
    {
      id: 2,
      name: 'Pantai Pasir Putih Raijua',
      slug: 'pantai-pasir-putih-raijua',
      location: 'Raijua',
      category: 'Pantai',
      description: 'Pantai eksotis dengan pasir putih yang sangat halus dan air laut yang tenang. Dikelilingi oleh tebing karang yang indah.',
      image: '/images/destinations/pantai-raijua.jpg',
      rating: 4.8,
      difficulty: 'Mudah',
      duration: '3-4 jam',
      bestTime: 'Mei - September',
      facilities: ['Parkir', 'Homestay', 'Warung'],
      activities: ['Berenang', 'Diving', 'Memancing', 'Camping'],
      access: 'Perahu dari Pelabuhan Seba (1 jam), lalu jalan kaki 20 menit',
      entrance: 'Rp 10.000'
    },
    {
      id: 3,
      name: 'Bukit Tardamu',
      slug: 'bukit-tardamu',
      location: 'Sabu Tengah',
      category: 'Bukit',
      description: 'Bukit dengan pemandangan 360 derajat ke seluruh Pulau Sabu. Tempat terbaik untuk melihat sunrise dan sunset.',
      image: '/images/destinations/bukit-tardamu.jpg',
      rating: 4.6,
      difficulty: 'Sedang',
      duration: '1-2 jam',
      bestTime: 'Sepanjang tahun',
      facilities: ['Parkir', 'Gazebo', 'Toilet'],
      activities: ['Hiking', 'Fotografi', 'Sunrise/sunset viewing'],
      access: 'Jalan aspal 8 km dari Sabu Tengah, trekking 30 menit',
      entrance: 'Rp 5.000'
    },
    {
      id: 4,
      name: 'Mata Air Raijua',
      location: 'Raijua',
      category: 'Mata Air',
      description: 'Mata air alami dengan air yang jernih dan segar. Dikelilingi oleh vegetasi tropis yang rimbun.',
      image: '/images/destinations/mata-air-raijua.jpg',
      rating: 4.3,
      difficulty: 'Mudah',
      duration: '1-2 jam',
      bestTime: 'Sepanjang tahun',
      facilities: ['Parkir', 'Gazebo'],
      activities: ['Berendam', 'Fotografi', 'Piknik'],
      access: 'Jalan setapak 1 km dari Desa Raijua',
      entrance: 'Gratis'
    },
    {
      id: 5,
      name: 'Hutan Mangrove Liae',
      location: 'Sabu Liae',
      category: 'Hutan',
      description: 'Kawasan hutan mangrove yang masih alami dengan keanekaragaman hayati yang tinggi. Habitat berbagai jenis burung.',
      image: '/images/destinations/mangrove-liae.jpg',
      rating: 4.4,
      difficulty: 'Mudah',
      duration: '2-3 jam',
      bestTime: 'April - Oktober',
      facilities: ['Jembatan kayu', 'Gazebo', 'Toilet'],
      activities: ['Bird watching', 'Fotografi', 'Edukasi lingkungan'],
      access: 'Jalan aspal 12 km dari Liae',
      entrance: 'Rp 15.000'
    },
    {
      id: 6,
      name: 'Pantai Batu Karang Mehara',
      location: 'Hawu Mehara',
      category: 'Pantai',
      description: 'Pantai dengan formasi batu karang yang unik dan air laut yang jernih. Cocok untuk snorkeling dan diving.',
      image: '/images/destinations/pantai-mehara.jpg',
      rating: 4.7,
      difficulty: 'Sedang',
      duration: '3-4 jam',
      bestTime: 'Mei - September',
      facilities: ['Parkir', 'Warung'],
      activities: ['Snorkeling', 'Diving', 'Rock climbing', 'Fotografi'],
      access: 'Jalan berbatu 20 km dari Mehara',
      entrance: 'Rp 8.000'
    }
  ]

  const categories = [
    { name: 'Pantai', count: 4, icon: Waves, color: 'bg-blue-500' },
    { name: 'Bukit', count: 1, icon: Mountain, color: 'bg-green-500' },
    { name: 'Hutan', count: 1, icon: TreePine, color: 'bg-emerald-500' },
    { name: 'Mata Air', count: 1, icon: Waves, color: 'bg-cyan-500' }
  ]

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {naturalDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-white text-gray-900">
                    {destination.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{destination.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{destination.entrance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-400" />
                    <span>{destination.bestTime}</span>
                  </div>
                </div>

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

                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Akses
                  </h4>
                  <p className="text-blue-800 text-sm">{destination.access}</p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => router.push(`/wisata/${destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  Lihat Detail & Rute
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
