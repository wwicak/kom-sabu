'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Music, MapPin, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function CulturalHeritage() {
  const culturalAssets = [
    {
      icon: Palette,
      title: 'Tenun Ikat Hawu',
      description: 'Kerajinan tenun tradisional dengan motif khas yang telah dikenal hingga mancanegara. Setiap motif memiliki makna filosofis yang mendalam dalam budaya Hawu.',
      image: '/images/culture/tenun-hawu.jpg',
      category: 'Kerajinan Tradisional'
    },
    {
      icon: Music,
      title: 'Tarian Ledo Hawu',
      description: 'Tarian sakral yang dipercaya dapat mengantarkan arwah ke tempat kedamaian abadi. Tarian ini menampilkan gerakan menghunus pedang dengan makna spiritual yang mendalam.',
      image: '/images/culture/ledo-hawu.jpg',
      category: 'Seni Pertunjukan'
    },
    {
      icon: MapPin,
      title: 'Bahasa Hawu',
      description: 'Bahasa daerah yang masih lestari dan digunakan dalam kehidupan sehari-hari masyarakat Sabu Raijua. Bahasa ini memiliki kekayaan kosakata yang unik.',
      image: '/images/culture/bahasa-hawu.jpg',
      category: 'Bahasa & Sastra'
    },
    {
      icon: Camera,
      title: 'Pantai Pasir Putih',
      description: 'Keindahan pantai-pantai eksotis dengan pasir putih halus dan air laut yang jernih. Pantai Raemea dan pantai-pantai di Pulau Raijua menjadi daya tarik utama.',
      image: '/images/culture/pantai-raijua.jpg',
      category: 'Wisata Alam'
    }
  ]

  const traditions = [
    {
      name: 'Jingi Tiu',
      description: 'Kepercayaan tradisional masyarakat Raijua yang masih dilestarikan hingga kini'
    },
    {
      name: 'Wara Tada',
      description: 'Tarian tradisional yang menggambarkan kehidupan sehari-hari masyarakat Hawu'
    },
    {
      name: 'Habba Koorai',
      description: 'Upacara adat yang dilakukan dalam berbagai perayaan penting'
    },
    {
      name: 'Pe Iu Manu',
      description: 'Ritual tradisional yang berkaitan dengan siklus kehidupan masyarakat'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
            Warisan Budaya Hawu
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kekayaan budaya Sabu Raijua yang telah diwariskan turun-temurun, mencerminkan
            identitas dan jati diri masyarakat Hawu yang unik dan autentik.
          </p>
        </div>

        {/* Cultural Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {culturalAssets.map((asset, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={asset.image}
                    alt={asset.title}
                    width={300}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {asset.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <asset.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {asset.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {asset.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traditional Practices */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tradisi & Upacara Adat
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berbagai tradisi dan upacara adat yang masih dilestarikan sebagai bagian
              dari identitas budaya masyarakat Sabu Raijua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((tradition, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {tradition.name}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tradition.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tourism Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Destinasi Wisata Unggulan
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pantai Raemea</h4>
                  <p className="text-gray-600 text-sm">Pantai dengan tebing berwarna unik dan pasir putih halus, ideal untuk snorkeling dan diving.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Pulau Raijua</h4>
                  <p className="text-gray-600 text-sm">Pulau kecil dengan keindahan alam yang masih alami dan budaya tradisional yang autentik.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Desa Wisata Tradisional</h4>
                  <p className="text-gray-600 text-sm">Pengalaman menginap di homestay dan menyaksikan proses pembuatan tenun ikat secara langsung.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Kuliner Khas</h4>
                  <p className="text-gray-600 text-sm">Wolapa, budu, due, donahu, dan berbagai kuliner tradisional dengan cita rasa yang unik.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/wisata">
                  Jelajahi Wisata
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/budaya">
                  Pelajari Budaya
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/tourism/sabu-raijua-tourism.jpg"
                alt="Wisata Sabu Raijua"
                width={500}
                height={384}
                className="w-full h-96 object-cover"
              />

              {/* Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white bg-opacity-95 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">2</div>
                      <div className="text-xs text-gray-600">Pulau Utama</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">15+</div>
                      <div className="text-xs text-gray-600">Pantai Eksotis</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">99%</div>
                      <div className="text-xs text-gray-600">Kristen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
