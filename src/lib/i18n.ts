import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import Indonesian translation files
import idCommon from '../../public/locales/id/common.json'
import idNavigation from '../../public/locales/id/navigation.json'
import idHero from '../../public/locales/id/hero.json'
import idAbout from '../../public/locales/id/about.json'
import idCulture from '../../public/locales/id/culture.json'
import idKecamatan from '../../public/locales/id/kecamatan.json'
import idServices from '../../public/locales/id/services.json'
import idContact from '../../public/locales/id/contact.json'
import idFooter from '../../public/locales/id/footer.json'
import idHeader from '../../public/locales/id/header.json'
import idAuth from '../../public/locales/id/auth.json'
import idAdmin from '../../public/locales/id/admin.json'

// Import English translation files
import enCommon from '../../public/locales/en/common.json'
import enNavigation from '../../public/locales/en/navigation.json'
import enHero from '../../public/locales/en/hero.json'
import enAbout from '../../public/locales/en/about.json'
import enCulture from '../../public/locales/en/culture.json'
import enKecamatan from '../../public/locales/en/kecamatan.json'
import enServices from '../../public/locales/en/services.json'
import enContact from '../../public/locales/en/contact.json'
import enFooter from '../../public/locales/en/footer.json'
import enHeader from '../../public/locales/en/header.json'
import enAuth from '../../public/locales/en/auth.json'
import enAdmin from '../../public/locales/en/admin.json'

const resources = {
  id: {
    common: idCommon,
    navigation: idNavigation,
    hero: idHero,
    about: idAbout,
    culture: idCulture,
    kecamatan: idKecamatan,
    services: idServices,
    contact: idContact,
    footer: idFooter,
    header: idHeader,
    auth: idAuth,
    admin: idAdmin,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    hero: enHero,
    about: enAbout,
    culture: enCulture,
    kecamatan: enKecamatan,
    services: enServices,
    contact: enContact,
    footer: enFooter,
    header: enHeader,
    auth: enAuth,
    admin: enAdmin,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // default language
    fallbackLng: 'id',
    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'hero',
      'about',
      'culture',
      'kecamatan',
      'services',
      'contact',
      'footer',
      'header',
      'auth',
      'admin'
    ],
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n
