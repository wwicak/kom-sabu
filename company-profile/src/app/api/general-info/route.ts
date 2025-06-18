import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, validateFile } from '@/lib/storage'
import { GeneralInfo, AuditLog } from '@/lib/models'
import mongoose from 'mongoose'
import { sanitizeHtml } from '@/lib/security'

// Initialize MongoDB connection
if (!mongoose.connections[0].readyState) {
  mongoose.connect(process.env.MONGODB_URI!)
}

export async function GET(request: NextRequest) {
  try {
    // Get the current general information
    const generalInfo = await GeneralInfo.findOne().sort({ updatedAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: generalInfo
    })
    
  } catch (error) {
    console.error('General info fetch error:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch general information'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client information
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Parse form data
    const formData = await request.formData()
    
    // Extract form fields
    const address = formData.get('address') as string
    const longitude = formData.get('longitude') as string
    const latitude = formData.get('latitude') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const instagram = formData.get('instagram') as string
    const facebook = formData.get('facebook') as string
    const linkedin = formData.get('linkedin') as string
    const logoFile = formData.get('logo') as File | null

    // Validate required fields
    if (!address || !phone || !email) {
      return NextResponse.json(
        { success: false, message: 'Address, phone, and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate coordinates if provided
    if (longitude && (isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180)) {
      return NextResponse.json(
        { success: false, message: 'Invalid longitude value' },
        { status: 400 }
      )
    }

    if (latitude && (isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90)) {
      return NextResponse.json(
        { success: false, message: 'Invalid latitude value' },
        { status: 400 }
      )
    }

    // Sanitize input data
    const sanitizedData = {
      address: sanitizeHtml(address.trim()),
      longitude: longitude ? longitude.trim() : '',
      latitude: latitude ? latitude.trim() : '',
      phone: sanitizeHtml(phone.trim()),
      email: email.toLowerCase().trim(),
      instagram: instagram ? sanitizeHtml(instagram.trim()) : '',
      facebook: facebook ? sanitizeHtml(facebook.trim()) : '',
      linkedin: linkedin ? sanitizeHtml(linkedin.trim()) : ''
    }

    let logoUrl = ''

    // Handle logo upload if provided
    if (logoFile && logoFile.size > 0) {
      // Validate file
      const fileValidation = validateFile(logoFile)
      if (!fileValidation.isValid) {
        return NextResponse.json(
          { success: false, message: fileValidation.error },
          { status: 400 }
        )
      }

      // Check file size (300KB limit as shown in UI)
      if (logoFile.size > 300 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Logo file size must be less than 300KB' },
          { status: 400 }
        )
      }

      try {
        // Upload to Cloudflare R2
        const uploadResult = await uploadImage(logoFile, {
          optimize: true,
          createThumbnail: false,
          folder: 'logos'
        })
        
        logoUrl = uploadResult.original.url
      } catch (uploadError) {
        console.error('Logo upload error:', uploadError)
        return NextResponse.json(
          { success: false, message: 'Failed to upload logo' },
          { status: 500 }
        )
      }
    }

    // Save to MongoDB with transaction
    const session = await mongoose.startSession()
    let savedInfo

    try {
      await session.withTransaction(async () => {
        // Get current info to preserve logo if not updating
        const currentInfo = await GeneralInfo.findOne().sort({ updatedAt: -1 })
        
        const updateData = {
          ...sanitizedData,
          ...(logoUrl && { logo: logoUrl }),
          // Preserve existing logo if no new logo uploaded
          ...(currentInfo?.logo && !logoUrl && { logo: currentInfo.logo })
        }

        // Update or create general info
        savedInfo = await GeneralInfo.findOneAndUpdate(
          {},
          updateData,
          { 
            upsert: true, 
            new: true, 
            session,
            runValidators: true 
          }
        )

        // Log the update for audit
        await AuditLog.create([{
          action: 'GENERAL_INFO_UPDATED',
          resource: 'general_info',
          resourceId: savedInfo._id.toString(),
          details: {
            fieldsUpdated: Object.keys(sanitizedData),
            logoUpdated: !!logoUrl,
            hasCoordinates: !!(longitude && latitude)
          },
          ipAddress: ip,
          userAgent,
        }], { session })
      })
    } finally {
      await session.endSession()
    }

    return NextResponse.json({
      success: true,
      message: 'General information updated successfully',
      data: savedInfo
    })

  } catch (error) {
    console.error('General info update error:', error)
    
    // Log the error
    try {
      await AuditLog.create({
        action: 'GENERAL_INFO_UPDATE_ERROR',
        resource: 'general_info',
        details: { 
          error: error.message,
          stack: error.stack 
        },
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || '',
      })
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update general information'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
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
