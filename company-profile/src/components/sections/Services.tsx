import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/constants'
import { Users, FileText, Heart, Activity, ArrowRight } from 'lucide-react'

const iconMap = {
  users: Users,
  fileText: FileText,
  heart: Heart,
  activity: Activity,
}

export function Services() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Layanan Publik
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan publik yang mudah diakses, cepat, dan transparan untuk memenuhi kebutuhan masyarakat Sabu Raijua.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Users
            
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </CardDescription>
                  
                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        +{service.features.length - 3} layanan lainnya
                      </li>
                    )}
                  </ul>
                  
                  <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Butuh Bantuan Layanan Lainnya?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7 untuk semua kebutuhan layanan publik. 
            Hubungi kami melalui berbagai saluran komunikasi yang tersedia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/kontak">
                Hubungi Kami
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/layanan">
                Lihat Semua Layanan
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">Online</div>
            <div className="text-blue-100 mb-4">Layanan 24/7</div>
            <Button variant="secondary" size="sm">
              Akses Portal
            </Button>
          </div>
          
          <div className="bg-green-600 text-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">Cepat</div>
            <div className="text-green-100 mb-4">Proses Maksimal 3 Hari</div>
            <Button variant="secondary" size="sm">
              Cek Status
            </Button>
          </div>
          
          <div className="bg-yellow-500 text-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold mb-2">Gratis</div>
            <div className="text-yellow-100 mb-4">Konsultasi & Informasi</div>
            <Button variant="secondary" size="sm">
              Chat Sekarang
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
