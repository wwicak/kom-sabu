import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin,
  Crown,
  Shield,
  Briefcase,
  UserCheck
} from 'lucide-react'

export default function StrukturPage() {
  const leadership = [
    {
      position: 'Bupati',
      name: 'H. Nikodemus N. Rihi Heke, S.Sos',
      period: '2021-2026',
      photo: '/images/officials/bupati.jpg',
      icon: Crown,
      color: 'bg-blue-600'
    },
    {
      position: 'Wakil Bupati',
      name: 'Drs. Yohanis Uly Kale',
      period: '2021-2026',
      photo: '/images/officials/wakil-bupati.jpg',
      icon: Shield,
      color: 'bg-green-600'
    },
    {
      position: 'Sekretaris Daerah',
      name: 'Drs. Marthen Dira Tome, M.Si',
      period: '2020-sekarang',
      photo: '/images/officials/sekda.jpg',
      icon: Briefcase,
      color: 'bg-purple-600'
    }
  ]

  const departments = [
    {
      name: 'Sekretariat Daerah',
      head: 'Drs. Marthen Dira Tome, M.Si',
      functions: ['Koordinasi kebijakan', 'Administrasi pemerintahan', 'Protokol dan komunikasi'],
      phone: '(0380) 21001',
      email: 'sekda@saburajua.go.id'
    },
    {
      name: 'Dinas Pendidikan dan Kebudayaan',
      head: 'Drs. Yosef Haning, M.Pd',
      functions: ['Pendidikan dasar dan menengah', 'Kebudayaan dan seni', 'Perpustakaan dan kearsipan'],
      phone: '(0380) 21002',
      email: 'disdikbud@saburajua.go.id'
    },
    {
      name: 'Dinas Kesehatan',
      head: 'dr. Maria Goreti Bria, M.Kes',
      functions: ['Pelayanan kesehatan masyarakat', 'Pencegahan dan pengendalian penyakit', 'Promosi kesehatan'],
      phone: '(0380) 21003',
      email: 'dinkes@saburajua.go.id'
    },
    {
      name: 'Dinas Pekerjaan Umum dan Penataan Ruang',
      head: 'Ir. Yohanes Seran, M.T',
      functions: ['Infrastruktur jalan dan jembatan', 'Penataan ruang', 'Perumahan dan permukiman'],
      phone: '(0380) 21004',
      email: 'dpupr@saburajua.go.id'
    },
    {
      name: 'Dinas Sosial',
      head: 'Dra. Yustina Haning, M.Si',
      functions: ['Bantuan sosial', 'Pemberdayaan sosial', 'Rehabilitasi sosial'],
      phone: '(0380) 21005',
      email: 'dinsos@saburajua.go.id'
    },
    {
      name: 'Dinas Pariwisata dan Ekonomi Kreatif',
      head: 'Drs. Kornelius Rihi, M.Par',
      functions: ['Pengembangan destinasi wisata', 'Promosi pariwisata', 'Ekonomi kreatif'],
      phone: '(0380) 21006',
      email: 'dispar@saburajua.go.id'
    }
  ]

  const agencies = [
    {
      name: 'Badan Perencanaan Pembangunan Daerah',
      head: 'Ir. Maria Fatima Rihi, M.Si',
      type: 'Badan'
    },
    {
      name: 'Badan Pendapatan Daerah',
      head: 'Drs. Yohanes Manu, M.Si',
      type: 'Badan'
    },
    {
      name: 'Inspektorat Daerah',
      head: 'Drs. Kornelius Haning, M.Si',
      type: 'Inspektorat'
    },
    {
      name: 'Satuan Polisi Pamong Praja',
      head: 'Drs. Yosef Rihi, M.AP',
      type: 'Satuan'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Struktur Organisasi Pemerintah Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Susunan organisasi dan tata kerja pemerintahan Kabupaten Sabu Raijua 
            berdasarkan Peraturan Daerah yang berlaku.
          </p>
        </div>

        {/* Leadership */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pimpinan Daerah
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 ${leader.color} rounded-full`}>
                      <leader.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <Badge className={leader.color.replace('bg-', 'bg-opacity-10 text-')} variant="secondary">
                    {leader.position}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {leader.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Periode: {leader.period}
                  </p>
                  <Button variant="outline" size="sm">
                    Lihat Profil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Organizational Chart */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Bagan Organisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg mb-4 inline-block">
                  <h3 className="font-bold text-blue-900">BUPATI</h3>
                  <p className="text-sm text-blue-700">Kepala Daerah</p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="font-bold text-green-900">WAKIL BUPATI</h3>
                    <p className="text-sm text-green-700">Wakil Kepala Daerah</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <h3 className="font-bold text-purple-900">SEKRETARIS DAERAH</h3>
                    <p className="text-sm text-purple-700">Koordinator Pemerintahan</p>
                  </div>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-900 text-sm">DINAS DAERAH</h4>
                    <p className="text-xs text-orange-700">Pelaksana Urusan Pemerintahan</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-red-900 text-sm">BADAN DAERAH</h4>
                    <p className="text-xs text-red-700">Pendukung Urusan Pemerintahan</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 text-sm">KECAMATAN</h4>
                    <p className="text-xs text-indigo-700">Perangkat Daerah Kewilayahan</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dinas Daerah
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Kepala: {dept.head}
                      </p>
                    </div>
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Fungsi Utama:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {dept.functions.map((func, idx) => (
                          <li key={idx}>• {func}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {dept.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        {dept.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agencies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Badan dan Lembaga Teknis Daerah
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agencies.map((agency, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {agency.type}
                      </Badge>
                      <CardTitle className="text-lg">{agency.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Kepala: {agency.head}
                      </p>
                    </div>
                    <UserCheck className="h-6 w-6 text-gray-400" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Alamat Kantor</h4>
                <p className="text-gray-600 mb-2">
                  Jl. Diponegoro No. 1, Seba<br />
                  Kabupaten Sabu Raijua<br />
                  Nusa Tenggara Timur 85391
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kontak</h4>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
