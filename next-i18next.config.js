/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: './public/locales',
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
    'auth',
    'admin'
  ],
  defaultNS: 'common',
  fallbackLng: 'id',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}
