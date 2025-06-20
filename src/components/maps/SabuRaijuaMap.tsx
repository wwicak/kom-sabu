'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IKecamatan } from '@/lib/models/kecamatan'
import { SABU_RAIJUA_CENTER } from '@/lib/data/real-sabu-raijua-boundaries'


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

  // Use the kecamatan data directly (it already contains real GeoJSON from the API)
  console.log('SabuRaijuaMap received kecamatanData:', kecamatanData)
  const enhancedKecamatanData = kecamatanData
  const boundariesLoading = false
  const boundariesError = null
  const boundarySource = 'geojson_file'

  // Tile proxy URL to avoid CORS issues
  const TILE_PROXY_URL = '/api/tiles/{z}/{x}/{y}.png'

  // Use real Sabu Raijua center coordinates
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

    // Add tile layer using proxy to avoid CORS issues
    const tileLayer = L.tileLayer(TILE_PROXY_URL, {
      attribution: '© OpenFreeMap contributors',
      maxZoom: 19,
      tileSize: 256,
      errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y4ZmFmYyIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxMjgiIHk9IjEyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjQ3NDhiIj5NYXAgVGlsZTwvdGV4dD48L3N2Zz4='
    })

    // Handle tile loading errors with retry mechanism
    tileLayer.on('tileerror', (e) => {
      console.warn('Tile loading error:', e)
      // The proxy API will handle fallbacks automatically
    })

    // Handle tile loading success
    tileLayer.on('tileload', () => {
      console.log('Tiles loaded successfully via proxy')
    })

    // Handle tile loading start
    tileLayer.on('loading', () => {
      console.log('Starting to load tiles via proxy...')
    })

    tileLayer.addTo(map)

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
    if (!mapInstanceRef.current || !enhancedKecamatanData.length) {
      console.log('SabuRaijuaMap: Map or data not ready', {
        hasMap: !!mapInstanceRef.current,
        dataLength: enhancedKecamatanData.length
      })
      return
    }

    console.log('SabuRaijuaMap: Adding kecamatan layers', enhancedKecamatanData)

    // Clear existing layers
    Object.values(layersRef.current).forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer)
    })
    layersRef.current = {}

    // Add each kecamatan as a GeoJSON layer with real boundaries
    enhancedKecamatanData.forEach(kecamatan => {
      console.log(`SabuRaijuaMap: Processing kecamatan ${kecamatan.name}`)
      console.log('Geometry type:', kecamatan.geometry?.type)
      console.log('Geometry coordinates length:', kecamatan.geometry?.coordinates?.length)

      if (!kecamatan.geometry) {
        console.error(`No geometry found for kecamatan ${kecamatan.name}`)
        return
      }

      try {
        const geoJsonLayer = L.geoJSON(kecamatan.geometry, {
          style: () => getKecamatanStyle(kecamatan),
          onEachFeature: (_, layer) => {
            // Mouse events
            layer.on({
              mouseover: (e) => {
                const layer = e.target
                layer.setStyle(getKecamatanStyle(kecamatan, true))

                // Show tooltip with proper positioning
                const bounds = geoJsonLayer.getBounds()
                const center = bounds.getCenter()
                const point = mapInstanceRef.current!.latLngToContainerPoint(center)

                // Ensure tooltip stays within viewport
                const mapContainer = mapInstanceRef.current!.getContainer()
                const mapRect = mapContainer.getBoundingClientRect()
                const tooltipHeight = 400 // Approximate tooltip height
                const tooltipWidth = 380 // Approximate tooltip width

                let adjustedX = point.x
                let adjustedY = point.y

                // Keep tooltip within horizontal bounds
                if (point.x + tooltipWidth / 2 > mapRect.width) {
                  adjustedX = mapRect.width - tooltipWidth / 2 - 20
                } else if (point.x - tooltipWidth / 2 < 0) {
                  adjustedX = tooltipWidth / 2 + 20
                }

                // Keep tooltip within vertical bounds
                if (point.y - tooltipHeight < 0) {
                  adjustedY = tooltipHeight + 20 // Show below if too close to top
                }

                setTooltip({
                  kecamatan,
                  x: adjustedX,
                  y: adjustedY
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
      } catch (error) {
        console.error(`Error creating GeoJSON layer for ${kecamatan.name}:`, error)
        console.error('Geometry data:', kecamatan.geometry)
      }
    })

    // Fit map to show all kecamatan
    if (enhancedKecamatanData.length > 0) {
      const group = new L.FeatureGroup(Object.values(layersRef.current))
      mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  }, [enhancedKecamatanData, onKecamatanClick, onKecamatanHover])

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
      {(isLoading || boundariesLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {isLoading ? 'Memuat peta...' : 'Memuat batas wilayah...'}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Tooltip */}
      {tooltip && (
        <div
          className={`absolute z-[1000] bg-white rounded-lg shadow-xl border-2 border-blue-200 pointer-events-none transform -translate-x-1/2 ${tooltip.y > 400 ? '-translate-y-full' : 'translate-y-4'
            }`}
          style={{
            left: tooltip.x,
            top: tooltip.y > 400 ? tooltip.y - 10 : tooltip.y + 10,
            maxWidth: '380px',
            minWidth: '320px'
          }}
        >
          <div className="space-y-3 p-4">
            {/* Header with Flag */}
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {tooltip.kecamatan.name}
                  </h3>
                  {tooltip.kecamatan.nameEnglish && (
                    <p className="text-sm text-gray-600 italic">{tooltip.kecamatan.nameEnglish}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Kode</div>
                  <div className="font-mono text-sm font-medium">{tooltip.kecamatan.code}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Ibukota: <span className="font-medium">{tooltip.kecamatan.capital}</span>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-xs text-blue-600 font-medium">POPULASI</div>
                  <div className="text-lg font-bold text-blue-900">
                    {formatNumber(tooltip.kecamatan.demographics.totalPopulation)}
                  </div>
                  <div className="text-xs text-blue-700">
                    {Math.round(tooltip.kecamatan.demographics.populationDensity)} jiwa/km²
                  </div>
                </div>

                <div className="bg-green-50 p-2 rounded">
                  <div className="text-xs text-green-600 font-medium">LUAS WILAYAH</div>
                  <div className="text-lg font-bold text-green-900">
                    {tooltip.kecamatan.area ? tooltip.kecamatan.area.toFixed(1) : 'N/A'} km²
                  </div>
                  <div className="text-xs text-green-700">
                    {tooltip.kecamatan.villages?.length || 0} desa/kelurahan
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {tooltip.kecamatan.economy && (
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="text-xs text-orange-600 font-medium">EKONOMI</div>
                    <div className="text-sm font-bold text-orange-900">
                      Kemiskinan: {tooltip.kecamatan.economy.povertyRate ? tooltip.kecamatan.economy.povertyRate.toFixed(1) : 'N/A'}%
                    </div>
                    <div className="text-xs text-orange-700">
                      Pengangguran: {tooltip.kecamatan.economy.unemploymentRate ? tooltip.kecamatan.economy.unemploymentRate.toFixed(1) : 'N/A'}%
                    </div>
                  </div>
                )}

                {tooltip.kecamatan.infrastructure && (
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-xs text-purple-600 font-medium">INFRASTRUKTUR</div>
                    <div className="text-sm font-bold text-purple-900">
                      Listrik: {tooltip.kecamatan.infrastructure.utilities?.electricityAccess || 'N/A'}%
                    </div>
                    <div className="text-xs text-purple-700">
                      Air Bersih: {tooltip.kecamatan.infrastructure.utilities?.cleanWaterAccess || 'N/A'}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Economic Sectors */}
            {tooltip.kecamatan.economy && (
              <div className="border-t border-gray-200 pt-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Sektor Ekonomi Utama</h4>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Pertanian</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${tooltip.kecamatan.economy.economicSectors?.agriculture || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right">
                        {tooltip.kecamatan.economy.economicSectors?.agriculture || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Industri</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${tooltip.kecamatan.economy.economicSectors?.industry || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right">
                        {tooltip.kecamatan.economy.economicSectors?.industry || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Jasa</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${tooltip.kecamatan.economy.economicSectors?.services || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium w-8 text-right">
                        {tooltip.kecamatan.economy.economicSectors?.services || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Industries Tags */}
            {tooltip.kecamatan.economy && tooltip.kecamatan.economy.mainIndustries?.length > 0 && (
              <div className="border-t border-gray-200 pt-3">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Industri Utama</h4>
                <div className="flex flex-wrap gap-1">
                  {tooltip.kecamatan.economy.mainIndustries.slice(0, 4).map((industry, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agriculture & Natural Resources */}
            <div className="border-t border-gray-200 pt-3">
              <div className="grid grid-cols-2 gap-3">
                {tooltip.kecamatan.agriculture?.mainCrops?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">Komoditas Utama</h4>
                    <div className="text-xs text-gray-600">
                      {tooltip.kecamatan.agriculture.mainCrops?.slice(0, 3).map(crop => crop.name).join(', ') || 'N/A'}
                    </div>
                  </div>
                )}

                {tooltip.kecamatan.naturalResources?.minerals?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">Sumber Daya</h4>
                    <div className="text-xs text-gray-600">
                      {tooltip.kecamatan.naturalResources.minerals?.slice(0, 2).map(mineral => mineral.type).join(', ') || 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center border-t border-gray-200 pt-3">
              <div className="text-xs text-gray-500 mb-1">
                💡 Klik polygon untuk informasi lengkap
              </div>
              <div className="text-xs font-medium text-blue-600">
                Data terkini • {new Date().getFullYear()}
              </div>
            </div>
          </div>

          {/* Tooltip arrow */}
          {tooltip.y > 400 ? (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"></div>
            </div>
          ) : (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-200"></div>
            </div>
          )}
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

          {/* Boundary quality indicator */}
          {boundarySource && (
            <div className="border-t pt-2 mt-2">
              <div className="text-xs text-gray-500">
                Batas wilayah: {
                  boundarySource === 'geojson_file' ? '🗺️ Data GeoJSON Resmi' :
                    boundarySource === 'local' ? '🗺️ Data lokal' :
                      boundarySource === 'osm' ? '🌍 OpenStreetMap' :
                        boundarySource === 'gadm' ? '📊 GADM' :
                          '⚠️ Perkiraan'
                }
              </div>
              {boundariesError && (
                <div className="text-xs text-orange-600 mt-1">
                  ⚠️ {boundariesError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SabuRaijuaMap
