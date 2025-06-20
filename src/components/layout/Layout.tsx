import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Toaster } from '@/components/ui/toaster'
import { LayoutProps } from '@/types'

interface MainLayoutProps extends LayoutProps {
  children: ReactNode
}

export function Layout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
