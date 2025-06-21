'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

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
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />
}: BreadcrumbProps) {
  const pathname = usePathname()
  const { t } = useTranslation('navigation')
  
  // Use provided items or generate from pathname
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)
  
  // Filter out home if showHome is false
  const displayItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1)
  
  if (displayItems.length <= 1) {
    return null
  }
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 flex-shrink-0">
                {separator}
              </span>
            )}
            
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
              >
                {index === 0 && showHome ? (
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span 
                className={cn(
                  'font-medium',
                  item.current 
                    ? 'text-gray-900' 
                    : 'text-gray-500'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {index === 0 && showHome ? (
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {item.label}
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
