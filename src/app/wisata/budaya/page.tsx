import { Layout } from '@/components/layout/Layout'
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
  Home,
  Shirt
} from 'lucide-react'

export default function WisataBudayaPage() {
  const culturalSites = [
    {
      id: 1,
      name: 'Desa Adat Raijua',
      location: 'Raijua',
      category: 'Desa Adat',
      description: 'Desa tradisional dengan rumah adat yang masih terjaga. Masyarakat masih menjalankan adat istiadat leluhur.',
      image: '/images/culture/desa-adat-raijua.jpg',
      rating: 4.8,
      duration: '3-4 jam',
      bestTime: 'Sepanjang tahun',
      highlights: ['Rumah Adat', 'Upacara Tradisional', 'Kerajinan Lokal', 'Cerita Rakyat'],
      activities: ['Homestay', 'Workshop', 'Cultural tour', 'Fotografi'],
      entrance: 'Rp 25.000'
    },
    {
      id: 2,
      name: 'Pusat Tenun Ikat Sabu',
      location: 'Sabu Tengah',
      category: 'Kerajinan',
      description: 'Pusat kerajinan tenun ikat tradisional dengan motif khas Sabu yang telah diwariskan turun-temurun.',
      image: '/images/culture/tenun-ikat.jpg',
      rating: 4.6,
      duration: '2-3 jam',
      bestTime: 'Sepanjang tahun',
      highlights: ['Proses Tenun', 'Motif Tradisional', 'Workshop', 'Galeri'],
      activities: ['Belajar menenun', 'Belanja souvenir', 'Fotografi', 'Workshop'],
      entrance: 'Rp 15.000'
    },
    {
      id: 3,
      name: 'Rumah Adat Sabu',
      location: 'Sabu Barat',
      category: 'Arsitektur',
      description: 'Rumah tradisional dengan arsitektur khas Sabu yang menggunakan bahan alami dan teknik tradisional.',
      image: '/images/culture/rumah-adat.jpg',
      rating: 4.5,
      duration: '1-2 jam',
      bestTime: 'Sepanjang tahun',
      highlights: ['Arsitektur Tradisional', 'Filosofi Bangunan', 'Ornamen Khas', 'Fungsi Ruang'],
      activities: ['Tur arsitektur', 'Fotografi', 'Edukasi budaya'],
      entrance: 'Rp 10.000'
    },
    {
      id: 4,
      name: 'Sanggar Tari Sabu',
      location: 'Sabu Tengah',
      category: 'Seni Pertunjukan',
      description: 'Sanggar yang melestarikan tarian tradisional Sabu dengan berbagai jenis tarian untuk upacara adat.',
      image: '/images/culture/tari-sabu.jpg',
      rating: 4.7,
      duration: '2 jam',
      bestTime: 'Sepanjang tahun',
      highlights: ['Tari Tradisional', 'Kostum Adat', 'Musik Tradisional', 'Cerita Tari'],
      activities: ['Pertunjukan tari', 'Belajar tari', 'Fotografi', 'Workshop'],
      entrance: 'Rp 20.000'
    }
  ]

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

  const culturalCategories = [
    { name: 'Desa Adat', count: 3, icon: Home, color: 'bg-blue-500' },
    { name: 'Kerajinan', count: 5, icon: Palette, color: 'bg-purple-500' },
    { name: 'Seni Pertunjukan', count: 4, icon: Music, color: 'bg-red-500' },
    { name: 'Arsitektur', count: 2, icon: Home, color: 'bg-green-500' }
  ]

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {culturalSites.map((site) => (
            <Card key={site.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-white text-gray-900">
                    {site.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{site.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold mb-1">{site.name}</h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{site.location}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <p className="text-gray-600 text-sm mb-4">{site.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{site.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{site.bestTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{site.entrance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-gray-400" />
                    <span>Foto diizinkan</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-1">
                    {site.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

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

                <Button className="w-full">
                  Lihat Detail & Booking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

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
