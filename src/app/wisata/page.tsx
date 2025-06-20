'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, 
  Camera, 
  Star, 
  Clock,
  Waves,
  Mountain,
  TreePine,
  Building,
  Compass,
  Phone
} from 'lucide-react'

const WISATA_DATA = [
  {
    id: '1',
    category: 'Wisata Pantai',
    icon: Waves,
    color: 'blue',
    destinations: [
      {
        name: 'Pantai Namosain',
        location: 'Sabu Timur',
        description: 'Pantai dengan pasir putih dan air laut yang jernih, cocok untuk berenang dan snorkeling',
        rating: 4.5,
        facilities: ['Parkir', 'Warung', 'Toilet', 'Gazebo'],
        activities: ['Berenang', 'Snorkeling', 'Fotografi', 'Memancing'],
        bestTime: 'April - Oktober',
        image: '/images/pantai-namosain.jpg'
      },
      {
        name: 'Pantai Rae Hawu',
        location: 'Sabu Barat',
        description: 'Pantai eksotis dengan formasi batu karang yang unik dan sunset yang memukau',
        rating: 4.7,
        facilities: ['Parkir', 'Warung', 'Homestay'],
        activities: ['Sunset Viewing', 'Fotografi', 'Berenang'],
        bestTime: 'Mei - September',
        image: '/images/pantai-rae-hawu.jpg'
      },
      {
        name: 'Pantai Raijua',
        location: 'Raijua',
        description: 'Pantai terpencil dengan keindahan alam yang masih alami dan air laut yang biru jernih',
        rating: 4.6,
        facilities: ['Parkir', 'Warung Sederhana'],
        activities: ['Berenang', 'Diving', 'Island Hopping'],
        bestTime: 'April - November',
        image: '/images/pantai-raijua.jpg'
      }
    ]
  },
  {
    id: '2',
    category: 'Wisata Alam',
    icon: Mountain,
    color: 'green',
    destinations: [
      {
        name: 'Bukit Wairinding',
        location: 'Sabu Tengah',
        description: 'Bukit tertinggi di Pulau Sabu dengan pemandangan 360 derajat yang spektakuler',
        rating: 4.4,
        facilities: ['Jalur Pendakian', 'Pos Istirahat', 'Parkir'],
        activities: ['Hiking', 'Fotografi', 'Camping', 'Sunrise Viewing'],
        bestTime: 'April - Oktober',
        image: '/images/bukit-wairinding.jpg'
      },
      {
        name: 'Hutan Lontar',
        location: 'Sabu Barat',
        description: 'Hutan lontar yang luas dengan ekosistem unik dan tradisi pengolahan nira',
        rating: 4.2,
        facilities: ['Jalur Trekking', 'Shelter', 'Parkir'],
        activities: ['Trekking', 'Bird Watching', 'Edukasi Lontar'],
        bestTime: 'Mei - September',
        image: '/images/hutan-lontar.jpg'
      }
    ]
  },
  {
    id: '3',
    category: 'Wisata Budaya',
    icon: Building,
    color: 'purple',
    destinations: [
      {
        name: 'Kampung Adat Namata',
        location: 'Sabu Tengah',
        description: 'Kampung tradisional dengan rumah adat Uma Kbubu yang masih terjaga keasliannya',
        rating: 4.8,
        facilities: ['Parkir', 'Pemandu Wisata', 'Homestay'],
        activities: ['Cultural Tour', 'Fotografi', 'Belajar Tenun'],
        bestTime: 'Sepanjang Tahun',
        image: '/images/kampung-namata.jpg'
      },
      {
        name: 'Museum Budaya Sabu',
        location: 'Seba',
        description: 'Museum yang menyimpan koleksi artefak dan benda-benda bersejarah Sabu Raijua',
        rating: 4.3,
        facilities: ['Parkir', 'Pemandu', 'Toilet', 'Souvenir Shop'],
        activities: ['Museum Tour', 'Edukasi Sejarah', 'Workshop'],
        bestTime: 'Sepanjang Tahun',
        image: '/images/museum-budaya.jpg'
      }
    ]
  },
  {
    id: '4',
    category: 'Wisata Religi',
    icon: TreePine,
    color: 'yellow',
    destinations: [
      {
        name: 'Gereja Tua Seba',
        location: 'Seba',
        description: 'Gereja bersejarah dengan arsitektur kolonial yang menjadi landmark kota Seba',
        rating: 4.1,
        facilities: ['Parkir', 'Toilet'],
        activities: ['Ibadah', 'Fotografi', 'Tur Sejarah'],
        bestTime: 'Sepanjang Tahun',
        image: '/images/gereja-seba.jpg'
      }
    ]
  }
]

