'use client'

import { useEffect, useRef, useState } from 'react'
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: (error: string) => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  className?: string
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
  const turnstileRef = useRef<TurnstileInstance>(null)

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) {
      const errorMsg = 'Cloudflare Turnstile site key not configured'
      setError(errorMsg)
      onError?.(errorMsg)
      console.error(errorMsg)
    }
  }, [siteKey, onError])

  const handleVerify = (token: string) => {
    setError(null)
    onVerify(token)
  }

  const handleError = (error: string) => {
    setError(error)
    onError?.(error)
    console.error('Turnstile error:', error)
  }

  const handleExpire = () => {
    setError('Verification expired. Please try again.')
    onExpire?.()
  }

  const handleLoad = () => {
    setIsLoaded(true)
    setError(null)
  }

  // Reset the widget
  const reset = () => {
    turnstileRef.current?.reset()
    setError(null)
  }

  // Expose reset method
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetTurnstile = reset
    }
  }, [])

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
      
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        onLoad={handleLoad}
        options={{
          theme,
          size,
          action: 'admin-login',
          cData: 'sabu-raijua-admin',
        }}
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
