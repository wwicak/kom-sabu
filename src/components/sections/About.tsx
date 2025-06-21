'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Target, Eye, Award, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation('about')
  const { t: tCommon } = useTranslation('common')
  const values = [
    {
      icon: Target,
      title: t('values.vision.title'),
      description: t('values.vision.description'),
    },
    {
      icon: Eye,
      title: t('values.mission.title'),
      description: t('values.mission.description'),
    },
    {
      icon: Award,
      title: t('values.values.title'),
      description: t('values.values.description'),
    },
    {
      icon: Users,
      title: t('values.commitment.title'),
      description: t('values.commitment.description'),
    },
  ]

  const achievements = [
    { number: '95%', label: t('achievements.items.satisfaction') },
    { number: '100%', label: t('achievements.items.transparency') },
    { number: '24/7', label: t('achievements.items.online_service') },
    { number: '63', label: t('achievements.items.villages_served') },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {t('description_1')}
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {t('description_2')}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('description_3')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/profil">
                  {tCommon('read_more')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/galeri">
                  {tCommon('gallery')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/sabu-raijua-landscape.jpg"
                alt={t('image_alt')}
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
                      <div className="text-sm text-gray-600">{t('stats.districts')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">63</div>
                      <div className="text-sm text-gray-600">{t('stats.villages')}</div>
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
              {t('values.title')}
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
              {t('achievements.title')}
            </h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              {t('achievements.subtitle')}
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
