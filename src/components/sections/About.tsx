'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Target, Eye, Award, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Visi',
      description: 'Mewujudkan Kabupaten Sabu Raijua yang maju, sejahtera, dan berkelanjutan berbasis kearifan lokal dan inovasi.',
    },
    {
      icon: Eye,
      title: 'Misi',
      description: 'Meningkatkan kualitas pelayanan publik, pembangunan infrastruktur, dan pemberdayaan masyarakat.',
    },
    {
      icon: Award,
      title: 'Nilai',
      description: 'Integritas, transparansi, akuntabilitas, dan profesionalisme dalam setiap aspek pemerintahan.',
    },
    {
      icon: Users,
      title: 'Komitmen',
      description: 'Mengutamakan kepentingan masyarakat dan pembangunan yang berkelanjutan untuk generasi mendatang.',
    },
  ]

  const achievements = [
    { number: '95%', label: 'Tingkat Kepuasan Masyarakat' },
    { number: '100%', label: 'Transparansi Anggaran' },
    { number: '24/7', label: 'Layanan Online' },
    { number: '63', label: 'Desa/Kelurahan Terlayani' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              Tentang Kabupaten Sabu Raijua
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Kabupaten Sabu Raijua adalah kabupaten kepulauan yang terdiri dari Pulau Sabu dan Pulau Raijua,
              terletak di Laut Sawu, Provinsi Nusa Tenggara Timur. Dibentuk pada 26 November 2008 berdasarkan
              UU No. 52 Tahun 2008, dengan ibu kota di Menia, Kecamatan Sabu Barat.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Dengan luas wilayah 459,58 km² dan populasi 94.860 jiwa (2024), kabupaten ini memiliki kekayaan
              budaya Hawu yang unik, termasuk tradisi tenun ikat yang terkenal hingga mancanegara, tarian Ledo Hawu
              yang sakral, dan bahasa Hawu sebagai bahasa daerah yang masih lestari.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Melalui motto &ldquo;Mira Kaddi&rdquo; (Membangun Bersama), kami berkomitmen membangun daerah yang maju,
              sejahtera, dan berkelanjutan dengan mengedepankan kearifan lokal, transparansi, dan akuntabilitas
              dalam setiap aspek pemerintahan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/profil">
                  Pelajari Lebih Lanjut
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/galeri">
                  Lihat Galeri
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/sabu-raijua-landscape.jpg"
                alt="Pemandangan Kabupaten Sabu Raijua"
                width={500}
                height={384}
                className="w-full h-96 object-cover"
                priority
              />

              {/* Overlay Stats */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white bg-opacity-95 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">6</div>
                      <div className="text-sm text-gray-600">Kecamatan</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">63</div>
                      <div className="text-sm text-gray-600">Desa/Kelurahan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Visi, Misi, dan Nilai-Nilai Kami
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Landasan yang mengarahkan setiap langkah pembangunan dan pelayanan kami kepada masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">
              Pencapaian Kami
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Komitmen kami dalam memberikan pelayanan terbaik tercermin dalam berbagai pencapaian yang telah diraih.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
                  {achievement.number}
                </div>
                <div className="text-blue-100 text-sm lg:text-base">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
