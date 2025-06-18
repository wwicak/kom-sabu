'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'
import { Eye, EyeOff, Shield, Lock, User, AlertTriangle } from 'lucide-react'
import { z } from 'zod'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  turnstileToken: z.string().min(1, 'Security verification is required')
})

type LoginForm = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<LoginForm>>({
    username: '',
    password: '',
    turnstileToken: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [turnstileKey, setTurnstileKey] = useState(0) // For resetting Turnstile

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          credentials: 'include'
        })
        
        if (response.ok) {
          router.push('/admin/dashboard')
        }
      } catch (error) {
        // User not logged in, continue with login page
      }
    }
    
    checkAuth()
  }, [router])

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    
    // Clear general error
    if (error) {
      setError(null)
    }
  }

  const handleTurnstileVerify = (token: string) => {
    handleInputChange('turnstileToken', token)
  }

  const handleTurnstileError = (error: string) => {
    setError(`Security verification failed: ${error}`)
    setFormData(prev => ({ ...prev, turnstileToken: '' }))
  }

  const handleTurnstileExpire = () => {
    setError('Security verification expired. Please verify again.')
    setFormData(prev => ({ ...prev, turnstileToken: '' }))
  }

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData)
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message
          }
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          turnstileToken: formData.turnstileToken
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Success - redirect to dashboard
      router.push('/admin/dashboard')
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      
      // Reset Turnstile widget on error
      setTurnstileKey(prev => prev + 1)
      setFormData(prev => ({ ...prev, turnstileToken: '' }))
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Pemerintah Kabupaten Sabu Raijua
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Secure Access</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`pl-10 ${validationErrors.username ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-red-500 text-sm">{validationErrors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-sm">{validationErrors.password}</p>
                )}
              </div>

              {/* Turnstile Widget */}
              <div className="space-y-2">
                <Label>Security Verification</Label>
                <TurnstileWidget
                  key={turnstileKey}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  theme="light"
                  size="normal"
                  className="w-full"
                />
                {validationErrors.turnstileToken && (
                  <p className="text-red-500 text-sm">{validationErrors.turnstileToken}</p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !formData.turnstileToken}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-xs text-center">
                🔒 This is a secure government system. All access attempts are logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Pemerintah Kabupaten Sabu Raijua</p>
          <p>Protected by Cloudflare Turnstile</p>
        </div>
      </div>
    </div>
  )
}
