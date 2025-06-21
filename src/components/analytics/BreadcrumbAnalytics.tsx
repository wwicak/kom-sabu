'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface BreadcrumbClickEvent {
  action: 'breadcrumb_click'
  category: 'navigation'
  label: string
  value?: number
  custom_parameters?: {
    source_page: string
    target_page: string
    breadcrumb_position: number
    breadcrumb_depth: number
    user_session_id?: string
    timestamp: string
  }
}

interface BreadcrumbViewEvent {
  action: 'breadcrumb_view'
  category: 'navigation'
  label: string
  custom_parameters?: {
    page_url: string
    breadcrumb_depth: number
    breadcrumb_items: string[]
    user_session_id?: string
    timestamp: string
  }
}

// Analytics service interface
interface AnalyticsService {
  track: (event: BreadcrumbClickEvent | BreadcrumbViewEvent) => void
}

// Google Analytics 4 implementation
class GA4Analytics implements AnalyticsService {
  track(event: BreadcrumbClickEvent | BreadcrumbViewEvent) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: 'value' in event ? event.value : undefined,
        custom_parameters: event.custom_parameters
      })
    }
  }
}

// Custom analytics implementation for internal tracking
class CustomAnalytics implements AnalyticsService {
  private endpoint = '/api/analytics/breadcrumb'

  async track(event: BreadcrumbClickEvent | BreadcrumbViewEvent) {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`
        })
      })
    } catch (error) {
      console.warn('Failed to track breadcrumb analytics:', error)
    }
  }
}

// Analytics manager
class BreadcrumbAnalyticsManager {
  private services: AnalyticsService[] = []
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()

    // Initialize analytics services
    if (process.env.NODE_ENV === 'production') {
      this.services.push(new GA4Analytics())
    }

    // Always include custom analytics for internal insights
    this.services.push(new CustomAnalytics())
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  trackBreadcrumbView(pathname: string, breadcrumbItems: string[]) {
    const event: BreadcrumbViewEvent = {
      action: 'breadcrumb_view',
      category: 'navigation',
      label: pathname,
      custom_parameters: {
        page_url: pathname,
        breadcrumb_depth: breadcrumbItems.length,
        breadcrumb_items: breadcrumbItems,
        user_session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.services.forEach(service => service.track(event))
  }

  trackBreadcrumbClick(
    sourcePage: string,
    targetPage: string,
    position: number,
    totalDepth: number,
    label: string
  ) {
    const event: BreadcrumbClickEvent = {
      action: 'breadcrumb_click',
      category: 'navigation',
      label,
      value: position,
      custom_parameters: {
        source_page: sourcePage,
        target_page: targetPage,
        breadcrumb_position: position,
        breadcrumb_depth: totalDepth,
        user_session_id: this.sessionId,
        timestamp: new Date().toISOString()
      }
    }

    this.services.forEach(service => service.track(event))
  }
}

// Global analytics manager instance
let analyticsManager: BreadcrumbAnalyticsManager | null = null

function getAnalyticsManager(): BreadcrumbAnalyticsManager {
  if (!analyticsManager) {
    analyticsManager = new BreadcrumbAnalyticsManager()
  }
  return analyticsManager
}

// Hook for tracking breadcrumb views
export function useBreadcrumbAnalytics(breadcrumbItems: string[]) {
  const pathname = usePathname()

  useEffect(() => {
    if (breadcrumbItems.length > 1) {
      const manager = getAnalyticsManager()
      manager.trackBreadcrumbView(pathname, breadcrumbItems)
    }
  }, [pathname, breadcrumbItems])
}

// Function for tracking breadcrumb clicks
export function trackBreadcrumbClick(
  targetHref: string,
  position: number,
  totalDepth: number,
  label: string
) {
  if (typeof window !== 'undefined') {
    const manager = getAnalyticsManager()
    const sourcePage = window.location.pathname
    manager.trackBreadcrumbClick(sourcePage, targetHref, position, totalDepth, label)
  }
}

// Component for automatic breadcrumb analytics
interface BreadcrumbAnalyticsProps {
  breadcrumbItems: Array<{ label: string; href?: string }>
}

export function BreadcrumbAnalytics({ breadcrumbItems }: BreadcrumbAnalyticsProps) {
  const itemLabels = breadcrumbItems.map(item => item.label)

  // Track breadcrumb view
  useBreadcrumbAnalytics(itemLabels)

  return null // This component doesn't render anything
}

// Enhanced breadcrumb link component with analytics
interface AnalyticsLinkProps {
  href: string
  children: React.ReactNode
  position: number
  totalDepth: number
  label: string
  className?: string
  onClick?: () => void
}

export function BreadcrumbAnalyticsLink({
  href,
  children,
  position,
  totalDepth,
  label,
  className,
  onClick
}: AnalyticsLinkProps) {
  const handleClick = () => {
    trackBreadcrumbClick(href, position, totalDepth, label)
    onClick?.()
  }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

// Utility function to get breadcrumb analytics insights
export async function getBreadcrumbAnalytics(
  startDate?: string,
  endDate?: string
): Promise<{
  totalViews: number
  totalClicks: number
  clickThroughRate: number
  popularPaths: Array<{ path: string; views: number; clicks: number }>
  dropOffPoints: Array<{ position: number; dropOffRate: number }>
}> {
  try {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)

    const response = await fetch(`/api/analytics/breadcrumb/insights?${params}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch breadcrumb analytics:', error)
    return {
      totalViews: 0,
      totalClicks: 0,
      clickThroughRate: 0,
      popularPaths: [],
      dropOffPoints: []
    }
  }
}

export default BreadcrumbAnalytics
