'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { NAVIGATION_ITEMS, COMPANY_INFO } from '@/constants'
import { Menu, X, Phone, Mail, MapPin, Search, ChevronDown } from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'

export function Header() {
  const { t: tHeader } = useTranslation('header')
  const { t: tNav } = useTranslation('navigation')
  const { t: tCommon } = useTranslation('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-xs py-2 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>(0380) 21001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>info@saburajua.go.id</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Jl. Diponegoro No. 1, Seba</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs">{tHeader('working_hours')}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-sm'
          }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                aria-label={`${COMPANY_INFO.name} homepage`}
              >
                <div className="relative">
                  <div className="h-14 w-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">SR</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🇮🇩</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-lg font-bold text-gray-900 leading-tight">
                    {tHeader('government_name')}
                  </div>
                  <div className="text-xl font-bold text-blue-600 leading-tight">
                    {tHeader('regency_name')}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {tHeader('province')}
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAVIGATION_ITEMS.map((item) => (
                <div key={item.name} className="relative group">
                  {item.children ? (
                    // Dropdown menu item
                    <>
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg group"
                      >
                        {tNav(item.name)}
                        <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                      </Link>
                      <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 group-hover:delay-75">
                        <div className="py-2">
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium border-b border-gray-100"
                          >
                            {tHeader('all')} {tNav(item.name)}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Regular menu item
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative group whitespace-nowrap"
                    >
                      {tNav(item.name)}
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder={tHeader('search_placeholder')}
                      className="w-64 pr-10"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1"
                      onClick={() => setSearchOpen(false)}
                      aria-label={tHeader('close_search')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchOpen(true)}
                    className="text-gray-600 hover:text-blue-600"
                    aria-label={tHeader('open_search')}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Emergency Contact */}
              <Button variant="outline" size="sm" asChild>
                <Link href="/kontak" className="text-red-600 border-red-200 hover:bg-red-50">
                  {tHeader('emergency')}
                </Link>
              </Button>

              {/* Main CTA */}
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/layanan">
                  {tHeader('public_services')}
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-600 hover:text-blue-600 md:hidden"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                className="text-gray-600 hover:text-blue-600"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden px-4 py-3 border-t border-gray-200">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={tHeader('search_placeholder_mobile')}
                  className="w-full pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchOpen(false)}
                  aria-label={tHeader('close_search')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {NAVIGATION_ITEMS.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {tNav(item.name)}
                    </Link>
                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Actions */}
                <div className="pt-4 space-y-3 border-t border-gray-200 mt-4">
                  <Button variant="outline" asChild className="w-full text-red-600 border-red-200">
                    <Link href="/kontak" onClick={() => setMobileMenuOpen(false)}>
                      {tHeader('emergency')}
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/layanan" onClick={() => setMobileMenuOpen(false)}>
                      {tHeader('public_services')}
                    </Link>
                  </Button>

                  {/* Mobile Language Switcher */}
                  <div className="pt-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}
