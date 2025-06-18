'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

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

interface MapComponentProps {
  kecamatanData: KecamatanData[]
  selectedKecamatan?: string | null
  onKecamatanSelect?: (kecamatan: KecamatanData | null) => void
}



// Component to handle map events
function MapEventHandler({ onKecamatanSelect }: { onKecamatanSelect?: (kecamatan: KecamatanData | null) => void }) {
  const map = useMap()

  useEffect(() => {
    const handleMapClick = () => {
      onKecamatanSelect?.(null)
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [map, onKecamatanSelect])

  return null
}

export function MapComponent({ kecamatanData, selectedKecamatan, onKecamatanSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)

  // Sabu Raijua coordinates (approximate center)
  const center: [number, number] = [-10.5, 121.8]
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

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const kecamatan = feature.properties as KecamatanData

    layer.on({
      mouseover: (e) => {
        const layer = e.target
        layer.setStyle({
          weight: 3,
          color: '#ffffff',
          fillOpacity: 0.8
        })
      },
      mouseout: (e) => {
        const layer = e.target
        layer.setStyle({
          weight: 2,
          color: getKecamatanColor(kecamatan.name),
          fillOpacity: 0.6
        })
      },
      click: (e) => {
        e.originalEvent.stopPropagation()
        onKecamatanSelect?.(kecamatan)

        // Zoom to feature
        if (mapRef.current) {
          mapRef.current.fitBounds(layer.getBounds(), { padding: [20, 20] })
        }
      }
    })
  }

  const geoJsonStyle = (feature: any) => {
    const kecamatan = feature.properties as KecamatanData
    const isSelected = selectedKecamatan === kecamatan.slug

    return {
      fillColor: getKecamatanColor(kecamatan.name),
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#ffffff' : getKecamatanColor(kecamatan.name),
      fillOpacity: isSelected ? 0.8 : 0.6
    }
  }

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

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://openfreemap.org">OpenFreeMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON
          data={geoJsonData}
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />

        <MapEventHandler onKecamatanSelect={onKecamatanSelect} />
      </MapContainer>
    </div>
  )
}
