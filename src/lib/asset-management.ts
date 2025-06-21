import { Asset } from '@/lib/models'
import mongoose from 'mongoose'
import React from 'react'

// Asset categories for organization
export const ASSET_CATEGORIES = {
  HERO: 'hero',
  LANDSCAPE: 'landscape', 
  CULTURE: 'culture',
  TOURISM: 'tourism',
  PROFILE: 'profile',
  LOGO: 'logo',
  ICON: 'icon',
  BACKGROUND: 'background',
  GALLERY: 'gallery',
  CONTENT: 'content'
} as const

export type AssetCategory = typeof ASSET_CATEGORIES[keyof typeof ASSET_CATEGORIES]

// Asset types for different use cases
export const ASSET_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio'
} as const

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES]

// Default assets mapping for fallbacks
export const DEFAULT_ASSETS = {
  'hero-background': '/images/sabu-raijua-mountain.jpg',
  'hero-main': '/images/sabu-raijua-hero.jpg',
  'about-landscape': '/images/sabu-raijua-landscape.jpg',
  'tourism-hero': '/images/tourism/sabu-raijua-tourism.jpg',
  'culture-hero': '/images/budaya-hero.jpg',
  'wisata-hero': '/images/wisata-hero.jpg',
  'og-image': '/images/og-image.jpg',
  'twitter-image': '/images/twitter-image.jpg',
  'logo-main': '/images/logo-sabu-raijua.png',
  'tenun-hawu': '/images/culture/tenun-hawu.jpg',
  'ledo-hawu': '/images/culture/ledo-hawu.jpg'
} as const

export type DefaultAssetKey = keyof typeof DEFAULT_ASSETS

// Asset management service
export class AssetManager {
  private static instance: AssetManager
  private cache: Map<string, string> = new Map()

  private constructor() {}

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  /**
   * Get asset URL by key with fallback to default
   */
  async getAssetUrl(key: DefaultAssetKey, fallback?: string): Promise<string> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }

    try {
      // Initialize MongoDB connection if needed
      if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGODB_URI!)
      }

      // Find asset in database
      const asset = await Asset.findOne({ 
        key,
        status: 'active',
        type: 'image'
      }).sort({ createdAt: -1 })

      if (asset && asset.url) {
        // Cache the result
        this.cache.set(key, asset.url)
        return asset.url
      }

      // Fallback to default or provided fallback
      const defaultUrl = fallback || DEFAULT_ASSETS[key] || '/images/placeholder.jpg'
      this.cache.set(key, defaultUrl)
      return defaultUrl

    } catch (error) {
      console.error(`Error fetching asset ${key}:`, error)
      
      // Return fallback on error
      const defaultUrl = fallback || DEFAULT_ASSETS[key] || '/images/placeholder.jpg'
      this.cache.set(key, defaultUrl)
      return defaultUrl
    }
  }

  /**
   * Update asset in database and cache
   */
  async updateAsset(
    key: DefaultAssetKey,
    url: string,
    metadata: {
      title?: string
      description?: string
      category?: AssetCategory
      alt?: string
    } = {}
  ): Promise<void> {
    try {
      // Initialize MongoDB connection if needed
      if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGODB_URI!)
      }

      // Upsert asset
      await Asset.findOneAndUpdate(
        { key },
        {
          key,
          url,
          type: 'image',
          status: 'active',
          title: metadata.title || key,
          description: metadata.description || `Asset for ${key}`,
          category: metadata.category || 'content',
          alt: metadata.alt || metadata.title || key,
          updatedAt: new Date()
        },
        { 
          upsert: true,
          new: true
        }
      )

      // Update cache
      this.cache.set(key, url)

    } catch (error) {
      console.error(`Error updating asset ${key}:`, error)
      throw error
    }
  }

  /**
   * Clear cache for specific key or all
   */
  clearCache(key?: DefaultAssetKey): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  /**
   * Get all assets by category
   */
  async getAssetsByCategory(category: AssetCategory): Promise<Array<{
    key: string
    url: string
    title: string
    description?: string
    alt?: string
  }>> {
    try {
      // Initialize MongoDB connection if needed
      if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGODB_URI!)
      }

      const assets = await Asset.find({
        category,
        status: 'active',
        type: 'image'
      }).sort({ order: 1, createdAt: -1 })

      return assets.map(asset => ({
        key: asset.key,
        url: asset.url,
        title: asset.title,
        description: asset.description,
        alt: asset.alt
      }))

    } catch (error) {
      console.error(`Error fetching assets for category ${category}:`, error)
      return []
    }
  }

  /**
   * Create placeholder image URL
   */
  getPlaceholderUrl(width: number = 400, height: number = 300, text?: string): string {
    const placeholderText = text || 'Placeholder'
    return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=${encodeURIComponent(placeholderText)}`
  }
}

// Export singleton instance
export const assetManager = AssetManager.getInstance()

// Helper hook for React components
export function useAsset(key: DefaultAssetKey, fallback?: string) {
  const [url, setUrl] = React.useState<string>(fallback || DEFAULT_ASSETS[key] || '/images/placeholder.jpg')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    assetManager.getAssetUrl(key, fallback)
      .then(setUrl)
      .finally(() => setLoading(false))
  }, [key, fallback])

  return { url, loading }
}
