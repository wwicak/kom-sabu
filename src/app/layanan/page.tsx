'use client'

import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  FileText,
  Users,
  Building2,
  Heart,
  GraduationCap,
  Briefcase,
  Home,
  Car,
  Shield,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

const LAYANAN_DATA = [
  {
    id: '1',
    category: 'Administrasi Kependudukan',
    icon: Users,
    color: 'blue',
    services: [
      {
        name: 'Kartu Tanda Penduduk (KTP)',
        description: 'Pembuatan dan perpanjangan KTP elektronik',
        requirements: ['Fotokopi KK', 'Pas foto 3x4', 'Surat pengantar RT/RW'],
        duration: '3-7 hari kerja',
        fee: 'Gratis',
        online: true
      },
      {
        name: 'Kartu Keluarga (KK)',
        description: 'Pembuatan KK baru dan perubahan data',
        requirements: ['KTP asli', 'Surat nikah/cerai', 'Akta kelahiran anak'],
        duration: '3-5 hari kerja',
        fee: 'Gratis',
        online: true
      },
      {
        name: 'Akta Kelahiran',
        description: 'Penerbitan akta kelahiran anak',
        requirements: ['Surat keterangan lahir', 'KTP orang tua', 'KK', 'Surat nikah'],
        duration: '7-14 hari kerja',
        fee: 'Gratis',
        online: false
      }
    ]
  },
  {
    id: '2',
    category: 'Perizinan Usaha',
    icon: Briefcase,
    color: 'green',
    services: [
      {
        name: 'Surat Izin Usaha Perdagangan (SIUP)',
        description: 'Izin untuk menjalankan usaha perdagangan',
        requirements: ['KTP', 'NPWP', 'Surat keterangan domisili', 'Pas foto'],
        duration: '7-14 hari kerja',
        fee: 'Rp 50.000 - Rp 200.000',
        online: true
      },
      {
        name: 'Tanda Daftar Perusahaan (TDP)',
        description: 'Pendaftaran perusahaan untuk kegiatan usaha',
        requirements: ['Akta pendirian', 'NPWP', 'Surat domisili', 'SIUP'],
        duration: '10-14 hari kerja',
        fee: 'Rp 100.000 - Rp 300.000',
        online: true
      },
      {
        name: 'Izin Mendirikan Bangunan (IMB)',
        description: 'Izin untuk mendirikan atau merenovasi bangunan',
        requirements: ['Sertifikat tanah', 'Gambar bangunan', 'KTP', 'SPPT PBB'],
        duration: '14-30 hari kerja',
        fee: 'Sesuai luas bangunan',
        online: false
      }
    ]
  },
  {
    id: '3',
    category: 'Kesehatan',
    icon: Heart,
    color: 'red',
    services: [
      {
        name: 'Surat Keterangan Sehat',
        description: 'Surat keterangan kesehatan untuk berbagai keperluan',
        requirements: ['KTP', 'Pemeriksaan kesehatan'],
        duration: '1 hari kerja',
        fee: 'Rp 25.000',
        online: false
      },
      {
        name: 'Surat Keterangan Bebas Narkoba',
        description: 'Surat keterangan bebas narkoba untuk keperluan kerja',
        requirements: ['KTP', 'Tes urine', 'Pas foto'],
        duration: '1-2 hari kerja',
        fee: 'Rp 150.000',
        online: false
      },
      {
        name: 'Kartu Berobat Gratis',
        description: 'Kartu untuk mendapat pelayanan kesehatan gratis',
        requirements: ['KTP', 'KK', 'Surat keterangan tidak mampu'],
        duration: '3-5 hari kerja',
        fee: 'Gratis',
        online: true
      }
    ]
  },
  {
    id: '4',
    category: 'Pendidikan',
    icon: GraduationCap,
    color: 'purple',
    services: [
      {
        name: 'Surat Keterangan Pindah Sekolah',
        description: 'Surat untuk keperluan pindah sekolah',
        requirements: ['Rapor terakhir', 'Surat keterangan pindah domisili', 'KK'],
        duration: '1-3 hari kerja',
        fee: 'Gratis',
        online: false
      },
      {
        name: 'Beasiswa Pendidikan',
        description: 'Program bantuan biaya pendidikan',
        requirements: ['Rapor', 'Surat keterangan tidak mampu', 'KK', 'KTP orang tua'],
        duration: '30-60 hari kerja',
        fee: 'Gratis',
        online: true
      }
    ]
  },
  {
    id: '5',
    category: 'Sosial',
    icon: Home,
    color: 'yellow',
    services: [
      {
        name: 'Bantuan Sosial',
        description: 'Program bantuan untuk masyarakat kurang mampu',
        requirements: ['KTP', 'KK', 'Surat keterangan tidak mampu', 'Survey lapangan'],
        duration: '30-45 hari kerja',
        fee: 'Gratis',
        online: true
      },
      {
        name: 'Surat Keterangan Tidak Mampu',
        description: 'Surat keterangan untuk berbagai bantuan sosial',
        requirements: ['KTP', 'KK', 'Surat pengantar RT/RW'],
        duration: '1-2 hari kerja',
        fee: 'Gratis',
        online: false
      }
    ]
  }
]

const colorClasses = {
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  red: 'text-red-600 bg-red-100',
  purple: 'text-purple-600 bg-purple-100',
  yellow: 'text-yellow-600 bg-yellow-100'
}

export default function LayananPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Layanan Publik</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Berbagai layanan publik yang tersedia untuk masyarakat Kabupaten Sabu Raijua.
            Kami berkomitmen memberikan pelayanan terbaik dengan proses yang mudah dan transparan.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Jam Pelayanan</h3>
              <p className="text-sm text-gray-600">Senin - Jumat: 08:00 - 15:00 WITA</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Layanan Online</h3>
              <p className="text-sm text-gray-600">Beberapa layanan dapat diakses online</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Gratis Pungli</h3>
              <p className="text-sm text-gray-600">Bebas dari pungutan liar</p>
            </CardContent>
          </Card>
        </div>

        {/* Services by Category */}
        <div className="space-y-8">
          {LAYANAN_DATA.map((category) => {
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
                  {category.services.map((service, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          {service.online && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Online
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{service.description}</p>

                        <div className="space-y-3">
                          <div>
                            <p className="font-medium text-gray-900 mb-1">Persyaratan:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {service.requirements.map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-start">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">Waktu Proses:</p>
                              <p className="text-gray-600">{service.duration}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Biaya:</p>
                              <p className="text-gray-600">{service.fee}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button className="w-full" variant="outline">
                            {service.online ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ajukan Online
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2" />
                                Info Lengkap
                              </>
                            )}
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

        {/* Contact Info */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
              <p className="text-gray-600 mb-4">
                Tim customer service kami siap membantu Anda dengan layanan yang dibutuhkan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/kontak">
                    Hubungi Kami
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:(0380)21001">
                    Telepon: (0380) 21001
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
