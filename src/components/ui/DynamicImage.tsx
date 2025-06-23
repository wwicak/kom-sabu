'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { assetManager, type DefaultAssetKey } from '@/lib/asset-management'

interface DynamicImageProps {
  assetKey: DefaultAssetKey
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  fallback?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * DynamicImage component that loads images from the asset management system
 * with fallback to hardcoded defaults
 */
export function DynamicImage({
  assetKey,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  fallback,
  placeholder,
  blurDataURL
}: DynamicImageProps) {
  const [imageUrl, setImageUrl] = useState<string>(fallback || '/images/placeholder.jpg')
  const [, setLoading] = useState(true)
  const [, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadAsset = async () => {
      try {
        const url = await assetManager.getAssetUrl(assetKey, fallback)
        if (mounted) {
          setImageUrl(url)
          setError(false)
        }
      } catch (err) {
        console.error(`Failed to load asset ${assetKey}:`, err)
        if (mounted) {
          setError(true)
          // Keep the fallback URL
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAsset()

    return () => {
      mounted = false
    }
  }, [assetKey, fallback])

  const handleImageError = () => {
    setError(true)
    // Try to use the fallback or a placeholder
    const placeholderUrl = fallback || assetManager.getPlaceholderUrl(width || 400, height || 300, alt)
    setImageUrl(placeholderUrl)
  }

  const imageProps = {
    src: imageUrl,
    alt,
    className,
    priority,
    onError: handleImageError,
    placeholder,
    blurDataURL
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        alt={alt || 'Dynamic image'}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
      alt={alt || 'Dynamic image'}
    />
  )
}

/**
 * Hook for getting asset URLs programmatically
 */
export function useAsset(key: DefaultAssetKey, fallback?: string) {
  const [url, setUrl] = useState<string>(fallback || '/images/placeholder.jpg')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadAsset = async () => {
      try {
        const assetUrl = await assetManager.getAssetUrl(key, fallback)
        if (mounted) {
          setUrl(assetUrl)
          setError(null)
        }
      } catch (err) {
        console.error(`Failed to load asset ${key}:`, err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load asset')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadAsset()

    return () => {
      mounted = false
    }
  }, [key, fallback])

  return { url, loading, error }
}
