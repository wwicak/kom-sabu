'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { BreadcrumbStructuredData } from '@/components/seo/BreadcrumbStructuredData'
import { BreadcrumbAnalytics, trackBreadcrumbClick } from '@/components/analytics/BreadcrumbAnalytics'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
  includeStructuredData?: boolean
  baseUrl?: string
  enableAnalytics?: boolean
  maxItems?: number
  collapsible?: boolean
}

// Predefined route mappings for better UX
const ROUTE_MAPPINGS: Record<string, string> = {
  // Public routes
  '/': 'Beranda',
  '/profil': 'Profil',
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
function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  // Always start with home
  items.push({
    label: 'Beranda',
    href: '/',
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
      href: isLast ? undefined : currentPath,
      current: isLast,
    })
  })

  return items
}

export function Breadcrumb({
  items,
  className,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  includeStructuredData = true,
  baseUrl = 'https://saburajua.go.id',
  enableAnalytics = true,
  maxItems = 4,
  collapsible = true
}: BreadcrumbProps) {
  const pathname = usePathname()

  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  // Filter out home if showHome is false
  let displayItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1)

  if (displayItems.length <= 1) {
    return null
  }

  // Handle mobile responsiveness with collapsible breadcrumbs
  const shouldCollapse = collapsible && displayItems.length > maxItems
  if (shouldCollapse) {
    const firstItem = displayItems[0]
    const lastItems = displayItems.slice(-2) // Show last 2 items
    displayItems = [
      firstItem,
      { label: '...', href: undefined, current: false },
      ...lastItems
    ]
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {includeStructuredData && (
        <BreadcrumbStructuredData items={breadcrumbItems} baseUrl={baseUrl} />
      )}

      {/* Analytics Tracking */}
      {enableAnalytics && (
        <BreadcrumbAnalytics breadcrumbItems={breadcrumbItems} />
      )}

      <nav
        aria-label="Breadcrumb"
        className={cn(
          'flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide',
          'sm:overflow-visible', // Allow overflow on mobile, hide on desktop
          className
        )}
      >
        <ol className="flex items-center space-x-1 min-w-max sm:min-w-0">
          {displayItems.map((item, index) => (
            <li key={index} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <span className="mx-1 sm:mx-2 flex-shrink-0">
                  {separator}
                </span>
              )}

              {item.label === '...' ? (
                <span className="text-gray-400 font-medium px-1">
                  {item.label}
                </span>
              ) : item.href && !item.current ? (
                <Link
                  href={item.href}
                  className={cn(
                    'text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium',
                    'truncate max-w-[120px] sm:max-w-none', // Truncate on mobile
                    'hover:underline focus:underline focus:outline-none'
                  )}
                  onClick={() => {
                    if (enableAnalytics) {
                      trackBreadcrumbClick(
                        item.href!,
                        index,
                        displayItems.length,
                        item.label
                      )
                    }
                  }}
                  title={item.label} // Show full text on hover
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">Home</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-medium truncate max-w-[120px] sm:max-w-none',
                    item.current
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                  title={item.label} // Show full text on hover
                >
                  {index === 0 && showHome ? (
                    <span className="flex items-center">
                      <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">Home</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Breadcrumb with back button component
interface BreadcrumbWithBackProps extends BreadcrumbProps {
  backLabel?: string
  onBack?: () => void
  showBackButton?: boolean
}

export function BreadcrumbWithBack({
  backLabel = 'Kembali',
  onBack,
  showBackButton = true,
  ...breadcrumbProps
}: BreadcrumbWithBackProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <Breadcrumb {...breadcrumbProps} />

      {showBackButton && (
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
        >
          <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
          {backLabel}
        </button>
      )}
    </div>
  )
}

// Specialized admin breadcrumb
export function AdminBreadcrumb({ className, ...props }: Omit<BreadcrumbProps, 'showHome'>) {
  return (
    <Breadcrumb
      {...props}
      className={cn('bg-gray-50 px-4 py-2 rounded-lg', className)}
      showHome={false}
    />
  )
}

export default Breadcrumb
