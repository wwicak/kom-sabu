/**
 * R2 Object Storage Test Utility
 * 
 * This utility helps test and validate the Cloudflare R2 configuration
 * and provides debugging information for storage operations.
 */

import { S3Client, ListBucketsCommand, HeadBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// Test R2 connection and configuration
export async function testR2Connection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    // Check environment variables
    const requiredEnvVars = [
      'CLOUDFLARE_R2_ACCOUNT_ID',
      'CLOUDFLARE_R2_ACCESS_KEY_ID', 
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      'CLOUDFLARE_R2_BUCKET_NAME',
      'CLOUDFLARE_R2_ENDPOINT'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      return {
        success: false,
        message: `Missing required environment variables: ${missingVars.join(', ')}`,
        details: {
          required: requiredEnvVars,
          missing: missingVars,
          present: requiredEnvVars.filter(varName => process.env[varName])
        }
      }
    }

    // Initialize R2 client
    const r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    })

    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!

    // Test 1: List buckets (to verify credentials)
    try {
      const listCommand = new ListBucketsCommand({})
      const listResponse = await r2Client.send(listCommand)
      
      const bucketExists = listResponse.Buckets?.some(bucket => bucket.Name === bucketName)
      
      if (!bucketExists) {
        return {
          success: false,
          message: `Bucket '${bucketName}' not found in account`,
          details: {
            availableBuckets: listResponse.Buckets?.map(b => b.Name) || [],
            requestedBucket: bucketName
          }
        }
      }
    } catch (listError) {
      return {
        success: false,
        message: 'Failed to list buckets - check credentials',
        details: {
          error: (listError as Error).message,
          endpoint: process.env.CLOUDFLARE_R2_ENDPOINT
        }
      }
    }

    // Test 2: Check bucket access
    try {
      const headCommand = new HeadBucketCommand({ Bucket: bucketName })
      await r2Client.send(headCommand)
    } catch (headError) {
      return {
        success: false,
        message: `Cannot access bucket '${bucketName}'`,
        details: {
          error: (headError as Error).message,
          bucket: bucketName
        }
      }
    }

    // Test 3: Test upload (small test file)
    try {
      const testKey = `test/connection-test-${Date.now()}.txt`
      const testContent = `R2 connection test - ${new Date().toISOString()}`
      
      const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: Buffer.from(testContent),
        ContentType: 'text/plain',
        Metadata: {
          testFile: 'true',
          createdAt: new Date().toISOString()
        }
      })

      await r2Client.send(putCommand)

      return {
        success: true,
        message: 'R2 connection successful - all tests passed',
        details: {
          bucket: bucketName,
          endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
          testFile: testKey,
          cdnUrl: process.env.CLOUDFLARE_CDN_URL
        }
      }
    } catch (uploadError) {
      return {
        success: false,
        message: 'R2 connection works but upload failed',
        details: {
          error: (uploadError as Error).message,
          bucket: bucketName
        }
      }
    }

  } catch (error) {
    return {
      success: false,
      message: 'R2 connection test failed',
      details: {
        error: (error as Error).message,
        stack: (error as Error).stack
      }
    }
  }
}

// Get R2 configuration summary
export function getR2ConfigSummary(): {
  configured: boolean
  config: Record<string, string | undefined>
  issues: string[]
} {
  const config = {
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '***configured***' : undefined,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '***configured***' : undefined,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    cdnUrl: process.env.CLOUDFLARE_CDN_URL
  }

  const issues: string[] = []
  
  if (!config.accountId) issues.push('Missing CLOUDFLARE_R2_ACCOUNT_ID')
  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) issues.push('Missing CLOUDFLARE_R2_ACCESS_KEY_ID')
  if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) issues.push('Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY')
  if (!config.bucketName) issues.push('Missing CLOUDFLARE_R2_BUCKET_NAME')
  if (!config.endpoint) issues.push('Missing CLOUDFLARE_R2_ENDPOINT')
  if (!config.cdnUrl) issues.push('Missing CLOUDFLARE_CDN_URL (optional but recommended)')

  // Validate endpoint format
  if (config.endpoint && !config.endpoint.includes('.r2.cloudflarestorage.com')) {
    issues.push('CLOUDFLARE_R2_ENDPOINT should be in format: https://[account-id].r2.cloudflarestorage.com')
  }

  return {
    configured: issues.length === 0 || (issues.length === 1 && issues[0].includes('CDN_URL')),
    config,
    issues
  }
}

// Generate proper R2 endpoint URL
export function generateR2Endpoint(accountId: string): string {
  return `https://${accountId}.r2.cloudflarestorage.com`
}

// Validate R2 configuration
export function validateR2Config(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []

  // Required fields
  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    errors.push('CLOUDFLARE_R2_ACCOUNT_ID is required')
    suggestions.push('Get your Account ID from Cloudflare Dashboard > R2 Object Storage')
  }

  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    errors.push('CLOUDFLARE_R2_ACCESS_KEY_ID is required')
    suggestions.push('Create R2 API tokens in Cloudflare Dashboard > R2 Object Storage > Manage R2 API tokens')
  }

  if (!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    errors.push('CLOUDFLARE_R2_SECRET_ACCESS_KEY is required')
  }

  if (!process.env.CLOUDFLARE_R2_BUCKET_NAME) {
    errors.push('CLOUDFLARE_R2_BUCKET_NAME is required')
    suggestions.push('Create a bucket in Cloudflare Dashboard > R2 Object Storage')
  }

  if (!process.env.CLOUDFLARE_R2_ENDPOINT) {
    errors.push('CLOUDFLARE_R2_ENDPOINT is required')
    if (process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
      suggestions.push(`Set CLOUDFLARE_R2_ENDPOINT to: ${generateR2Endpoint(process.env.CLOUDFLARE_R2_ACCOUNT_ID)}`)
    }
  }

  // Optional but recommended
  if (!process.env.CLOUDFLARE_CDN_URL) {
    warnings.push('CLOUDFLARE_CDN_URL not set - files will be served directly from R2')
    suggestions.push('Consider setting up a custom domain or using R2.dev subdomain for better performance')
  }

  // Validation checks
  if (process.env.CLOUDFLARE_R2_ENDPOINT && process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    const expectedEndpoint = generateR2Endpoint(process.env.CLOUDFLARE_R2_ACCOUNT_ID)
    if (process.env.CLOUDFLARE_R2_ENDPOINT !== expectedEndpoint) {
      warnings.push(`R2 endpoint might be incorrect. Expected: ${expectedEndpoint}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  }
}
