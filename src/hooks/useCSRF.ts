import { useState, useEffect } from 'react'

interface CSRFTokenResponse {
  success: boolean
  csrfToken?: string
  error?: string
}

export function useCSRF() {
  const [csrfToken, setCSRFToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCSRFToken = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'same-origin',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CSRFTokenResponse = await response.json()

      if (data.success && data.csrfToken) {
        setCSRFToken(data.csrfToken)
      } else {
        throw new Error(data.error || 'Failed to get CSRF token')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CSRF token'
      setError(errorMessage)
      console.error('CSRF token fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = () => {
    fetchCSRFToken()
  }

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  return {
    csrfToken,
    isLoading,
    error,
    refreshToken,
  }
}

// Helper function to add CSRF token to fetch requests
export function createCSRFHeaders(csrfToken: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  }
}

// Helper function for form data requests with CSRF
export function createCSRFFormHeaders(csrfToken: string): HeadersInit {
  return {
    'X-CSRF-Token': csrfToken,
  }
}
