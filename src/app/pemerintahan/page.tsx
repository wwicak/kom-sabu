import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Users, 
  MapPin, 
  FileText, 
  Calendar, 
  Phone,
  Mail,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function PemerintahanPage() {
  const governmentStructure = [
    {
      level: 'Kabupaten',
      name: 'Kabupaten Sabu Raijua',
      head: 'Bupati',
      currentHead: 'H. Nikodemus N. Rihi Heke, S.Sos',
      established: '2008',
      area: '460.15 km²',
      population: '72.960 jiwa',
      description: 'Pemerintahan tingkat kabupaten yang menyelenggarakan urusan pemerintahan daerah'
    }
  ]

  const districts = [
    {
      name: 'Sabu Barat',
      head: 'Drs. Yohanes Manu',
      villages: 8,
      area: '76.8 km²',
      population: '18.500 jiwa',
      capital: 'Menia',
      established: '2008'
    },
    {
      name: 'Sabu Tengah',
      head: 'Kornelius Haning, S.Sos',
      villages: 12,
      area: '68.5 km²',
      population: '16.200 jiwa',
      capital: 'Sabu Tengah',
      established: '2008'
    },
    {
      name: 'Sabu Timur',
      head: 'Dra. Maria Seran',
      villages: 10,
      area: '85.2 km²',
      population: '14.800 jiwa',
      capital: 'Timu',
      established: '2008'
    },
    {
      name: 'Raijua',
      head: 'Yosef Rihi, S.AP',
      villages: 6,
      area: '72.6 km²',
      population: '17.060 jiwa',
      capital: 'Raijua',
      established: '2008'
    },
    {
      name: 'Sabu Liae',
      head: 'Drs. Marthen Kale',
      villages: 9,
      area: '89.3 km²',
      population: '3.200 jiwa',
      capital: 'Liae',
      established: '2012'
    },
    {
      name: 'Hawu Mehara',
      head: 'Maria Haning, S.Sos',
      villages: 7,
      area: '67.75 km²',
      population: '3.200 jiwa',
      capital: 'Mehara',
      established: '2012'
    }
  ]

  const governmentServices = [
    {
      category: 'Administrasi Kependudukan',
      services: ['KTP Elektronik', 'Kartu Keluarga', 'Akta Kelahiran', 'Akta Kematian'],
      department: 'Dinas Kependudukan dan Pencatatan Sipil',
      contact: '(0380) 21010'
    },
    {
      category: 'Perizinan',
      services: ['IMB', 'SIUP', 'SITU', 'Izin Gangguan'],
      department: 'Dinas Penanaman Modal dan PTSP',
      contact: '(0380) 21011'
    },
    {
      category: 'Sosial',
      services: ['Bantuan Sosial', 'PKH', 'BPNT', 'Kartu Penyandang Disabilitas'],
      department: 'Dinas Sosial',
      contact: '(0380) 21012'
    },
    {
      category: 'Kesehatan',
      services: ['Pelayanan Puskesmas', 'Imunisasi', 'KB', 'Rujukan Kesehatan'],
      department: 'Dinas Kesehatan',
      contact: '(0380) 21013'
    }
  ]

  const quickLinks = [
    {
      title: 'Struktur Organisasi',
      description: 'Bagan organisasi pemerintah daerah',
      href: '/profil/struktur',
      icon: Building2
    },
    {
      title: 'Pejabat Daerah',
      description: 'Profil pimpinan dan pejabat',
      href: '/profil/pejabat',
      icon: Users
    },
    {
      title: 'Data Kecamatan',
      description: 'Informasi lengkap kecamatan',
      href: '/kecamatan',
      icon: MapPin
    },
    {
      title: 'Peta Kecamatan',
      description: 'Peta interaktif wilayah',
      href: '/peta-kecamatan',
      icon: MapPin
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pemerintahan Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Informasi lengkap tentang struktur pemerintahan, wilayah administrasi, 
            dan layanan publik Kabupaten Sabu Raijua.
          </p>
        </div>

        {/* Government Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Gambaran Umum Pemerintahan
          </h2>
          {governmentStructure.map((gov, index) => (
            <Card key={index} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{gov.name}</CardTitle>
                    <Badge className="mt-2 bg-blue-600">
                      {gov.level}
                    </Badge>
                  </div>
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{gov.established}</div>
                    <div className="text-sm text-gray-600">Tahun Pembentukan</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{gov.area}</div>
                    <div className="text-sm text-gray-600">Luas Wilayah</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{gov.population}</div>
                    <div className="text-sm text-gray-600">Jumlah Penduduk</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">6</div>
                    <div className="text-sm text-gray-600">Kecamatan</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{gov.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">{gov.head}:</span>
                  <span className="text-gray-600">{gov.currentHead}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Districts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Kecamatan
            </h2>
            <Link href="/kecamatan">
              <Button variant="outline" className="flex items-center gap-2">
                Lihat Detail
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Kecamatan {district.name}</CardTitle>
                      <p className="text-sm text-gray-600">Ibukota: {district.capital}</p>
                    </div>
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Camat:</span>
                      <span className="font-medium">{district.head}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Luas:</span>
                      <span className="font-medium">{district.area}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Penduduk:</span>
                      <span className="font-medium">{district.population}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desa/Kelurahan:</span>
                      <span className="font-medium">{district.villages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Dibentuk:</span>
                      <span className="font-medium">{district.established}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Government Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Layanan Pemerintahan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {governmentServices.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {service.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Layanan:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.services.map((item, idx) => (
                          <Badge key={idx} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">{service.department}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {service.contact}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tautan Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                        <link.icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                    <div className="flex items-center justify-center text-blue-600 text-sm font-medium">
                      Lihat Detail
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Kontak Pemerintah Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Alamat Kantor</h4>
                <p className="text-gray-600 mb-4">
                  Jl. Diponegoro No. 1, Seba<br />
                  Kabupaten Sabu Raijua<br />
                  Nusa Tenggara Timur 85391
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    (0380) 21001
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    info@saburajua.go.id
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Jam Pelayanan</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <p>Senin - Kamis: 07:30 - 16:00 WITA</p>
                      <p>Jumat: 07:30 - 16:30 WITA</p>
                      <p>Sabtu - Minggu: Libur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
