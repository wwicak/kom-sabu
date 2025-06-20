import { NextRequest, NextResponse } from 'next/server'
import { testR2Connection, getR2ConfigSummary, validateR2Config } from '@/lib/r2-test'
import { requirePermission } from '@/lib/auth-middleware'
import { Permission } from '@/lib/rbac'

export const GET = requirePermission(Permission.MANAGE_SETTINGS)(async function() {
  try {

    // Get configuration summary
    const configSummary = getR2ConfigSummary()
    
    // Validate configuration
    const validation = validateR2Config()
    
    let connectionTest = null
    
    // Only test connection if configuration is valid
    if (validation.isValid) {
      try {
        connectionTest = await testR2Connection()
      } catch (error) {
        connectionTest = {
          success: false,
          message: 'Connection test failed',
          details: { error: (error as Error).message }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        configuration: {
          ...configSummary,
          validation
        },
        connectionTest,
        recommendations: [
          'Ensure your R2 bucket exists and is accessible',
          'Verify API tokens have the correct permissions',
          'Consider setting up a custom domain for CDN_URL',
          'Test file uploads after configuration is complete'
        ]
      }
    })

  } catch (error) {
    console.error('R2 test error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test R2 configuration',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
})

// Test upload endpoint
export const POST = requirePermission(Permission.MANAGE_SETTINGS)(async function() {
  try {

    // Test connection first
    const connectionTest = await testR2Connection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'R2 connection failed',
        details: connectionTest
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'R2 test upload successful',
      data: connectionTest
    })

  } catch (error) {
    console.error('R2 test upload error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to test R2 upload',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
})
