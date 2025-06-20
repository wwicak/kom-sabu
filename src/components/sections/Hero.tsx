'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { ArrowRight, Play } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const { t } = useTranslation('hero')

  return (
    <section className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/sabu-raijua-mountain.jpg"
          alt="Keindahan Gunung Sabu Raijua"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='48' fill='%23ffffff'%3EKeindahan Gunung Sabu Raijua%3C/text%3E%3C/svg%3E"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <span className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
                PEMERINTAHAN SABU RAIJUA
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              <span className="block text-yellow-400 mb-2">{t('title')}</span>
              <span className="block">{t('subtitle')}</span>
            </h1>

            <p className="mt-6 text-xl leading-8 text-gray-200 max-w-2xl">
              {t('tagline')}
            </p>

            <p className="mt-4 text-lg leading-7 text-gray-300 max-w-2xl">
              {t('description')}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold">
                <Link href="/layanan" className="flex items-center">
                  {t('cta_services')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-900"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                {t('cta_explore')}
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400">63</div>
                <div className="text-sm text-blue-200">{t('stats.villages')}</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-yellow-400">6</div>
                <div className="text-sm text-blue-200">{t('stats.districts')}</div>
              </div>
              <div className="text-center lg:text-left col-span-2 lg:col-span-1">
                <div className="text-3xl font-bold text-yellow-400">94.8K</div>
                <div className="text-sm text-blue-200">{t('stats.population')}</div>
              </div>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/sabu-raijua-hero.jpg"
                  alt="Pemandangan Kabupaten Sabu Raijua"
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image doesn't exist
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%236b7280'%3ESabu Raijua%3C/text%3E%3C/svg%3E"
                  }}
                />

                {/* Play Button Overlay */}
                {!isVideoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110"
                      aria-label="Play video"
                    >
                      <Play className="h-8 w-8 text-blue-900 ml-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 text-blue-900">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Layanan Online</div>
              </div>

              <div className="absolute -top-6 -right-6 bg-yellow-400 rounded-lg shadow-lg p-4 text-blue-900">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Transparan</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              aria-label="Close video"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Profil Kabupaten Sabu Raijua"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
