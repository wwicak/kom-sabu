'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ImageData {
  url: string
  caption?: string
  alt?: string
  order: number
}

interface ImageUploadProps {
  images: ImageData[]
  onImagesChange: (images: ImageData[]) => void
  maxImages?: number
  folder?: string
  className?: string
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const uploadImage = useCallback(async (file: File): Promise<ImageData> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', file.name)
    formData.append('description', `Uploaded image: ${file.name}`)
    formData.append('category', 'Budaya') // Default category

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload image')
    }

    const result = await response.json()

    return {
      url: result.data.imageUrl,
      caption: '',
      alt: file.name,
      order: images.length
    }
  }, [images.length])

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many images',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive'
      })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file))
      const uploadedImages = await Promise.all(uploadPromises)

      onImagesChange([...images, ...uploadedImages])

      toast({
        title: 'Success',
        description: `${uploadedImages.length} image(s) uploaded successfully`
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onImagesChange, toast, uploadImage])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }, [handleFileSelect])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const updateImageData = (index: number, field: 'caption' | 'alt', value: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)

    // Update order
    newImages.forEach((img, index) => {
      img.order = index
    })

    onImagesChange(newImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
              ${uploading ? 'pointer-events-none opacity-50' : 'hover:border-blue-400 hover:bg-blue-50'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <div className="space-y-4">
              {uploading ? (
                <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
              ) : (
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              )}

              <div>
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading images...' : 'Upload images'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Maximum {maxImages} images • PNG, JPG, WEBP up to 10MB each
                </p>
              </div>

              {!uploading && (
                <Button type="button" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Uploaded Images ({images.length})</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Image Preview */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.url}
                        alt={image.alt || `Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {/* Order Badge */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Image Metadata */}
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor={`caption-${index}`} className="text-sm">Caption</Label>
                        <Input
                          id={`caption-${index}`}
                          value={image.caption || ''}
                          onChange={(e) => updateImageData(index, 'caption', e.target.value)}
                          placeholder="Enter image caption"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`alt-${index}`} className="text-sm">Alt Text</Label>
                        <Input
                          id={`alt-${index}`}
                          value={image.alt || ''}
                          onChange={(e) => updateImageData(index, 'alt', e.target.value)}
                          placeholder="Enter alt text for accessibility"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Move Buttons */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveImage(index, Math.min(images.length - 1, index + 1))}
                        disabled={index === images.length - 1}
                      >
                        Move Down
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
