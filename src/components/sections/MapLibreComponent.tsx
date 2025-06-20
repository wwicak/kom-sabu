'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface KecamatanData {
  _id: string
  name: string
  slug: string
  description?: string
  area: number
  population: number
  villages: number
  coordinates: {
    center: { lat: number; lng: number }
    bounds?: {
      north: number
      south: number
      east: number
      west: number
    }
  }
  polygon?: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][]
  }
  geometry?: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][]
  }
  potency: any
  demographics: any
  images?: Array<{
    url: string
    caption: string
    category: string
  }>
  headOffice?: {
    address: string
    phone: string
    email: string
    head: string
  }
}

interface MapLibreComponentProps {
  kecamatanData: KecamatanData[]
  selectedKecamatan?: string | null
  onKecamatanSelect?: (kecamatan: KecamatanData | null) => void
}

export function MapLibreComponent({ kecamatanData, selectedKecamatan, onKecamatanSelect }: MapLibreComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  // Sabu Raijua coordinates (more accurate center)
  const center: [number, number] = [121.8267, -10.4833] // Seba, the capital
  const zoom = 11

  useEffect(() => {
    if (!mapContainer.current || !kecamatanData || kecamatanData.length === 0) return

    // Initialize map with error handling
    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'openfreemap': {
              type: 'raster',
              tiles: [
                'https://tiles.openfreemap.org/osm/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenFreeMap contributors'
            }
          },
          layers: [
            {
              id: 'openfreemap',
              type: 'raster',
              source: 'openfreemap',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: center,
        zoom: zoom,
        attributionControl: { compact: false }
      })

      // Convert kecamatan data to GeoJSON format
      const geoJsonData = {
        type: 'FeatureCollection' as const,
        features: kecamatanData
          .filter(kecamatan => {
            // Check for both polygon and geometry properties
            const hasPolygon = kecamatan.polygon && kecamatan.polygon.coordinates && kecamatan.polygon.coordinates.length > 0
            const hasGeometry = kecamatan.geometry && kecamatan.geometry.coordinates && kecamatan.geometry.coordinates.length > 0
            return hasPolygon || hasGeometry
          })
          .map((kecamatan: KecamatanData) => {
            // Use geometry if available, otherwise fall back to polygon
            const geometry = kecamatan.geometry || kecamatan.polygon
            if (!geometry) {
              console.error(`No geometry data found for kecamatan: ${kecamatan.name}`)
              throw new Error(`No geometry data found for kecamatan: ${kecamatan.name}`)
            }
            return {
              type: 'Feature' as const,
              properties: kecamatan,
              geometry: {
                type: geometry.type,
                coordinates: geometry.coordinates
              }
            }
          })
      }

      console.log('MapLibre: Loading', geoJsonData.features.length, 'kecamatan polygons')

      map.current.on('load', () => {
        if (!map.current) return

        // Add kecamatan polygons source
        map.current.addSource('kecamatan', {
          type: 'geojson',
          data: geoJsonData as any
        })

        // Add fill layer
        map.current.addLayer({
          id: 'kecamatan-fill',
          type: 'fill',
          source: 'kecamatan',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'slug'], selectedKecamatan || ''],
              '#ff0000', // Red for selected
              [
                'case',
                ['==', ['get', 'name'], 'Sabu Barat'], '#3B82F6',
                ['==', ['get', 'name'], 'Sabu Tengah'], '#10B981',
                ['==', ['get', 'name'], 'Sabu Timur'], '#F59E0B',
                ['==', ['get', 'name'], 'Raijua'], '#EF4444',
                '#8B5CF6'
              ]
            ],
            'fill-opacity': 0.7 // Make it more visible
          }
        })

        // Add stroke layer
        map.current.addLayer({
          id: 'kecamatan-stroke',
          type: 'line',
          source: 'kecamatan',
          paint: {
            'line-color': '#000000', // Black border for visibility
            'line-width': 2,
            'line-opacity': 1
          }
        })

        // Fit map to show all polygons
        if (geoJsonData.features.length > 0) {
          const bounds = new maplibregl.LngLatBounds()
          geoJsonData.features.forEach(feature => {
            if (feature.geometry.type === 'Polygon') {
              feature.geometry.coordinates[0].forEach((coord: any) => {
                bounds.extend([coord[0], coord[1]])
              })
            } else if (feature.geometry.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((polygon: any) => {
                polygon[0].forEach((coord: any) => {
                  bounds.extend([coord[0], coord[1]])
                })
              })
            }
          })
          map.current.fitBounds(bounds, { padding: 50 })
        }

        // Add click event
        map.current.on('click', 'kecamatan-fill', (e) => {
          if (e.features && e.features[0]) {
            const kecamatan = e.features[0].properties as KecamatanData
            onKecamatanSelect?.(kecamatan)

            // Fit to bounds
            const coordinates = (e.features[0].geometry as any).coordinates[0] as number[][]
            const bounds = coordinates.reduce((bounds, coord) => {
              return bounds.extend(coord as [number, number])
            }, new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]))

            map.current?.fitBounds(bounds, { padding: 20 })
          }
        })

        // Add hover effects
        map.current.on('mouseenter', 'kecamatan-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
          }
        })

        map.current.on('mouseleave', 'kecamatan-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }
        })

        // Click on map background to deselect
        map.current.on('click', (e) => {
          if (!e.defaultPrevented) {
            onKecamatanSelect?.(null)
          }
        })
      })

      // Handle map errors
      map.current.on('error', (e) => {
        console.warn('Map error:', e)
      })

    } catch (error) {
      console.error('Failed to initialize map:', error)
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [kecamatanData, onKecamatanSelect])

  // Update selected kecamatan styling
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    // Update the paint properties based on selection
    map.current.setPaintProperty('kecamatan-fill', 'fill-opacity', [
      'case',
      ['==', ['get', 'slug'], selectedKecamatan || ''],
      0.8,
      0.6
    ])

    map.current.setPaintProperty('kecamatan-stroke', 'line-width', [
      'case',
      ['==', ['get', 'slug'], selectedKecamatan || ''],
      3,
      2
    ])
  }, [selectedKecamatan])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
