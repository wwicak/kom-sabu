'use client'

import Link from 'next/link'
import { COMPANY_INFO, NAVIGATION_ITEMS } from '@/constants'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
}

export function Footer() {
  const { t } = useTranslation('footer')
  const { t: tNav } = useTranslation('navigation')

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SR</span>
              </div>
              <h3 className="text-xl font-bold">{t('company_name')}</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">
                  {COMPANY_INFO.address.street}, {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.zipCode}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">{COMPANY_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('navigation')}</h4>
            <nav className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  {tNav(item.name)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Additional Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('information')}</h4>
            <nav className="space-y-2">
              <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                {t('links.privacy_policy')}
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors">
                {t('links.terms_conditions')}
              </Link>
              <Link href="/sitemap" className="block text-gray-300 hover:text-white transition-colors">
                {t('links.sitemap')}
              </Link>
              <Link href="/accessibility" className="block text-gray-300 hover:text-white transition-colors">
                {t('links.accessibility')}
              </Link>
            </nav>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {Object.entries(COMPANY_INFO.socialMedia).map(([platform, url]) => {
                if (!url) return null
                const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                if (!IconComponent) return null

                return (
                  <Link
                    key={platform}
                    href={url}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Follow us on ${platform}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="h-6 w-6" />
                  </Link>
                )
              })}
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {t('company_name')}. {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
