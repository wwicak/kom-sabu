'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: (error: string) => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
}

// Declare global turnstile
declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: any) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  theme = 'light',
  size = 'normal',
  className = ''
}: TurnstileWidgetProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const isRenderingRef = useRef(false)
  const callbacksRef = useRef({ onVerify, onError, onExpire })

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

  // Update callbacks ref without triggering re-renders
  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire }
  }, [onVerify, onError, onExpire])

  // Stable callback functions that don't change
  const handleVerify = useCallback((token: string) => {
    setError(null)
    callbacksRef.current.onVerify(token)
  }, [])

  const handleError = useCallback((error: string) => {
    console.error('Turnstile verification error:', error)
    setError(error)
    callbacksRef.current.onError?.(error)
  }, [])

  const handleExpire = useCallback(() => {
    setError('Verification expired. Please try again.')
    callbacksRef.current.onExpire?.()
  }, [])

  useEffect(() => {
    if (!siteKey) {
      const errorMsg = 'Cloudflare Turnstile site key not configured'
      setError(errorMsg)
      callbacksRef.current.onError?.(errorMsg)
      console.error(errorMsg)
      return
    }

    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return
    }

    isInitializedRef.current = true

    // Load Turnstile script
    const loadTurnstile = () => {
      // Check if script is already loaded
      if (window.turnstile) {
        renderWidget()
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="turnstile"]')
      if (existingScript) {
        existingScript.addEventListener('load', renderWidget)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = () => renderWidget()
      script.onerror = () => {
        console.error('Failed to load Turnstile script')
        setError('Failed to load security verification')
        onError?.('Failed to load security verification')
        isInitializedRef.current = false
      }
      document.head.appendChild(script)
    }

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) {
        console.error('Turnstile not available or container not found')
        return
      }

      // Check if widget already exists or is being rendered
      if (widgetId || isRenderingRef.current) {
        return
      }

      isRenderingRef.current = true

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: handleVerify,
          'error-callback': handleError,
          'expired-callback': handleExpire,
          theme,
          size,
          action: 'admin-login',
          cData: 'sabu-raijua-admin',
        })
        setWidgetId(id)
        setIsLoaded(true)
      } catch (err) {
        console.error('Error rendering Turnstile widget:', err)
        setError('Failed to render security verification')
        callbacksRef.current.onError?.('Failed to render security verification')
        isInitializedRef.current = false
      } finally {
        isRenderingRef.current = false
      }
    }

    loadTurnstile()

    // Cleanup function
    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId)
          setWidgetId(null)
          setIsLoaded(false)
        } catch (err) {
          console.warn('Error removing Turnstile widget:', err)
        }
      }
      isInitializedRef.current = false
      isRenderingRef.current = false
    }
  }, [siteKey, theme, size, handleVerify, handleError, handleExpire]) // Only stable dependencies

  // Reset the widget
  const reset = useCallback(() => {
    if (window.turnstile && widgetId) {
      try {
        window.turnstile.reset(widgetId)
        setError(null)
      } catch (err) {
        console.warn('Error resetting Turnstile widget:', err)
      }
    }
  }, [widgetId])

  // Expose reset method
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetTurnstile = reset
    }
  }, [reset])

  if (!siteKey) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-700 text-sm">
          Security verification unavailable. Please contact administrator.
        </p>
      </div>
    )
  }

  return (
    <div className={`turnstile-container ${className}`}>
      {!isLoaded && (
        <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading security verification...</span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          display: isLoaded ? 'block' : 'none'
        }}
      />

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={reset}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

// Server-side verification function
export async function verifyTurnstileToken(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error('Cloudflare Turnstile secret key not configured')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(ip && { remoteip: ip }),
      }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error('Turnstile verification failed:', result['error-codes'])
      return false
    }

    return true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}

// Rate limiting for failed attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const attempts = failedAttempts.get(ip)

  if (!attempts) {
    return true
  }

  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    failedAttempts.delete(ip)
    return true
  }

  return attempts.count < maxAttempts
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: now }

  failedAttempts.set(ip, {
    count: attempts.count + 1,
    lastAttempt: now
  })
}

export function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip)
}
