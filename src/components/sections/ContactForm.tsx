'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TurnstileWidget } from '@/components/security/TurnstileWidget'
import { contactFormSchema, type ContactFormData } from '@/lib/validations'
import { CONTACT_FORM_CONFIG } from '@/constants'
import { useCSRF, createCSRFHeaders } from '@/hooks/useCSRF'
import { Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ContactForm() {
  const { t } = useTranslation('contact')
  const { t: tCommon } = useTranslation('common')
  const { csrfToken, isLoading: csrfLoading, error: csrfError, refreshToken } = useCSRF()

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    consent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token)
    // Clear turnstile error if exists
    if (errors.turnstile) {
      setErrors(prev => ({ ...prev, turnstile: '' }))
    }
  }

  const handleTurnstileError = (error: string) => {
    setTurnstileToken('')
    setErrors(prev => ({ ...prev, turnstile: `Security verification failed: ${error}` }))
  }

  const handleTurnstileExpire = () => {
    setTurnstileToken('')
    setErrors(prev => ({ ...prev, turnstile: 'Security verification expired. Please verify again.' }))
  }

  const validateForm = () => {
    try {
      contactFormSchema.parse(formData)

      // Check Turnstile token
      if (!turnstileToken) {
        setErrors({ turnstile: 'Security verification is required' })
        return false
      }

      // Check CSRF token
      if (!csrfToken) {
        setErrors({ csrf: 'Security token is required' })
        return false
      }

      setErrors({})
      return true
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {}
      if (error?.errors) {
        error.errors.forEach((err: { path?: string[]; message: string }) => {
          if (err.path && err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
      }

      // Add Turnstile validation
      if (!turnstileToken) {
        fieldErrors.turnstile = 'Security verification is required'
      }

      // Add CSRF validation
      if (!csrfToken) {
        fieldErrors.csrf = 'Security token is required'
      }

      setErrors(fieldErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: createCSRFHeaders(csrfToken),
        body: JSON.stringify({
          ...formData,
          turnstileToken
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage(result.message)

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          consent: false
        })
        setTurnstileToken('')
        setTurnstileKey(prev => prev + 1) // Reset Turnstile widget
      } else {
        setSubmitStatus('error')
        setSubmitMessage(result.message || 'Terjadi kesalahan saat mengirim pesan')

        // Reset Turnstile on error
        setTurnstileToken('')
        setTurnstileKey(prev => prev + 1)

        // Refresh CSRF token on error (might be expired)
        if (result.message?.includes('CSRF') || result.message?.includes('token')) {
          refreshToken()
        }

        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch {
      setSubmitStatus('error')
      setSubmitMessage('Terjadi kesalahan jaringan. Silakan coba lagi.')

      // Reset Turnstile on network error
      setTurnstileToken('')
      setTurnstileKey(prev => prev + 1)

      // Refresh CSRF token on network error
      refreshToken()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('form_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <p className="text-green-800">{submitMessage}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">{submitMessage}</p>
              </div>
            )}

            {csrfError && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-yellow-800">{t('security.token_error')} {csrfError}</p>
                  <button
                    onClick={refreshToken}
                    className="text-yellow-600 hover:text-yellow-800 text-sm underline mt-1"
                  >
                    {t('security.refresh_token')}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name">{t('form.name')} {t('form.required')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder={t('form.name_placeholder')}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">{t('form.email')} {t('form.required')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                    placeholder={t('form.email_placeholder')}
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">{t('form.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={errors.phone ? 'border-red-500' : ''}
                    placeholder={t('form.phone_placeholder')}
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company">{t('form.company')}</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={errors.company ? 'border-red-500' : ''}
                    placeholder={t('form.company_placeholder')}
                  />
                  {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
                </div>
              </div>

              {/* Subject */}
              <div>
                <Label htmlFor="subject">{t('form.subject')} {t('form.required')}</Label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('form.subject_placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_FORM_CONFIG.subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">{t('form.message')} {t('form.required')}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={errors.message ? 'border-red-500' : ''}
                  placeholder={t('form.message_placeholder')}
                  rows={5}
                />
                {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => handleInputChange('consent', checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consent"
                    className="text-sm font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('form.consent')}{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      {t('form.privacy_policy')}
                    </a>{' '}
                    {t('form.consent_text')} {t('form.required')}
                  </Label>
                  {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}
                </div>
              </div>

              {/* Security Verification */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  {t('form.security_verification')} {t('form.required')}
                </Label>
                <TurnstileWidget
                  key={turnstileKey}
                  onVerify={handleTurnstileVerify}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  theme="light"
                  size="normal"
                  className="w-full"
                />
                {errors.turnstile && (
                  <p className="text-sm text-red-600">{errors.turnstile}</p>
                )}
                {errors.csrf && (
                  <p className="text-sm text-red-600">{errors.csrf}</p>
                )}
                <p className="text-xs text-gray-500">
                  {t('form.security_note')}
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken || !csrfToken || csrfLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('form.submitting')}
                    </>
                  ) : csrfLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('form.loading')}
                    </>
                  ) : (
                    t('form.submit')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
