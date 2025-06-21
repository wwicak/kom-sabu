'use client'

import { Layout } from '@/components/layout/Layout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { MapPin, Users, Calendar, Award, Target, Eye, Heart } from 'lucide-react'

export default function ProfilPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Kabupaten</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mengenal lebih dekat Kabupaten Sabu Raijua, sejarah, visi misi, dan potensi daerah
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <Image
              src="/images/sabu-raijua-landscape.jpg"
              alt="Pemandangan Kabupaten Sabu Raijua"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-2">Kabupaten Sabu Raijua</h2>
                <p className="text-xl">Nusa Tenggara Timur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Luas Wilayah</p>
              <p className="text-2xl font-bold text-gray-900">463,96 km²</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Jumlah Penduduk</p>
              <p className="text-2xl font-bold text-gray-900">72.960</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Tahun Pembentukan</p>
              <p className="text-2xl font-bold text-gray-900">2009</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Kecamatan</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sejarah */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sejarah Singkat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Kabupaten Sabu Raijua dibentuk berdasarkan Undang-Undang Nomor 69 Tahun 2009
                  tentang Pembentukan Kabupaten Sabu Raijua di Provinsi Nusa Tenggara Timur.
                  Kabupaten ini merupakan pemekaran dari Kabupaten Kupang.
                </p>
                <p className="text-gray-600 mb-4">
                  Wilayah Kabupaten Sabu Raijua terdiri dari dua pulau utama yaitu Pulau Sabu
                  dan Pulau Raijua, serta beberapa pulau kecil di sekitarnya. Kedua pulau ini
                  memiliki keunikan budaya dan potensi alam yang luar biasa.
                </p>
                <p className="text-gray-600">
                  Masyarakat Sabu Raijua dikenal dengan kearifan lokalnya dalam menjaga
                  kelestarian alam dan tradisi budaya yang telah diwariskan turun-temurun.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geografis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">Koordinat:</p>
                    <p className="text-gray-600">10°30' LS - 10°45' LS dan 121°50' BT - 122°05' BT</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Batas Wilayah:</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Utara: Laut Sawu</li>
                      <li>• Selatan: Samudra Hindia</li>
                      <li>• Timur: Kabupaten Rote Ndao</li>
                      <li>• Barat: Kabupaten Kupang</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Iklim:</p>
                    <p className="text-gray-600">Iklim tropis kering dengan musim hujan November-April</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visi Misi */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Visi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic text-lg leading-relaxed">
                  "Terwujudnya Kabupaten Sabu Raijua yang Maju, Mandiri, dan Sejahtera
                  Berbasis Kearifan Lokal pada Tahun 2024"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Misi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">1</span>
                    Meningkatkan kualitas sumber daya manusia melalui pendidikan dan kesehatan
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">2</span>
                    Mengembangkan ekonomi kerakyatan berbasis potensi lokal
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">3</span>
                    Memperkuat infrastruktur dan konektivitas antar pulau
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">4</span>
                    Melestarikan budaya dan kearifan lokal
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-3 mt-0.5">5</span>
                    Meningkatkan tata kelola pemerintahan yang baik dan bersih
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Motto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-xl font-semibold">
                  "Hamu Kaka Dua Dolu"
                </p>
                <p className="text-gray-500 text-center mt-2">
                  (Kita Bersatu Membangun Negeri)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Potensi Daerah */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Potensi Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pertanian & Peternakan</h4>
                <div className="space-y-2">
                  <Badge variant="outline">Jagung</Badge>
                  <Badge variant="outline">Padi</Badge>
                  <Badge variant="outline">Kacang Tanah</Badge>
                  <Badge variant="outline">Sapi</Badge>
                  <Badge variant="outline">Kerbau</Badge>
                  <Badge variant="outline">Kambing</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kelautan & Perikanan</h4>
                <div className="space-y-2">
                  <Badge variant="outline">Ikan Tuna</Badge>
                  <Badge variant="outline">Ikan Cakalang</Badge>
                  <Badge variant="outline">Rumput Laut</Badge>
                  <Badge variant="outline">Budidaya Ikan</Badge>
                  <Badge variant="outline">Garam</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Pariwisata & Budaya</h4>
                <div className="space-y-2">
                  <Badge variant="outline">Pantai Pasir Putih</Badge>
                  <Badge variant="outline">Tenun Ikat</Badge>
                  <Badge variant="outline">Tari Tradisional</Badge>
                  <Badge variant="outline">Rumah Adat</Badge>
                  <Badge variant="outline">Festival Budaya</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Struktur Pemerintahan */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Pimpinan Daerah</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">Bupati</h4>
                <p className="text-gray-600">Drs. Nikodemus N. Rihi Heke, M.Si</p>
                <p className="text-sm text-gray-500">Periode 2021-2026</p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900">Wakil Bupati</h4>
                <p className="text-gray-600">Drs. Yohanis Uly Kale</p>
                <p className="text-sm text-gray-500">Periode 2021-2026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
