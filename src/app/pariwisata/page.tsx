import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Camera, 
  MapPin, 
  Star, 
  Calendar, 
  Users,
  Waves,
  Mountain,
  TreePine,
  Utensils,
  Bed,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PariwisataPage() {
  const featuredDestinations = [
    {
      id: 1,
      name: 'Pantai Namosain',
      category: 'Wisata Alam',
      location: 'Sabu Barat',
      description: 'Pantai indah dengan pasir putih dan air laut yang jernih, cocok untuk berenang dan snorkeling',
      image: '/images/destinations/pantai-namosain.jpg',
      rating: 4.5,
      visitors: '4,500/tahun',
      facilities: ['Parkir', 'Toilet', 'Warung'],
      bestTime: 'April - Oktober'
    },
    {
      id: 2,
      name: 'Desa Adat Raijua',
      category: 'Wisata Budaya',
      location: 'Raijua',
      description: 'Desa tradisional dengan rumah adat dan kebudayaan yang masih terjaga dengan baik',
      image: '/images/destinations/desa-adat-raijua.jpg',
      rating: 4.8,
      visitors: '2,500/tahun',
      facilities: ['Guide', 'Homestay', 'Souvenir'],
      bestTime: 'Sepanjang tahun'
    },
    {
      id: 3,
      name: 'Tenun Ikat Sabu',
      category: 'Wisata Budaya',
      location: 'Sabu Tengah',
      description: 'Pusat kerajinan tenun ikat tradisional dengan motif khas Sabu yang unik',
      image: '/images/destinations/tenun-ikat.jpg',
      rating: 4.6,
      visitors: '3,200/tahun',
      facilities: ['Workshop', 'Galeri', 'Toko'],
      bestTime: 'Sepanjang tahun'
    }
  ]

  const tourismCategories = [
    {
      title: 'Wisata Alam',
      description: 'Pantai, bukit, dan keindahan alam Sabu Raijua',
      icon: Waves,
      count: 12,
      href: '/wisata/alam',
      color: 'bg-blue-500'
    },
    {
      title: 'Wisata Budaya',
      description: 'Tradisi, adat istiadat, dan kerajinan lokal',
      icon: Camera,
      count: 8,
      href: '/wisata/budaya',
      color: 'bg-purple-500'
    },
    {
      title: 'Kuliner',
      description: 'Makanan dan minuman khas daerah',
      icon: Utensils,
      count: 15,
      href: '/wisata/kuliner',
      color: 'bg-orange-500'
    },
    {
      title: 'Akomodasi',
      description: 'Hotel, homestay, dan penginapan',
      icon: Bed,
      count: 6,
      href: '/wisata/akomodasi',
      color: 'bg-green-500'
    }
  ]

  const tourismStats = [
    { label: 'Destinasi Wisata', value: '35+', icon: MapPin },
    { label: 'Wisatawan/Tahun', value: '12,500', icon: Users },
    { label: 'Rating Rata-rata', value: '4.6', icon: Star },
    { label: 'Homestay', value: '25', icon: Bed }
  ]

  const upcomingEvents = [
    {
      name: 'Festival Tenun Sabu',
      date: '15-17 Agustus 2024',
      location: 'Sabu Tengah',
      description: 'Festival tahunan kerajinan tenun ikat tradisional'
    },
    {
      name: 'Pesta Laut Raijua',
      date: '20-22 September 2024',
      location: 'Raijua',
      description: 'Perayaan tradisional nelayan dan hasil laut'
    },
    {
      name: 'Sabu Cultural Week',
      date: '10-15 Oktober 2024',
      location: 'Seluruh Kabupaten',
      description: 'Minggu budaya dengan berbagai pertunjukan seni'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pariwisata Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jelajahi keindahan alam, kekayaan budaya, dan keramahan masyarakat 
            Sabu Raijua yang memikat hati setiap pengunjung.
          </p>
        </div>

        {/* Tourism Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {tourismStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Destinations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Destinasi Unggulan
            </h2>
            <Link href="/wisata">
              <Button variant="outline" className="flex items-center gap-2">
                Lihat Semua
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-white text-gray-900">
                      {destination.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {destination.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pengunjung:</span>
                      <span className="font-medium">{destination.visitors}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Waktu Terbaik:</span>
                      <span className="font-medium">{destination.bestTime}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Fasilitas:</p>
                    <div className="flex flex-wrap gap-1">
                      {destination.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tourism Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Kategori Wisata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tourismCategories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 ${category.color} rounded-full group-hover:scale-110 transition-transform`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    <Badge variant="outline" className="mb-3">
                      {category.count} destinasi
                    </Badge>
                    <div className="flex items-center justify-center text-blue-600 text-sm font-medium">
                      Jelajahi
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Event & Festival Mendatang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tourism Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Wisata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Akses Transportasi</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bandara Tardamu (Sabu)</li>
                    <li>• Pelabuhan Seba (Sabu)</li>
                    <li>• Transportasi darat antar kecamatan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Musim Terbaik</h4>
                  <p className="text-sm text-gray-600">
                    April - Oktober (musim kemarau) untuk aktivitas pantai dan outdoor
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mata Uang</h4>
                  <p className="text-sm text-gray-600">Rupiah (IDR)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Dinas Pariwisata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Alamat</h4>
                  <p className="text-sm text-gray-600">
                    Jl. Diponegoro No. 5, Seba<br />
                    Kabupaten Sabu Raijua<br />
                    Nusa Tenggara Timur 85391
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kontak</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Telepon: (0380) 21006</p>
                    <p>Email: dispar@saburajua.go.id</p>
                    <p>WhatsApp: +62 812-3456-7890</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Jam Pelayanan</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Senin - Kamis: 07:30 - 16:00 WITA</p>
                    <p>Jumat: 07:30 - 16:30 WITA</p>
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
