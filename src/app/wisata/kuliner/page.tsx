import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Utensils, 
  Coffee, 
  MapPin, 
  Star,
  Clock,
  DollarSign,
  Phone,
  ChefHat
} from 'lucide-react'

export default function WisataKulinerPage() {
  const culinarySpots = [
    {
      id: 1,
      name: 'Warung Ikan Bakar Seba',
      location: 'Seba, Sabu Tengah',
      category: 'Seafood',
      specialty: 'Ikan Bakar Khas Sabu',
      description: 'Warung legendaris dengan ikan bakar segar hasil tangkapan nelayan lokal, disajikan dengan sambal khas Sabu.',
      image: '/images/culinary/ikan-bakar-seba.jpg',
      rating: 4.7,
      priceRange: 'Rp 25.000 - 75.000',
      openHours: '10:00 - 22:00',
      phone: '+62 813-1234-5678',
      highlights: ['Ikan segar', 'Sambal khas', 'Pemandangan laut', 'Harga terjangkau']
    },
    {
      id: 2,
      name: 'Rumah Makan Jagung Bose',
      location: 'Raijua',
      category: 'Makanan Tradisional',
      specialty: 'Jagung Bose',
      description: 'Makanan tradisional khas Sabu Raijua berbahan dasar jagung dengan kuah santan dan sayuran.',
      image: '/images/culinary/jagung-bose.jpg',
      rating: 4.5,
      priceRange: 'Rp 15.000 - 35.000',
      openHours: '07:00 - 20:00',
      phone: '+62 814-2345-6789',
      highlights: ['Resep turun temurun', 'Bahan organik', 'Porsi besar', 'Vegetarian friendly']
    },
    {
      id: 3,
      name: 'Kedai Kopi Sabu',
      location: 'Sabu Barat',
      category: 'Minuman',
      specialty: 'Kopi Robusta Sabu',
      description: 'Kedai kopi dengan biji kopi robusta lokal yang diolah secara tradisional dengan cita rasa yang khas.',
      image: '/images/culinary/kopi-sabu.jpg',
      rating: 4.6,
      priceRange: 'Rp 8.000 - 25.000',
      openHours: '06:00 - 23:00',
      phone: '+62 815-3456-7890',
      highlights: ['Kopi lokal', 'Roasting sendiri', 'Suasana tradisional', 'WiFi gratis']
    },
    {
      id: 4,
      name: 'Warung Se\'i Raijua',
      location: 'Raijua',
      category: 'Daging',
      specialty: 'Se\'i Daging Sapi',
      description: 'Daging sapi asap khas NTT yang diolah dengan bumbu tradisional dan diasap menggunakan kayu khusus.',
      image: '/images/culinary/sei-raijua.jpg',
      rating: 4.8,
      priceRange: 'Rp 35.000 - 85.000',
      openHours: '11:00 - 21:00',
      phone: '+62 816-4567-8901',
      highlights: ['Daging premium', 'Proses asap tradisional', 'Bumbu rahasia', 'Kemasan travel']
    }
  ]

  const traditionalFoods = [
    {
      name: 'Jagung Bose',
      description: 'Makanan pokok berbahan jagung dengan kuah santan dan sayuran',
      origin: 'Seluruh Sabu Raijua',
      ingredients: ['Jagung', 'Santan', 'Sayuran', 'Bumbu tradisional']
    },
    {
      name: 'Ikan Bakar Sabu',
      description: 'Ikan segar yang dibakar dengan bumbu khas dan sambal pedas',
      origin: 'Pesisir Sabu',
      ingredients: ['Ikan segar', 'Bumbu bakar', 'Sambal', 'Lalapan']
    },
    {
      name: 'Se\'i Sabu',
      description: 'Daging sapi atau babi yang diasap dengan kayu khusus',
      origin: 'Sabu Tengah',
      ingredients: ['Daging sapi/babi', 'Garam', 'Kayu asap', 'Bumbu tradisional']
    },
    {
      name: 'Kopi Robusta Sabu',
      description: 'Kopi dengan cita rasa khas yang tumbuh di dataran tinggi Sabu',
      origin: 'Sabu Barat',
      ingredients: ['Biji kopi robusta', 'Gula aren', 'Air pegunungan']
    }
  ]

  const culinaryCategories = [
    { name: 'Seafood', count: 8, icon: Utensils, color: 'bg-blue-500' },
    { name: 'Tradisional', count: 12, icon: ChefHat, color: 'bg-green-500' },
    { name: 'Minuman', count: 6, icon: Coffee, color: 'bg-orange-500' },
    { name: 'Daging', count: 5, icon: Utensils, color: 'bg-red-500' }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kuliner Khas Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nikmati kelezatan kuliner tradisional Sabu Raijua yang kaya akan cita rasa 
            dan diwariskan turun-temurun oleh masyarakat setempat.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {culinaryCategories.map((category, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2">
                  <div className={`p-2 ${category.color} rounded-full`}>
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} tempat</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Culinary Spots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {culinarySpots.map((spot) => (
            <Card key={spot.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-white text-gray-900">
                    {spot.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{spot.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-bold mb-1">{spot.name}</h3>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{spot.location}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-3">
                  <Badge variant="secondary" className="mb-2">
                    Spesialitas: {spot.specialty}
                  </Badge>
                  <p className="text-gray-600 text-sm">{spot.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{spot.priceRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{spot.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{spot.phone}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Keunggulan:</h4>
                  <div className="flex flex-wrap gap-1">
                    {spot.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Lihat Menu
                  </Button>
                  <Button variant="outline" size="sm">
                    Hubungi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traditional Foods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Makanan Tradisional Khas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {traditionalFoods.map((food, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{food.name}</CardTitle>
                  <Badge variant="outline">{food.origin}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{food.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bahan Utama:</h4>
                    <div className="flex flex-wrap gap-1">
                      {food.ingredients.map((ingredient, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Culinary Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Tips Kuliner</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  Coba makanan tradisional seperti Jagung Bose dan Se\'i
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  Kunjungi warung lokal untuk pengalaman autentik
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  Bawa uang tunai karena tidak semua tempat terima kartu
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  Tanyakan tingkat kepedasan sebelum memesan
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                  Beli oleh-oleh kopi dan bumbu khas Sabu
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
                  <h4 className="font-semibold text-gray-900 mb-2">Asosiasi Kuliner Sabu</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Telepon: (0380) 21007</p>
                    <p>WhatsApp: +62 812-4567-8901</p>
                    <p>Email: kuliner@saburajua.go.id</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Food Tour Guide</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Yosef Kale: +62 813-5678-9012</p>
                    <p>Maria Rihi: +62 814-6789-0123</p>
                    <p>Tarif: Rp 100.000 - 250.000/hari</p>
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
