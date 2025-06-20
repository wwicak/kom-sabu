'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IKecamatan } from '@/lib/models/kecamatan'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface SabuRaijuaMapProps {
  kecamatanData: IKecamatan[]
  onKecamatanClick?: (kecamatan: IKecamatan) => void
  onKecamatanHover?: (kecamatan: IKecamatan | null) => void
  selectedKecamatan?: string | null
  className?: string
  height?: string
}

interface TooltipData {
  kecamatan: IKecamatan
  x: number
  y: number
}

const SabuRaijuaMap: React.FC<SabuRaijuaMapProps> = ({
  kecamatanData,
  onKecamatanClick,
  onKecamatanHover,
  selectedKecamatan,
  className = '',
  height = '600px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layersRef = useRef<{ [key: string]: L.GeoJSON }>({})
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // OpenFreeMap tile layer URL
  const OPENFREE_MAP_URL = 'https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png'

  // Sabu Raijua coordinates (approximate center)
  const SABU_RAIJUA_CENTER: [number, number] = [-10.5629, 121.7889]
  const DEFAULT_ZOOM = 11

  // Color scheme for different kecamatan
  const getKecamatanColor = (kecamatanCode: string, isSelected: boolean = false): string => {
    if (isSelected) return '#ef4444' // red-500 for selected

    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // emerald-500
      '#f59e0b', // amber-500
      '#8b5cf6', // violet-500
      '#06b6d4', // cyan-500
      '#84cc16', // lime-500
    ]

    // Use hash of kecamatan code to consistently assign colors
    let hash = 0
    for (let i = 0; i < kecamatanCode.length; i++) {
      hash = ((hash << 5) - hash + kecamatanCode.charCodeAt(i)) & 0xffffffff
    }
    return colors[Math.abs(hash) % colors.length]
  }

  // Style function for kecamatan polygons
  const getKecamatanStyle = (kecamatan: IKecamatan, isHovered: boolean = false) => {
    const isSelected = selectedKecamatan === kecamatan.code
    const baseColor = getKecamatanColor(kecamatan.code, isSelected)

    return {
      fillColor: baseColor,
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#dc2626' : isHovered ? '#374151' : '#6b7280',
      dashArray: '',
      fillOpacity: isSelected ? 0.8 : isHovered ? 0.7 : 0.6
    }
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Create map instance
    const map = L.map(mapRef.current, {
      center: SABU_RAIJUA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
    })

    // Add OpenFreeMap tile layer
    L.tileLayer(OPENFREE_MAP_URL, {
      attribution: '© OpenFreeMap © OpenMapTiles © OpenStreetMap contributors',
      maxZoom: 19,
      tileSize: 256,
    }).addTo(map)

    mapInstanceRef.current = map
    setIsLoading(false)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Add kecamatan layers
  useEffect(() => {
    if (!mapInstanceRef.current || !kecamatanData.length) return

    // Clear existing layers
    Object.values(layersRef.current).forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer)
    })
    layersRef.current = {}

    // Add each kecamatan as a GeoJSON layer
    kecamatanData.forEach(kecamatan => {
      const geoJsonLayer = L.geoJSON(kecamatan.geometry, {
        style: () => getKecamatanStyle(kecamatan),
        onEachFeature: (_, layer) => {
          // Mouse events
          layer.on({
            mouseover: (e) => {
              const layer = e.target
              layer.setStyle(getKecamatanStyle(kecamatan, true))

              // Show tooltip
              const bounds = geoJsonLayer.getBounds()
              const center = bounds.getCenter()
              const point = mapInstanceRef.current!.latLngToContainerPoint(center)

              setTooltip({
                kecamatan,
                x: point.x,
                y: point.y
              })

              onKecamatanHover?.(kecamatan)
            },
            mouseout: (e) => {
              const layer = e.target
              layer.setStyle(getKecamatanStyle(kecamatan))
              setTooltip(null)
              onKecamatanHover?.(null)
            },
            click: () => {
              onKecamatanClick?.(kecamatan)

              // Zoom to kecamatan bounds
              const bounds = geoJsonLayer.getBounds()
              mapInstanceRef.current?.fitBounds(bounds, { padding: [20, 20] })
            }
          })
        }
      })

      geoJsonLayer.addTo(mapInstanceRef.current!)
      layersRef.current[kecamatan.code] = geoJsonLayer
    })

    // Fit map to show all kecamatan
    if (kecamatanData.length > 0) {
      const group = new L.FeatureGroup(Object.values(layersRef.current))
      mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  }, [kecamatanData, onKecamatanClick, onKecamatanHover])

  // Update selected kecamatan styling
  useEffect(() => {
    Object.entries(layersRef.current).forEach(([code, layer]) => {
      const kecamatan = kecamatanData.find(k => k.code === code)
      if (kecamatan) {
        layer.setStyle(getKecamatanStyle(kecamatan))
      }
    })
  }, [selectedKecamatan, kecamatanData])

  // Format number with Indonesian locale
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat peta...</p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-[1000] bg-white rounded-lg shadow-lg border p-4 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            maxWidth: '300px',
            minWidth: '250px'
          }}
        >
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900">
              Kecamatan {tooltip.kecamatan.name}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Populasi:</span>
                <div className="font-semibold">
                  {formatNumber(tooltip.kecamatan.demographics.totalPopulation)} jiwa
                </div>
              </div>

              <div>
                <span className="text-gray-600">Luas:</span>
                <div className="font-semibold">
                  {tooltip.kecamatan.area.toFixed(2)} km²
                </div>
              </div>

              <div>
                <span className="text-gray-600">Kepadatan:</span>
                <div className="font-semibold">
                  {Math.round(tooltip.kecamatan.demographics.populationDensity)} jiwa/km²
                </div>
              </div>

              <div>
                <span className="text-gray-600">Desa/Kelurahan:</span>
                <div className="font-semibold">
                  {tooltip.kecamatan.villages.length}
                </div>
              </div>
            </div>

            {tooltip.kecamatan.agriculture.mainCrops.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Komoditas Utama:</span>
                <div className="text-sm font-medium">
                  {tooltip.kecamatan.agriculture.mainCrops.slice(0, 3).map(crop => crop.name).join(', ')}
                </div>
              </div>
            )}

            {tooltip.kecamatan.naturalResources.minerals.length > 0 && (
              <div>
                <span className="text-gray-600 text-sm">Sumber Daya:</span>
                <div className="text-sm font-medium">
                  {tooltip.kecamatan.naturalResources.minerals.slice(0, 2).map(mineral => mineral.type).join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Peta Interaktif Kecamatan</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded opacity-60"></div>
            <span>Kecamatan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded opacity-80"></div>
            <span>Terpilih</span>
          </div>
          <p className="text-gray-600 mt-2">Klik untuk detail informasi</p>
        </div>
      </div>
    </div>
  )
}

export default SabuRaijuaMap
