import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Eye, Heart, Users, Lightbulb, Shield } from 'lucide-react'

export default function VisiMisiPage() {
  const strategicGoals = [
    {
      icon: Users,
      title: 'Peningkatan Kualitas SDM',
      description: 'Mengembangkan sumber daya manusia yang berkualitas melalui pendidikan dan pelatihan',
      color: 'bg-blue-500'
    },
    {
      icon: Heart,
      title: 'Pelayanan Kesehatan Prima',
      description: 'Menyediakan layanan kesehatan yang merata dan berkualitas untuk seluruh masyarakat',
      color: 'bg-red-500'
    },
    {
      icon: Lightbulb,
      title: 'Inovasi dan Teknologi',
      description: 'Menerapkan teknologi modern dalam pelayanan publik dan pembangunan',
      color: 'bg-yellow-500'
    },
    {
      icon: Shield,
      title: 'Tata Kelola Pemerintahan',
      description: 'Mewujudkan pemerintahan yang bersih, transparan, dan akuntabel',
      color: 'bg-green-500'
    }
  ]

  const missionPoints = [
    {
      number: '01',
      title: 'Pembangunan Infrastruktur',
      description: 'Membangun dan meningkatkan infrastruktur dasar yang mendukung pertumbuhan ekonomi dan kesejahteraan masyarakat'
    },
    {
      number: '02',
      title: 'Pengembangan Ekonomi Lokal',
      description: 'Mengembangkan potensi ekonomi daerah berbasis sumber daya lokal dan kearifan tradisional'
    },
    {
      number: '03',
      title: 'Peningkatan Kualitas Pendidikan',
      description: 'Meningkatkan akses dan kualitas pendidikan untuk mencerdaskan kehidupan bangsa'
    },
    {
      number: '04',
      title: 'Pelayanan Kesehatan Berkualitas',
      description: 'Menyediakan pelayanan kesehatan yang merata, terjangkau, dan berkualitas'
    },
    {
      number: '05',
      title: 'Pelestarian Budaya',
      description: 'Melestarikan dan mengembangkan nilai-nilai budaya lokal sebagai identitas daerah'
    },
    {
      number: '06',
      title: 'Pemberdayaan Masyarakat',
      description: 'Memberdayakan masyarakat untuk berpartisipasi aktif dalam pembangunan daerah'
    }
  ]

  const coreValues = [
    {
      letter: 'S',
      word: 'Spiritual',
      description: 'Menjunjung tinggi nilai-nilai spiritual dan moral dalam setiap tindakan'
    },
    {
      letter: 'A',
      word: 'Amanah',
      description: 'Menjalankan tugas dan tanggung jawab dengan penuh amanah dan integritas'
    },
    {
      letter: 'B',
      word: 'Bersih',
      description: 'Menerapkan prinsip pemerintahan yang bersih dari korupsi, kolusi, dan nepotisme'
    },
    {
      letter: 'U',
      word: 'Unggul',
      description: 'Berusaha memberikan pelayanan dan hasil kerja yang unggul dan berkualitas'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Visi & Misi Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Arah dan tujuan pembangunan Kabupaten Sabu Raijua untuk mewujudkan
            masyarakat yang sejahtera, mandiri, dan berbudaya.
          </p>
        </div>

        {/* Visi */}
        <div className="mb-12">
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-600 rounded-full">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-blue-900">VISI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <blockquote className="text-xl md:text-2xl font-semibold text-blue-900 leading-relaxed">
                &ldquo;Terwujudnya Kabupaten Sabu Raijua yang Maju, Mandiri, dan Berbudaya
                Menuju Masyarakat yang Sejahtera Berbasis Kearifan Lokal&rdquo;
              </blockquote>
            </CardContent>
          </Card>
        </div>

        {/* Misi */}
        <div className="mb-12">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-600 rounded-full">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-900">MISI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {missionPoints.map((mission, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {mission.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {mission.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {mission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategic Goals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tujuan Strategis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategicGoals.map((goal, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 ${goal.color} rounded-full`}>
                      <goal.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Nilai-Nilai Dasar</CardTitle>
              <p className="text-gray-600">Prinsip yang menjadi landasan dalam setiap tindakan</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {coreValues.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {value.letter}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{value.word}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Strategi Implementasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Badge className="mb-3 bg-blue-600">Jangka Pendek</Badge>
                <h4 className="font-semibold mb-2">2024-2026</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Peningkatan infrastruktur dasar</li>
                  <li>• Reformasi birokrasi</li>
                  <li>• Digitalisasi pelayanan</li>
                </ul>
              </div>
              <div className="text-center">
                <Badge className="mb-3 bg-green-600">Jangka Menengah</Badge>
                <h4 className="font-semibold mb-2">2027-2029</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Pengembangan ekonomi kreatif</li>
                  <li>• Peningkatan kualitas SDM</li>
                  <li>• Konservasi lingkungan</li>
                </ul>
              </div>
              <div className="text-center">
                <Badge className="mb-3 bg-purple-600">Jangka Panjang</Badge>
                <h4 className="font-semibold mb-2">2030-2035</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Kemandirian ekonomi daerah</li>
                  <li>• Masyarakat sejahtera</li>
                  <li>• Pelestarian budaya berkelanjutan</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
