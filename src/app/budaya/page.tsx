'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Music, 
  Palette, 
  Home, 
  Utensils, 
  Calendar,
  Users,
  Star,
  Camera
} from 'lucide-react'

const BUDAYA_DATA = [
  {
    id: '1',
    category: 'Tarian Tradisional',
    icon: Music,
    color: 'blue',
    items: [
      {
        name: 'Tari Gong',
        description: 'Tarian sakral yang dipentaskan dalam upacara adat penting',
        origin: 'Pulau Sabu',
        significance: 'Tarian untuk menghormati leluhur dan memohon berkah',
        image: '/images/tari-gong.jpg'
      },
      {
        name: 'Tari Lego-Lego',
        description: 'Tarian pergaulan muda-mudi dalam acara pesta adat',
        origin: 'Pulau Raijua',
        significance: 'Sarana sosialisasi dan pelestarian budaya',
        image: '/images/tari-lego.jpg'
      },
      {
        name: 'Tari Danding',
        description: 'Tarian perang yang menggambarkan kepahlawanan',
        origin: 'Pulau Sabu',
        significance: 'Mengenang perjuangan para leluhur',
        image: '/images/tari-danding.jpg'
      }
    ]
  },
  {
    id: '2',
    category: 'Kerajinan Tradisional',
    icon: Palette,
    color: 'green',
    items: [
      {
        name: 'Tenun Ikat Sabu',
        description: 'Kain tenun dengan motif khas yang sarat makna filosofis',
        origin: 'Pulau Sabu',
        significance: 'Identitas budaya dan status sosial',
        image: '/images/tenun-sabu.jpg'
      },
      {
        name: 'Anyaman Lontar',
        description: 'Kerajinan dari daun lontar untuk berbagai keperluan',
        origin: 'Pulau Sabu & Raijua',
        significance: 'Kearifan lokal dalam memanfaatkan alam',
        image: '/images/anyaman-lontar.jpg'
      },
      {
        name: 'Ukiran Kayu',
        description: 'Seni ukir pada kayu dengan motif tradisional',
        origin: 'Pulau Sabu',
        significance: 'Dekorasi rumah adat dan peralatan upacara',
        image: '/images/ukiran-kayu.jpg'
      }
    ]
  },
  {
    id: '3',
    category: 'Arsitektur Tradisional',
    icon: Home,
    color: 'purple',
    items: [
      {
        name: 'Uma Kbubu',
        description: 'Rumah adat berbentuk kerucut dengan atap jerami',
        origin: 'Pulau Sabu',
        significance: 'Simbol kehidupan dan kosmologi masyarakat Sabu',
        image: '/images/uma-kbubu.jpg'
      },
      {
        name: 'Rumah Panggung',
        description: 'Rumah tradisional dengan konstruksi panggung',
        origin: 'Pulau Raijua',
        significance: 'Adaptasi terhadap kondisi alam dan iklim',
        image: '/images/rumah-panggung.jpg'
      }
    ]
  },
  {
    id: '4',
    category: 'Kuliner Tradisional',
    icon: Utensils,
    color: 'red',
    items: [
      {
        name: 'Jagung Bose',
        description: 'Makanan pokok dari jagung yang diolah khusus',
        origin: 'Pulau Sabu & Raijua',
        significance: 'Makanan tradisional pengganti nasi',
        image: '/images/jagung-bose.jpg'
      },
      {
        name: 'Ikan Kayu',
        description: 'Ikan yang diawetkan dengan cara diasap',
        origin: 'Pulau Sabu & Raijua',
        significance: 'Kearifan lokal dalam pengawetan makanan',
        image: '/images/ikan-kayu.jpg'
      },
      {
        name: 'Sopi',
        description: 'Minuman tradisional dari nira lontar',
        origin: 'Pulau Sabu & Raijua',
        significance: 'Minuman dalam upacara adat dan penyambutan tamu',
        image: '/images/sopi.jpg'
      }
    ]
  }
]

const FESTIVAL_DATA = [
  {
    name: 'Festival Tenun Ikat',
    date: 'Agustus',
    description: 'Pameran dan kompetisi tenun ikat tradisional',
    location: 'Seba, Sabu Tengah'
  },
  {
    name: 'Festival Budaya Sabu Raijua',
    date: 'Oktober',
    description: 'Perayaan budaya dengan berbagai pertunjukan tradisional',
    location: 'Seluruh Kabupaten'
  },
  {
    name: 'Pesta Laut',
    date: 'November',
    description: 'Syukuran hasil laut dan pelestarian budaya maritim',
    location: 'Pesisir Pantai'
  }
]

const colorClasses = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100',
  red: 'text-red-600 bg-red-100'
}

export default function BudayaPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budaya Sabu Raijua</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kekayaan budaya Kabupaten Sabu Raijua yang telah diwariskan turun-temurun 
            dan tetap lestari hingga kini
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
            <img
              src="/images/budaya-hero.jpg"
              alt="Budaya Sabu Raijua"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='320' viewBox='0 0 1200 320'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23fbbf24;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f59e0b;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='320' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='32' fill='%23ffffff'%3EBudaya Sabu Raijua%3C/text%3E%3C/svg%3E"
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-2">Warisan Budaya Nusantara</h2>
                <p className="text-xl">Pulau Sabu & Pulau Raijua</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Categories */}
        <div className="space-y-12">
          {BUDAYA_DATA.map((category) => {
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
                  {category.items.map((item, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3E${encodeURIComponent(item.name)}%3C/text%3E%3C/svg%3E`
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white text-gray-800">
                            {item.origin}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Makna & Filosofi:</p>
                            <p className="text-sm text-gray-600">{item.significance}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button className="w-full" variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Lihat Galeri
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

        {/* Festival & Events */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600 mr-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Festival & Acara Budaya</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FESTIVAL_DATA.map((festival, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{festival.name}</CardTitle>
                    <Badge variant="secondary">{festival.date}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{festival.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {festival.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cultural Preservation */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-600" />
              Pelestarian Budaya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Program Pelestarian</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Dokumentasi budaya tradisional
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Pelatihan kerajinan tradisional
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Festival budaya tahunan
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Pendidikan budaya di sekolah
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tantangan & Upaya</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Regenerasi pengrajin muda
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Modernisasi tanpa kehilangan nilai tradisional
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Promosi budaya melalui pariwisata
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Kolaborasi dengan institusi pendidikan
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-gray-600 mb-4">
                Mari bersama-sama melestarikan warisan budaya untuk generasi mendatang
              </p>
              <Button>
                Dukung Pelestarian Budaya
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
