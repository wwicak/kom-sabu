import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bed, 
  Home, 
  Building, 
  MapPin, 
  Star,
  Wifi,
  Car,
  Utensils,
  Phone,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react'

export default function WisataAkomodasiPage() {
  const accommodations = [
    {
      id: 1,
      name: 'Hotel Sabu Plaza',
      location: 'Seba, Sabu Tengah',
      type: 'Hotel',
      category: 'Budget',
      description: 'Hotel nyaman di pusat kota Seba dengan fasilitas lengkap dan akses mudah ke berbagai destinasi wisata.',
      image: '/images/accommodation/hotel-sabu-plaza.jpg',
      rating: 4.2,
      priceRange: 'Rp 250.000 - 450.000',
      rooms: 24,
      phone: '+62 380-21100',
      facilities: ['WiFi gratis', 'AC', 'TV', 'Kamar mandi dalam', 'Parkir', 'Restoran'],
      services: ['Laundry', 'Tour guide', 'Antar jemput bandara', '24 jam']
    },
    {
      id: 2,
      name: 'Homestay Raijua Traditional',
      location: 'Raijua',
      type: 'Homestay',
      category: 'Cultural',
      description: 'Pengalaman menginap autentik di rumah tradisional Raijua dengan keramahan masyarakat lokal.',
      image: '/images/accommodation/homestay-raijua.jpg',
      rating: 4.8,
      priceRange: 'Rp 150.000 - 300.000',
      rooms: 6,
      phone: '+62 813-1234-5678',
      facilities: ['Kamar tradisional', 'Kamar mandi bersama', 'Dapur bersama', 'Teras', 'WiFi'],
      services: ['Makanan tradisional', 'Cultural tour', 'Aktivitas budaya', 'Guide lokal']
    },
    {
      id: 3,
      name: 'Penginapan Pantai Namosain',
      location: 'Sabu Barat',
      type: 'Guesthouse',
      category: 'Beach',
      description: 'Penginapan sederhana dengan pemandangan pantai yang indah, cocok untuk backpacker dan keluarga.',
      image: '/images/accommodation/penginapan-namosain.jpg',
      rating: 4.0,
      priceRange: 'Rp 100.000 - 250.000',
      rooms: 12,
      phone: '+62 814-2345-6789',
      facilities: ['Pemandangan pantai', 'Kipas angin', 'Kamar mandi dalam', 'Teras', 'Parkir'],
      services: ['Rental sepeda', 'Info wisata', 'Antar jemput', 'Snorkeling gear']
    },
    {
      id: 4,
      name: 'Villa Sunset Sabu',
      location: 'Sabu Timur',
      type: 'Villa',
      category: 'Luxury',
      description: 'Villa mewah dengan pemandangan sunset yang spektakuler dan fasilitas premium untuk liburan eksklusif.',
      image: '/images/accommodation/villa-sunset.jpg',
      rating: 4.9,
      priceRange: 'Rp 800.000 - 1.500.000',
      rooms: 8,
      phone: '+62 815-3456-7890',
      facilities: ['AC', 'TV LED', 'Minibar', 'Balkon pribadi', 'Pool', 'WiFi premium'],
      services: ['Butler service', 'Private chef', 'Spa', 'Airport transfer', 'Concierge']
    },
    {
      id: 5,
      name: 'Wisma Nelayan Liae',
      location: 'Sabu Liae',
      type: 'Guesthouse',
      category: 'Local',
      description: 'Wisma sederhana yang dikelola keluarga nelayan dengan suasana kekeluargaan dan makanan laut segar.',
      image: '/images/accommodation/wisma-nelayan.jpg',
      rating: 4.3,
      priceRange: 'Rp 120.000 - 200.000',
      rooms: 8,
      phone: '+62 816-4567-8901',
      facilities: ['Kamar sederhana', 'Kamar mandi bersama', 'Ruang makan', 'Teras', 'Parkir'],
      services: ['Makanan laut', 'Trip memancing', 'Boat rental', 'Local guide']
    },
    {
      id: 6,
      name: 'Eco Lodge Mehara',
      location: 'Hawu Mehara',
      type: 'Lodge',
      category: 'Eco',
      description: 'Lodge ramah lingkungan dengan konsep sustainable tourism dan aktivitas ekowisata.',
      image: '/images/accommodation/eco-lodge.jpg',
      rating: 4.6,
      priceRange: 'Rp 350.000 - 600.000',
      rooms: 10,
      phone: '+62 817-5678-9012',
      facilities: ['Solar power', 'Rainwater system', 'Organic garden', 'Hiking trail', 'Library'],
      services: ['Eco tour', 'Bird watching', 'Organic meals', 'Environmental education']
    }
  ]

  const accommodationTypes = [
    { name: 'Hotel', count: 3, icon: Building, color: 'bg-blue-500' },
    { name: 'Homestay', count: 8, icon: Home, color: 'bg-green-500' },
    { name: 'Guesthouse', count: 6, icon: Bed, color: 'bg-purple-500' },
    { name: 'Villa', count: 2, icon: Building, color: 'bg-orange-500' }
  ]

  const bookingTips = [
    {
      title: 'Musim Wisata',
      content: 'Pesan lebih awal saat musim kemarau (April-Oktober) karena tingkat hunian tinggi'
    },
    {
      title: 'Transportasi',
      content: 'Konfirmasi layanan antar jemput bandara atau pelabuhan saat booking'
    },
    {
      title: 'Pembayaran',
      content: 'Siapkan uang tunai karena tidak semua tempat menerima kartu kredit'
    },
    {
      title: 'Komunikasi',
      content: 'Hubungi langsung pemilik untuk mendapat harga terbaik dan info terkini'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Akomodasi di Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan tempat menginap yang nyaman sesuai budget dan preferensi Anda, 
            dari hotel modern hingga homestay tradisional yang autentik.
          </p>
        </div>

        {/* Accommodation Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {accommodationTypes.map((type, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <div className={`p-2 ${type.color} rounded-full`}>
                    <type.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.count} tempat</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Accommodations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-white text-gray-900">
                    {accommodation.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{accommodation.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold mb-1">{accommodation.name}</h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{accommodation.location}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="secondary" className="mb-2">
                    {accommodation.category}
                  </Badge>
                  <p className="text-gray-600 text-sm">{accommodation.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{accommodation.priceRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-gray-400" />
                    <span>{accommodation.rooms} kamar</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{accommodation.phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Fasilitas:</h4>
                  <div className="flex flex-wrap gap-1">
                    {accommodation.facilities.slice(0, 4).map((facility, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {facility}
                      </Badge>
                    ))}
                    {accommodation.facilities.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{accommodation.facilities.length - 4} lainnya
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Layanan:</h4>
                  <div className="flex flex-wrap gap-1">
                    {accommodation.services.slice(0, 3).map((service, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {accommodation.services.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{accommodation.services.length - 3} lainnya
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Lihat Detail
                  </Button>
                  <Button variant="outline" size="sm">
                    Hubungi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tips Booking Akomodasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookingTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Check-in/Check-out</h4>
                  <p className="text-sm text-gray-600">
                    Umumnya check-in 14:00, check-out 12:00. Konfirmasi dengan pihak akomodasi.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Pembayaran</h4>
                  <p className="text-sm text-gray-600">
                    Sebagian besar menerima tunai. Beberapa hotel menerima kartu kredit/debit.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fasilitas Umum</h4>
                  <p className="text-sm text-gray-600">
                    WiFi tersedia di sebagian besar tempat. AC tidak selalu tersedia di budget accommodation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Bantuan</CardTitle>
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
                  <h4 className="font-semibold text-gray-900 mb-2">Asosiasi Homestay</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Koordinator: Maria Haning</p>
                    <p>WhatsApp: +62 813-7890-1234</p>
                    <p>Email: homestay@saburajua.go.id</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Darurat</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Polisi: 110</p>
                    <p>Ambulans: 118</p>
                    <p>Pemadam Kebakaran: 113</p>
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
