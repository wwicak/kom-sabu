import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { LayoutProps } from '@/types'

interface MainLayoutProps extends LayoutProps {
  children: ReactNode
}

export function Layout({ children, title, description }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
