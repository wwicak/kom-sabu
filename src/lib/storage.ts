import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'
import crypto from 'crypto'

// Initialize Cloudflare R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!
const CDN_URL = process.env.CLOUDFLARE_CDN_URL!

// Allowed file types and their MIME types
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
}

const ALLOWED_DOCUMENT_TYPES = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
}

const ALL_ALLOWED_TYPES = { ...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES }

// File validation
export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!ALL_ALLOWED_TYPES[file.type as keyof typeof ALL_ALLOWED_TYPES]) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${Object.keys(ALL_ALLOWED_TYPES).join(', ')}`
    }
  }

  // Check file size (10MB limit)
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    }
  }

  return { isValid: true }
}

// Generate secure filename
export function generateSecureFilename(originalName: string, mimeType: string): string {
  const extension = ALL_ALLOWED_TYPES[mimeType as keyof typeof ALL_ALLOWED_TYPES]
  const timestamp = Date.now()
  const randomString = crypto.randomBytes(16).toString('hex')
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50)
  
  return `${timestamp}_${randomString}_${sanitizedName}.${extension}`
}

// Image optimization
export async function optimizeImage(buffer: Buffer, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
} = {}): Promise<Buffer> {
  const {
    width = 1920,
    height = 1080,
    quality = 85,
    format = 'webp'
  } = options

  return await sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, { quality })
    .toBuffer()
}

// Create thumbnail
export async function createThumbnail(buffer: Buffer, size: number = 300): Promise<Buffer> {
  return await sharp(buffer)
    .resize(size, size, {
      fit: 'cover',
      position: 'center'
    })
    .toFormat('webp', { quality: 80 })
    .toBuffer()
}

// Upload file to R2
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  metadata: Record<string, string> = {}
): Promise<{ url: string; key: string }> {
  try {
    const key = `uploads/${filename}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
      },
      // Set cache control for CDN
      CacheControl: 'public, max-age=31536000', // 1 year
    })

    await r2Client.send(command)

    const url = `${CDN_URL}/${key}`
    
    return { url, key }
  } catch (error) {
    console.error('Error uploading to R2:', error)
    throw new Error('Failed to upload file to storage')
  }
}

// Upload image with optimization
export async function uploadImage(
  file: File,
  options: {
    optimize?: boolean
    createThumbnail?: boolean
    folder?: string
  } = {}
): Promise<{
  original: { url: string; key: string }
  thumbnail?: { url: string; key: string }
  metadata: {
    originalSize: number
    optimizedSize?: number
    dimensions?: { width: number; height: number }
  }
}> {
  const { optimize = true, createThumbnail: shouldCreateThumbnail = true, folder = 'images' } = options

  // Validate file
  const validation = validateFile(file)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const originalSize = buffer.length

  let processedBuffer = buffer
  let optimizedSize = originalSize
  let dimensions: { width: number; height: number } | undefined

  // Optimize image if it's an image file and optimization is enabled
  if (ALLOWED_IMAGE_TYPES[file.type as keyof typeof ALLOWED_IMAGE_TYPES] && optimize) {
    const optimizedBuffer = await optimizeImage(buffer)
    processedBuffer = Buffer.from(optimizedBuffer)
    optimizedSize = processedBuffer.length

    // Get dimensions
    const metadata = await sharp(processedBuffer).metadata()
    dimensions = {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  }

  // Generate filename
  const filename = generateSecureFilename(file.name, file.type)
  const key = `${folder}/${filename}`

  // Upload original/optimized image
  const original = await uploadToR2(
    processedBuffer,
    key,
    file.type,
    {
      originalName: file.name,
      originalSize: originalSize.toString(),
      optimizedSize: optimizedSize.toString(),
    }
  )

  let thumbnail: { url: string; key: string } | undefined

  // Create and upload thumbnail if requested and it's an image
  if (shouldCreateThumbnail && ALLOWED_IMAGE_TYPES[file.type as keyof typeof ALLOWED_IMAGE_TYPES]) {
    const thumbnailBuffer = await createThumbnail(buffer)
    const thumbnailFilename = `thumb_${filename}`
    const thumbnailKey = `${folder}/thumbnails/${thumbnailFilename}`

    thumbnail = await uploadToR2(
      thumbnailBuffer,
      thumbnailKey,
      'image/webp',
      {
        originalName: file.name,
        type: 'thumbnail',
      }
    )
  }

  return {
    original,
    thumbnail,
    metadata: {
      originalSize,
      optimizedSize: optimize ? optimizedSize : undefined,
      dimensions,
    }
  }
}

// Delete file from R2
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error('Error deleting from R2:', error)
    throw new Error('Failed to delete file from storage')
  }
}

// Generate presigned URL for secure uploads
export async function generatePresignedUploadUrl(
  key: string,
  mimeType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: mimeType,
    })

    return await getSignedUrl(r2Client, command, { expiresIn })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    throw new Error('Failed to generate upload URL')
  }
}

// Get file metadata
export async function getFileMetadata(key: string): Promise<any> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await r2Client.send(command)
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    }
  } catch (error) {
    console.error('Error getting file metadata:', error)
    throw new Error('Failed to get file metadata')
  }
}

// Batch delete files
export async function batchDeleteFromR2(keys: string[]): Promise<void> {
  try {
    const deletePromises = keys.map(key => deleteFromR2(key))
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error in batch delete:', error)
    throw new Error('Failed to delete files from storage')
  }
}
