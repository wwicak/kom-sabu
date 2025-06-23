'use client'

import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbStructuredDataProps {
  items?: BreadcrumbItem[]
  baseUrl?: string
}

// Route mappings for better SEO labels
const ROUTE_MAPPINGS: Record<string, string> = {
  // Public routes
  '/': 'Beranda',
  '/profil': 'Profil Kabupaten',
  '/profil/sejarah': 'Sejarah',
  '/profil/visi-misi': 'Visi & Misi',
  '/profil/struktur': 'Struktur Organisasi',
  '/profil/pejabat': 'Pejabat',
  '/pemerintahan': 'Pemerintahan',
  '/kecamatan': 'Kecamatan',
  '/peta-kecamatan': 'Peta Kecamatan',
  '/desa': 'Desa/Kelurahan',
  '/wisata': 'Wisata',
  '/wisata/alam': 'Wisata Alam',
  '/wisata/budaya': 'Wisata Budaya',
  '/wisata/kuliner': 'Kuliner',
  '/wisata/akomodasi': 'Akomodasi',
  '/budaya': 'Budaya',
  '/layanan': 'Layanan Publik',
  '/berita': 'Berita',
  '/kontak': 'Kontak',

  // Admin routes
  '/admin': 'Dashboard Admin',
  '/admin/destinations': 'Kelola Destinasi',
  '/admin/destinations/new': 'Tambah Destinasi',
  '/admin/cultural-heritage': 'Kelola Warisan Budaya',
  '/admin/cultural-heritage/new': 'Tambah Warisan Budaya',
  '/admin/services': 'Kelola Layanan Publik',
  '/admin/services/new': 'Tambah Layanan',
  '/admin/officials': 'Kelola Pejabat',
  '/admin/officials/new': 'Tambah Pejabat',
  '/admin/contacts': 'Pesan Kontak',
  '/admin/login': 'Login Admin',
}

// Generate breadcrumb items from pathname
function generateBreadcrumbItems(pathname: string, baseUrl: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Always start with home
  items.push({
    label: 'Beranda',
    href: baseUrl,
  })

  // Build breadcrumb path
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Get label from mapping or format segment
    let label = ROUTE_MAPPINGS[currentPath]

    if (!label) {
      // Format segment as fallback
      label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    items.push({
      label,
      href: isLast ? undefined : `${baseUrl}${currentPath}`,
      current: isLast,
    })
  })

  return items
}

// Generate JSON-LD structured data for breadcrumbs
function generateBreadcrumbStructuredData(items: BreadcrumbItem[], baseUrl: string) {
  const listItems = items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    "item": item.href || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`
  }))

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": listItems
  }
}

export function BreadcrumbStructuredData({
  items,
  baseUrl = 'https://saburajua.go.id'
}: BreadcrumbStructuredDataProps) {
  const pathname = usePathname()

  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbItems(pathname, baseUrl)

  // Don't render if only one item (home page)
  if (breadcrumbItems.length <= 1) {
    return null
  }

  const structuredData = generateBreadcrumbStructuredData(breadcrumbItems, baseUrl)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// Enhanced breadcrumb structured data with organization context
export function EnhancedBreadcrumbStructuredData({
  items,
  baseUrl = 'https://saburajua.go.id'
}: BreadcrumbStructuredDataProps) {
  const pathname = usePathname()

  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbItems(pathname, baseUrl)

  // Don't render if only one item (home page)
  if (breadcrumbItems.length <= 1) {
    return null
  }

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbItems, baseUrl)

  // Add organization context for government website
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Pemerintah Kabupaten Sabu Raijua",
    "alternateName": "Pemkab Sabu Raijua",
    "url": baseUrl,
    "logo": `${baseUrl}/images/logo-sabu-raijua.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Diponegoro No. 1",
      "addressLocality": "Seba",
      "addressRegion": "Nusa Tenggara Timur",
      "postalCode": "85391",
      "addressCountry": "ID"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-380-21001",
      "contactType": "customer service",
      "availableLanguage": ["Indonesian", "English"]
    },
    "sameAs": [
      "https://facebook.com/pemkabsaburajua",
      "https://twitter.com/saburajuakab",
      "https://instagram.com/saburajuakab"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData, null, 2)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData, null, 2)
        }}
      />
    </>
  )
}

export default BreadcrumbStructuredData
