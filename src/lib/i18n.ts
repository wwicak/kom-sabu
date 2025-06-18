import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import idNavigation from '../../public/locales/id/navigation.json'
import idHero from '../../public/locales/id/hero.json'
import idCulture from '../../public/locales/id/culture.json'

import enNavigation from '../../public/locales/en/navigation.json'
import enHero from '../../public/locales/en/hero.json'
import enCulture from '../../public/locales/en/culture.json'

const resources = {
  id: {
    navigation: idNavigation,
    hero: idHero,
    culture: idCulture,
  },
  en: {
    navigation: enNavigation,
    hero: enHero,
    culture: enCulture,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // default language
    fallbackLng: 'id',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
  })

export default i18n
