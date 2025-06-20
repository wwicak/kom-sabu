import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kabupaten Sabu Raijua - Portal Resmi Pemerintah",
    template: "%s | Kabupaten Sabu Raijua"
  },
  description: "Portal resmi Pemerintah Kabupaten Sabu Raijua, Nusa Tenggara Timur. Informasi layanan publik, berita terkini, profil daerah, dan potensi wisata budaya.",
  keywords: [
    "Sabu Raijua",
    "Kabupaten Sabu Raijua",
    "Pemerintah Sabu Raijua",
    "NTT",
    "Nusa Tenggara Timur",
    "Layanan Publik",
    "Wisata Sabu",
    "Budaya Sabu",
    "Tenun Ikat",
    "Pulau Sabu",
    "Pulau Raijua"
  ],
  authors: [{ name: "Pemerintah Kabupaten Sabu Raijua" }],
  creator: "Pemerintah Kabupaten Sabu Raijua",
  publisher: "Pemerintah Kabupaten Sabu Raijua",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://saburajua.go.id'),
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    title: 'Kabupaten Sabu Raijua - Portal Resmi Pemerintah',
    description: 'Portal resmi Pemerintah Kabupaten Sabu Raijua, Nusa Tenggara Timur. Informasi layanan publik, berita terkini, profil daerah, dan potensi wisata budaya.',
    siteName: 'Kabupaten Sabu Raijua',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kabupaten Sabu Raijua',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kabupaten Sabu Raijua - Portal Resmi Pemerintah',
    description: 'Portal resmi Pemerintah Kabupaten Sabu Raijua, Nusa Tenggara Timur.',
    images: ['/images/twitter-image.jpg'],
    creator: '@SabuRaijuaKab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Pemerintah Kabupaten Sabu Raijua",
    "alternateName": "Pemkab Sabu Raijua",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://saburajua.go.id",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://saburajua.go.id"}/images/logo-sabu-raijua.png`,
    "description": "Pemerintah Kabupaten Sabu Raijua, Nusa Tenggara Timur",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Diponegoro No. 1",
      "addressLocality": "Seba",
      "addressRegion": "Sabu Raijua",
      "postalCode": "85391",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-380-21001",
      "contactType": "customer service",
      "email": "info@saburajua.go.id",
      "availableLanguage": ["Indonesian"]
    },
    "sameAs": [
      "https://www.facebook.com/PemkabSabuRaijua",
      "https://www.instagram.com/saburajuakab",
      "https://twitter.com/SabuRaijuaKab",
      "https://www.youtube.com/c/PemkabSabuRaijua"
    ],
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Kabupaten Sabu Raijua",
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "Nusa Tenggara Timur"
      }
    }
  }

  return (
    <html lang="id" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tiles.openfreemap.org" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sabu Raijua" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
