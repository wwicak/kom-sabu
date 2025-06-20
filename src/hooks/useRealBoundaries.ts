import { useState, useEffect } from 'react'
import { IKecamatan } from '@/lib/models/kecamatan'
import { REAL_SABU_RAIJUA_BOUNDARIES } from '@/lib/data/real-sabu-raijua-boundaries'
import { fetchRealBoundaries, validateBoundaryData } from '@/lib/utils/boundary-fetcher'

interface UseRealBoundariesResult {
  enhancedKecamatanData: IKecamatan[]
  isLoading: boolean
  error: string | null
  boundarySource: 'local' | 'osm' | 'gadm' | 'fallback'
}

export function useRealBoundaries(originalKecamatanData: IKecamatan[]): UseRealBoundariesResult {
  const [enhancedData, setEnhancedData] = useState<IKecamatan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [boundarySource, setBoundarySource] = useState<'local' | 'osm' | 'gadm' | 'fallback'>('local')

  useEffect(() => {
    async function enhanceWithRealBoundaries() {
      setIsLoading(true)
      setError(null)

      try {
        // First, try to use our local real boundary data
        const enhanced = enhanceKecamatanWithLocalBoundaries(originalKecamatanData)
        
        if (enhanced.length > 0) {
          setEnhancedData(enhanced)
          setBoundarySource('local')
          setIsLoading(false)
          return
        }

        // If local data is insufficient, try fetching from external sources
        console.log('Fetching real boundaries from external sources...')
        const realBoundaries = await fetchRealBoundaries()
        
        if (validateBoundaryData(realBoundaries)) {
          const enhancedWithExternal = enhanceKecamatanWithExternalBoundaries(
            originalKecamatanData, 
            realBoundaries
          )
          
          setEnhancedData(enhancedWithExternal)
          setBoundarySource(realBoundaries.source || 'osm')
        } else {
          throw new Error('Invalid boundary data received')
        }

      } catch (err) {
        console.warn('Failed to fetch real boundaries, using fallback:', err)
        
        // Fallback to enhanced local boundaries
        const fallbackData = enhanceKecamatanWithLocalBoundaries(originalKecamatanData)
        setEnhancedData(fallbackData)
        setBoundarySource('fallback')
        setError('Using approximate boundaries. Real boundary data unavailable.')
      } finally {
        setIsLoading(false)
      }
    }

    if (originalKecamatanData.length > 0) {
      enhanceWithRealBoundaries()
    }
  }, [originalKecamatanData])

  return {
    enhancedKecamatanData: enhancedData,
    isLoading,
    error,
    boundarySource
  }
}

// Enhance kecamatan data with local real boundary data
function enhanceKecamatanWithLocalBoundaries(kecamatanData: IKecamatan[]): IKecamatan[] {
  return kecamatanData.map(kecamatan => {
    // Find matching boundary data by name or code
    const boundaryData = REAL_SABU_RAIJUA_BOUNDARIES.find(boundary =>
      boundary.name === kecamatan.name ||
      boundary.code === kecamatan.code ||
      boundary.nameEnglish === kecamatan.nameEnglish
    )

    if (boundaryData && boundaryData.geometry && boundaryData.centroid) {
      return {
        ...kecamatan,
        geometry: boundaryData.geometry,
        centroid: boundaryData.centroid,
        area: boundaryData.area || kecamatan.area
      }
    }

    return kecamatan
  })
}

// Enhance kecamatan data with external boundary data (OSM, GADM, etc.)
function enhanceKecamatanWithExternalBoundaries(
  kecamatanData: IKecamatan[], 
  externalBoundaries: any
): IKecamatan[] {
  return kecamatanData.map(kecamatan => {
    // Find matching boundary in external data
    const matchingFeature = externalBoundaries.features?.find((feature: any) => {
      const props = feature.properties
      return (
        props.name?.toLowerCase().includes(kecamatan.name.toLowerCase()) ||
        props.NAME_3?.toLowerCase().includes(kecamatan.name.toLowerCase()) ||
        props.admin_name?.toLowerCase().includes(kecamatan.name.toLowerCase())
      )
    })

    if (matchingFeature && matchingFeature.geometry) {
      // Calculate centroid from geometry
      const centroid = calculateCentroid(matchingFeature.geometry)
      
      return {
        ...kecamatan,
        geometry: matchingFeature.geometry,
        centroid: centroid || kecamatan.centroid
      }
    }

    return kecamatan
  })
}

// Calculate centroid of a polygon
function calculateCentroid(geometry: any): { type: 'Point'; coordinates: [number, number] } | null {
  if (!geometry || !geometry.coordinates) return null

  let coordinates: number[][]
  
  if (geometry.type === 'Polygon') {
    coordinates = geometry.coordinates[0] // Use outer ring
  } else if (geometry.type === 'MultiPolygon') {
    coordinates = geometry.coordinates[0][0] // Use first polygon's outer ring
  } else {
    return null
  }

  if (coordinates.length === 0) return null

  // Calculate centroid using average of coordinates
  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  )

  return {
    type: 'Point',
    coordinates: [sum[0] / coordinates.length, sum[1] / coordinates.length]
  }
}

// Hook for getting boundary data status
export function useBoundaryStatus() {
  const [status, setStatus] = useState({
    hasLocalBoundaries: false,
    canFetchExternal: false,
    lastUpdated: null as Date | null
  })

  useEffect(() => {
    setStatus({
      hasLocalBoundaries: REAL_SABU_RAIJUA_BOUNDARIES.length > 0,
      canFetchExternal: typeof window !== 'undefined' && navigator.onLine,
      lastUpdated: new Date()
    })
  }, [])

  return status
}

// Utility to validate if kecamatan has real boundaries
export function hasRealBoundary(kecamatan: IKecamatan): boolean {
  if (!kecamatan.geometry || !kecamatan.geometry.coordinates) return false
  
  // Check if it's not a simple rectangle (real boundaries have more complexity)
  if (kecamatan.geometry.type === 'Polygon') {
    const coords = kecamatan.geometry.coordinates[0]
    return coords.length > 5 // Real boundaries typically have more than 4 corners
  }
  
  return true
}

// Get boundary quality score (0-100)
export function getBoundaryQuality(kecamatan: IKecamatan): number {
  if (!hasRealBoundary(kecamatan)) return 0
  
  if (kecamatan.geometry.type === 'Polygon') {
    const coords = kecamatan.geometry.coordinates[0]
    
    // More points generally indicate higher quality
    const pointScore = Math.min(coords.length / 20, 1) * 40
    
    // Check for coordinate precision (more decimal places = higher quality)
    const precision = coords.reduce((acc, coord) => {
      const lonPrecision = (coord[0].toString().split('.')[1] || '').length
      const latPrecision = (coord[1].toString().split('.')[1] || '').length
      return acc + lonPrecision + latPrecision
    }, 0) / (coords.length * 2)
    
    const precisionScore = Math.min(precision / 6, 1) * 30
    
    // Check for realistic coordinate ranges for Sabu Raijua
    const inValidRange = coords.every(coord => 
      coord[0] >= 121.6 && coord[0] <= 121.95 && // Longitude range
      coord[1] >= -10.65 && coord[1] <= -10.40   // Latitude range
    )
    
    const rangeScore = inValidRange ? 30 : 0
    
    return Math.round(pointScore + precisionScore + rangeScore)
  }
  
  return 50 // Default score for other geometry types
}
