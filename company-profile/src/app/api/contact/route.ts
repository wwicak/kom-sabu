import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { sanitizeHtml, validateInput, generateSecureToken } from '@/lib/security'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting (already handled in middleware)
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Parse and validate request body
    const body = await request.json()
    
    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Additional security validations
    if (!validateInput.email(data.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!validateInput.name(data.name)) {
      return NextResponse.json(
        { success: false, message: 'Invalid name format' },
        { status: 400 }
      )
    }

    // Sanitize HTML content
    const sanitizedData = {
      ...data,
      name: sanitizeHtml(data.name),
      subject: sanitizeHtml(data.subject),
      message: sanitizeHtml(data.message),
      company: data.company ? sanitizeHtml(data.company) : undefined
    }

    // Generate a secure token for this submission
    const submissionToken = generateSecureToken()

    // Here you would typically:
    // 1. Save to database with proper SQL injection prevention
    // 2. Send email notification
    // 3. Log the submission for audit purposes

    console.log('Contact form submission:', {
      ...sanitizedData,
      submissionToken,
      ip,
      timestamp: new Date().toISOString()
    })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.',
      submissionToken
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
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
