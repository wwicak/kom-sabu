'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Info, 
  Image as ImageIcon, 
  Newspaper, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Activity,
  Menu,
  X
} from 'lucide-react'

interface SidebarLayoutProps {
  children: ReactNode
  title?: string
}

const sidebarItems = [
  { name: 'Informasi Umum', href: '/informasi-umum', icon: Info },
  { name: 'Galeri', href: '/galeri', icon: ImageIcon },
  { name: 'Berita', href: '/berita', icon: Newspaper },
  { name: 'Pengumuman', href: '/pengumuman', icon: Users },
  { name: 'Artikel', href: '/artikel', icon: FileText },
  { name: 'Informasi Jabatan', href: '/informasi-jabatan', icon: Users },
  { name: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'Masukan Publik', href: '/masukan-publik', icon: MessageSquare },
  { name: 'Log Aktivitas', href: '/log-aktivitas', icon: Activity },
]

export function SidebarLayout({ children, title }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">PEMERINTAHAN</h1>
              <p className="text-sm text-gray-600">SABU RAIJUA</p>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-20 lg:pt-0">
            {/* Content Label */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Content
              </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-yellow-100 text-yellow-800 border-r-2 border-yellow-500' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IconComponent className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-yellow-600' : 'text-gray-400'}
                    `} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t">
              <div className="text-xs text-gray-500">
                © Aistech Solution. 2022
              </div>
              <div className="flex space-x-4 mt-2">
                <Link href="/faq" className="text-xs text-gray-500 hover:text-gray-700">
                  FAQ
                </Link>
                <Link href="/license" className="text-xs text-gray-500 hover:text-gray-700">
                  License
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-6 py-8">
            {title && (
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
