import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, Calendar } from 'lucide-react'

export default function SejarahPage() {
  const timelineEvents = [
    {
      year: '1958',
      title: 'Pembentukan Awal',
      description: 'Wilayah Sabu Raijua mulai dikenal sebagai bagian dari Kabupaten Kupang',
      type: 'formation'
    },
    {
      year: '1992',
      title: 'Kecamatan Sabu Raijua',
      description: 'Dibentuk sebagai kecamatan dalam Kabupaten Kupang dengan 3 kecamatan',
      type: 'administrative'
    },
    {
      year: '2008',
      title: 'Kabupaten Sabu Raijua',
      description: 'Resmi menjadi kabupaten otonom berdasarkan UU No. 69 Tahun 2008',
      type: 'autonomy'
    },
    {
      year: '2009',
      title: 'Pelantikan Bupati Pertama',
      description: 'Pelantikan bupati dan wakil bupati pertama Kabupaten Sabu Raijua',
      type: 'leadership'
    },
    {
      year: '2010-2024',
      title: 'Pembangunan Modern',
      description: 'Era pembangunan infrastruktur, pendidikan, dan pariwisata berkelanjutan',
      type: 'development'
    }
  ]

  const culturalHeritage = [
    {
      name: 'Tenun Ikat Sabu',
      description: 'Kerajinan tenun tradisional dengan motif khas Sabu yang telah diwariskan turun-temurun',
      significance: 'Warisan budaya tak benda'
    },
    {
      name: 'Rumah Adat Sabu',
      description: 'Arsitektur tradisional dengan atap jerami dan konstruksi kayu yang unik',
      significance: 'Warisan arsitektur'
    },
    {
      name: 'Bahasa Sabu',
      description: 'Bahasa daerah yang masih aktif digunakan dalam kehidupan sehari-hari',
      significance: 'Warisan linguistik'
    },
    {
      name: 'Tarian Tradisional',
      description: 'Berbagai tarian adat yang menggambarkan kehidupan masyarakat Sabu',
      significance: 'Warisan seni pertunjukan'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sejarah Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Perjalanan panjang pembentukan dan perkembangan Kabupaten Sabu Raijua 
            dari masa ke masa hingga menjadi daerah otonom yang mandiri.
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Tahun Pembentukan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">2008</div>
              <p className="text-gray-600">Berdasarkan UU No. 69 Tahun 2008</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Luas Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">460,15</div>
              <p className="text-gray-600">Kilometer persegi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Jumlah Kecamatan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">6</div>
              <p className="text-gray-600">Kecamatan aktif</p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Kronologi Sejarah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      {index < timelineEvents.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="font-bold">
                          {event.year}
                        </Badge>
                        <Badge 
                          variant={
                            event.type === 'autonomy' ? 'default' :
                            event.type === 'formation' ? 'secondary' :
                            event.type === 'leadership' ? 'destructive' :
                            'outline'
                          }
                        >
                          {event.type === 'autonomy' ? 'Otonomi' :
                           event.type === 'formation' ? 'Pembentukan' :
                           event.type === 'leadership' ? 'Kepemimpinan' :
                           event.type === 'administrative' ? 'Administratif' :
                           'Pembangunan'}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Heritage */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Warisan Budaya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {culturalHeritage.map((heritage, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{heritage.name}</CardTitle>
                  <Badge variant="secondary">{heritage.significance}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{heritage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Historical Significance */}
        <Card>
          <CardHeader>
            <CardTitle>Makna Historis</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Kabupaten Sabu Raijua memiliki sejarah panjang sebagai wilayah kepulauan yang strategis 
              di Nusa Tenggara Timur. Pulau Sabu dan Pulau Raijua telah dihuni sejak berabad-abad 
              yang lalu oleh masyarakat dengan budaya dan tradisi yang kaya.
            </p>
            <p className="text-gray-600 mb-4">
              Pembentukan kabupaten ini merupakan hasil dari aspirasi masyarakat untuk memiliki 
              otonomi daerah yang lebih baik dalam mengelola potensi dan sumber daya lokal. 
              Dengan status sebagai kabupaten otonom, Sabu Raijua dapat lebih fokus pada 
              pembangunan yang sesuai dengan karakteristik dan kebutuhan masyarakat kepulauan.
            </p>
            <p className="text-gray-600">
              Hingga saat ini, Kabupaten Sabu Raijua terus berkembang dengan tetap mempertahankan 
              nilai-nilai budaya dan kearifan lokal yang telah diwariskan oleh nenek moyang.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
