'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Globe, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Change i18next language
      await i18n.changeLanguage(languageCode)
      
      // Update URL with new locale
      const { pathname, asPath, query } = router
      
      // Remove current locale from pathname if it exists
      const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/'
      
      // Construct new path with locale
      const newPath = languageCode === 'id' 
        ? cleanPathname 
        : `/${languageCode}${cleanPathname}`
      
      // Navigate to new path
      router.push(newPath, asPath, { locale: languageCode })
      
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline-block mr-1">
            {currentLanguage.flag}
          </span>
          <span className="hidden md:inline-block">
            {currentLanguage.name}
          </span>
          <span className="md:hidden">
            {currentLanguage.code.toUpperCase()}
          </span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              language.code === i18n.language 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700'
            }`}
          >
            <span className="mr-3 text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {language.code === i18n.language && (
              <span className="text-blue-600 text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hook for easier language switching
export function useLanguage() {
  const { i18n } = useTranslation()
  const router = useRouter()

  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode)
      
      const { pathname, asPath, query } = router
      const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '') || '/'
      const newPath = languageCode === 'id' 
        ? cleanPathname 
        : `/${languageCode}${cleanPathname}`
      
      router.push(newPath, asPath, { locale: languageCode })
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    isIndonesian: i18n.language === 'id',
    isEnglish: i18n.language === 'en',
  }
}
