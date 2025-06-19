import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { sanitizeHtml, validateInput, generateSecureToken } from '@/lib/security'
import { ContactForm, AuditLog } from '@/lib/models'
import { verifyTurnstileToken, checkRateLimit, recordFailedAttempt, clearFailedAttempts } from '@/components/security/TurnstileWidget'
import { withCSRF } from '@/lib/csrf'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
})

async function handlePOST(request: NextRequest) {
  try {
    // Get client information
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Parse and validate request body with size limit
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      return NextResponse.json(
        { success: false, message: 'Request payload too large' },
        { status: 413 }
      )
    }

    const body = await request.json()

    // Check rate limiting first
    if (!checkRateLimit(ip)) {
      recordFailedAttempt(ip)

      await AuditLog.create({
        action: 'CONTACT_FORM_RATE_LIMITED',
        resource: 'contact_form',
        details: { ip },
        ipAddress: ip,
        userAgent,
      })

      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify Turnstile token
    const { turnstileToken, ...formData } = body

    if (!turnstileToken) {
      recordFailedAttempt(ip)

      return NextResponse.json(
        { success: false, message: 'Security verification is required' },
        { status: 400 }
      )
    }

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken, ip)
    if (!isTurnstileValid) {
      recordFailedAttempt(ip)

      await AuditLog.create({
        action: 'CONTACT_FORM_TURNSTILE_FAILED',
        resource: 'contact_form',
        details: { ip },
        ipAddress: ip,
        userAgent,
      })

      return NextResponse.json(
        { success: false, message: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(formData)

    if (!validationResult.success) {
      // Log validation failure for security monitoring
      await AuditLog.create({
        action: 'CONTACT_FORM_VALIDATION_FAILED',
        resource: 'contact_form',
        details: {
          errors: validationResult.error.flatten().fieldErrors,
          submittedData: Object.keys(body)
        },
        ipAddress: ip,
        userAgent,
      })

      return NextResponse.json(
        {
          success: false,
          message: 'Data yang dikirim tidak valid',
          errors: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Additional security validations
    if (!validateInput.email(data.email)) {
      return NextResponse.json(
        { success: false, message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    if (!validateInput.name(data.name)) {
      return NextResponse.json(
        { success: false, message: 'Format nama tidak valid' },
        { status: 400 }
      )
    }

    // Check for duplicate submissions (same email within 5 minutes)
    const recentSubmission = await ContactForm.findOne({
      email: data.email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    })

    if (recentSubmission) {
      return NextResponse.json(
        {
          success: false,
          message: 'Anda baru saja mengirim pesan. Silakan tunggu 5 menit sebelum mengirim lagi.'
        },
        { status: 429 }
      )
    }

    // Sanitize HTML content to prevent XSS
    const sanitizedData = {
      ...data,
      name: sanitizeHtml(data.name),
      subject: sanitizeHtml(data.subject),
      message: sanitizeHtml(data.message),
      company: data.company ? sanitizeHtml(data.company) : undefined,
      email: data.email.toLowerCase().trim()
    }

    // Generate a secure token for this submission
    const submissionToken = generateSecureToken()

    // Save to MongoDB with transaction for data integrity
    const session = await mongoose.startSession()
    let savedContact: any

    try {
      await session.withTransaction(async () => {
        // Create contact form entry
        savedContact = await ContactForm.create([{
          ...sanitizedData,
          submissionToken,
          ipAddress: ip,
          userAgent,
          status: 'pending'
        }], { session })

        // Log the submission for audit
        await AuditLog.create([{
          action: 'CONTACT_FORM_SUBMITTED',
          resource: 'contact_form',
          resourceId: savedContact[0]._id.toString(),
          details: {
            email: sanitizedData.email,
            subject: sanitizedData.subject,
            hasPhone: !!sanitizedData.phone,
            hasCompany: !!sanitizedData.company
          },
          ipAddress: ip,
          userAgent,
        }], { session })
      })
    } finally {
      await session.endSession()
    }

    // Send email notification to admin (async, don't wait)
    setImmediate(async () => {
      try {
        await emailTransporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `[Sabu Raijua] Pesan Baru: ${sanitizedData.subject}`,
          html: `
            <h2>Pesan Baru dari Website</h2>
            <p><strong>Nama:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            ${sanitizedData.phone ? `<p><strong>Telepon:</strong> ${sanitizedData.phone}</p>` : ''}
            ${sanitizedData.company ? `<p><strong>Perusahaan:</strong> ${sanitizedData.company}</p>` : ''}
            <p><strong>Subjek:</strong> ${sanitizedData.subject}</p>
            <p><strong>Pesan:</strong></p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${sanitizedData.message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p><small>IP Address: ${ip}</small></p>
            <p><small>Token: ${submissionToken}</small></p>
            <p><small>Waktu: ${new Date().toLocaleString('id-ID')}</small></p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
        // Log email failure but don't fail the request
        await AuditLog.create({
          action: 'EMAIL_NOTIFICATION_FAILED',
          resource: 'contact_form',
          resourceId: savedContact[0]._id.toString(),
          details: { error: (emailError as Error).message },
          ipAddress: ip,
          userAgent,
        })
      }
    })

    // Clear failed attempts on successful submission
    clearFailedAttempts(ip)

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.',
      submissionToken
    })

  } catch (error) {
    console.error('Contact form error:', error)

    // Log the error for monitoring
    try {
      await AuditLog.create({
        action: 'CONTACT_FORM_ERROR',
        resource: 'contact_form',
        details: {
          error: (error as Error).message,
          stack: (error as Error).stack
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan server. Silakan coba lagi nanti.'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  )
}

// Export POST with CSRF protection
export const POST = withCSRF(handlePOST)