const PAKET_WISATA = [
  {
    name: 'Sabu Island Explorer',
    duration: '3 Hari 2 Malam',
    price: 'Rp 1.500.000',
    includes: ['Transportasi', 'Akomodasi', 'Makan', 'Pemandu'],
    highlights: ['Pantai Namosain', 'Kampung Adat', 'Bukit Wairinding']
  },
  {
    name: 'Raijua Adventure',
    duration: '2 Hari 1 Malam',
    price: 'Rp 1.200.000',
    includes: ['Transportasi Laut', 'Homestay', 'Makan', 'Snorkeling'],
    highlights: ['Pantai Raijua', 'Diving', 'Island Hopping']
  },
  {
    name: 'Cultural Heritage Tour',
    duration: '4 Hari 3 Malam',
    price: 'Rp 2.000.000',
    includes: ['Transportasi', 'Hotel', 'Makan', 'Workshop Tenun'],
    highlights: ['Museum Budaya', 'Kampung Adat', 'Festival Budaya']
  }
]

const colorClasses = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100',
  yellow: 'text-yellow-600 bg-yellow-100'
}

export default function WisataPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredData = selectedCategory 
    ? WISATA_DATA.filter(category => category.id === selectedCategory)
    : WISATA_DATA

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wisata Sabu Raijua</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Jelajahi keindahan alam, budaya, dan tradisi yang memukau di Kabupaten Sabu Raijua
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <img
              src="/images/wisata-hero.jpg"
              alt="Wisata Sabu Raijua"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='320' viewBox='0 0 1200 320'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2306b6d4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230891b2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='320' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='32' fill='%23ffffff'%3EWisata Sabu Raijua%3C/text%3E%3C/svg%3E"
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-2">Destinasi Wisata Eksotis</h2>
                <p className="text-xl">Pulau Sabu & Pulau Raijua</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Semua Kategori
          </Button>
          {WISATA_DATA.map((category) => {
            const IconComponent = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {category.category}
              </Button>
            )
          })}
        </div>

        {/* Destinations */}
        <div className="space-y-12">
          {filteredData.map((category) => {
            const IconComponent = category.icon
            const colorClass = colorClasses[category.color as keyof typeof colorClasses]
            
            return (
              <div key={category.id}>
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg ${colorClass} mr-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.destinations.map((destination, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3E${encodeURIComponent(destination.name)}%3C/text%3E%3C/svg%3E`
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white text-gray-800">
                            <MapPin className="h-3 w-3 mr-1" />
                            {destination.location}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            {destination.rating}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg">{destination.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600 mb-4">{destination.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900 text-sm mb-1">Fasilitas:</p>
                            <div className="flex flex-wrap gap-1">
                              {destination.facilities.map((facility, facilityIndex) => (
                                <Badge key={facilityIndex} variant="outline" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-gray-900 text-sm mb-1">Aktivitas:</p>
                            <div className="flex flex-wrap gap-1">
                              {destination.activities.map((activity, activityIndex) => (
                                <Badge key={activityIndex} variant="secondary" className="text-xs">
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Waktu Terbaik: {destination.bestTime}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button className="w-full" variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tour Packages */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Paket Wisata</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAKET_WISATA.map((paket, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{paket.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{paket.duration}</Badge>
                    <span className="text-xl font-bold text-blue-600">{paket.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-2">Termasuk:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {paket.includes.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 text-sm mb-2">Highlight:</p>
                      <div className="flex flex-wrap gap-1">
                        {paket.highlights.map((highlight, highlightIndex) => (
                          <Badge key={highlightIndex} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4">
                    <Phone className="h-4 w-4 mr-2" />
                    Hubungi Kami
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Travel Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Tips Perjalanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Transportasi</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Penerbangan dari Kupang ke Seba (30 menit)</li>
                  <li>• Kapal ferry dari Kupang (4-6 jam)</li>
                  <li>• Sewa motor/mobil di lokasi</li>
                  <li>• Ojek untuk jarak dekat</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Persiapan</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Bawa sunscreen dan topi</li>
                  <li>• Siapkan uang tunai</li>
                  <li>• Pakaian nyaman untuk trekking</li>
                  <li>• Kamera untuk dokumentasi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
