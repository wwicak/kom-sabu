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
  polygon: {
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

  // Sabu Raijua coordinates (approximate center)
  const center: [number, number] = [121.8, -10.5]
  const zoom = 10

  const getKecamatanColor = (kecamatanName: string) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#06B6D4', // cyan
    ]
    const index = kecamatanData.findIndex(k => k.name === kecamatanName)
    return colors[index % colors.length]
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: center,
      zoom: zoom,
      attributionControl: { compact: false }
    })

    // Convert kecamatan data to GeoJSON format
    const geoJsonData = {
      type: 'FeatureCollection' as const,
      features: kecamatanData.map(kecamatan => ({
        type: 'Feature' as const,
        properties: kecamatan,
        geometry: {
          type: kecamatan.polygon.type,
          coordinates: kecamatan.polygon.coordinates
        }
      }))
    }

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
            '#ffffff',
            [
              'case',
              ['==', ['get', 'name'], 'Sabu Barat'], '#3B82F6',
              ['==', ['get', 'name'], 'Sabu Tengah'], '#10B981',
              ['==', ['get', 'name'], 'Sabu Timur'], '#F59E0B',
              ['==', ['get', 'name'], 'Raijua'], '#EF4444',
              '#8B5CF6'
            ]
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'slug'], selectedKecamatan || ''],
            0.8,
            0.6
          ]
        }
      })

      // Add stroke layer
      map.current.addLayer({
        id: 'kecamatan-stroke',
        type: 'line',
        source: 'kecamatan',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'slug'], selectedKecamatan || ''],
            '#ffffff',
            [
              'case',
              ['==', ['get', 'name'], 'Sabu Barat'], '#3B82F6',
              ['==', ['get', 'name'], 'Sabu Tengah'], '#10B981',
              ['==', ['get', 'name'], 'Sabu Timur'], '#F59E0B',
              ['==', ['get', 'name'], 'Raijua'], '#EF4444',
              '#8B5CF6'
            ]
          ],
          'line-width': [
            'case',
            ['==', ['get', 'slug'], selectedKecamatan || ''],
            3,
            2
          ],
          'line-opacity': 1
        }
      })

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
