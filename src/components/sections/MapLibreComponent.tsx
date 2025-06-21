'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { IKecamatan } from '@/lib/models/kecamatan'

interface MapLibreComponentProps {
  kecamatanData?: IKecamatan[]
  selectedKecamatan?: string | null
  onKecamatanSelect?: (kecamatan: IKecamatan | null) => void
  onKecamatanHover?: (kecamatan: IKecamatan | null) => void
  showHoverInfo?: boolean
}

export function MapLibreComponent({ kecamatanData, selectedKecamatan, onKecamatanSelect, onKecamatanHover }: MapLibreComponentProps) {
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
            'osm-tiles': {
              type: 'raster',
              tiles: [
                '/api/tiles/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
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
            // Check for geometry property
            const hasGeometry = kecamatan.geometry && kecamatan.geometry.coordinates && kecamatan.geometry.coordinates.length > 0
            return hasGeometry
          })
          .map((kecamatan: IKecamatan) => {
            const geometry = kecamatan.geometry
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
          data: geoJsonData as GeoJSON.FeatureCollection
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
              const coords = feature.geometry.coordinates as number[][][]
              coords[0].forEach((coord: number[]) => {
                bounds.extend([coord[0], coord[1]])
              })
            } else if (feature.geometry.type === 'MultiPolygon') {
              const coords = feature.geometry.coordinates as number[][][][]
              coords.forEach((polygon: number[][][]) => {
                polygon[0].forEach((coord: number[]) => {
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
            const kecamatan = e.features[0].properties as IKecamatan
            onKecamatanSelect?.(kecamatan)

            // Fit to bounds
            const coordinates = (e.features[0].geometry as GeoJSON.Polygon).coordinates[0] as number[][]
            const bounds = coordinates.reduce((bounds, coord) => {
              return bounds.extend(coord as [number, number])
            }, new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]))

            map.current?.fitBounds(bounds, { padding: 20 })
          }
        })

        // Add hover effects
        map.current.on('mouseenter', 'kecamatan-fill', (e) => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'pointer'
          }

          // Call hover callback if provided
          if (onKecamatanHover && e.features && e.features[0]) {
            const kecamatan = e.features[0].properties as IKecamatan
            onKecamatanHover(kecamatan)
          }
        })

        map.current.on('mouseleave', 'kecamatan-fill', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }

          // Clear hover callback if provided
          if (onKecamatanHover) {
            onKecamatanHover(null)
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
        // Could show user-friendly error message here
      })

      // Handle source errors
      map.current.on('sourcedata', (e) => {
        if (e.sourceId === 'osm-tiles' && e.isSourceLoaded === false) {
          console.warn('Tile source loading issues detected')
        }
      })

      // Handle tile loading errors
      map.current.on('sourcedataloading', (e) => {
        if (e.sourceId === 'osm-tiles') {
          console.log('Loading tiles from proxy...')
        }
      })

    } catch (error) {
      console.error('Failed to initialize map:', error)
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [kecamatanData, onKecamatanSelect, center, zoom, selectedKecamatan, onKecamatanHover])

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
