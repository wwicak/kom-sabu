'use client'

import React from 'react'
import { REAL_SABU_RAIJUA_BOUNDARIES, getSabuRaijuaBoundariesGeoJSON } from '@/lib/data/real-sabu-raijua-boundaries'

interface BoundaryVisualizationProps {
  className?: string
}

export const BoundaryVisualization: React.FC<BoundaryVisualizationProps> = ({ className = '' }) => {

  // Calculate SVG viewBox from all coordinates
  const allCoords = REAL_SABU_RAIJUA_BOUNDARIES.flatMap(boundary => {
    const coords = boundary.geometry?.coordinates?.[0]
    return Array.isArray(coords) ? coords as number[][] : []
  })

  const lons = allCoords.map((coord: number[]) => coord[0])
  const lats = allCoords.map((coord: number[]) => coord[1])

  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)

  // Add padding
  const padding = 0.02
  const viewBox = `${minLon - padding} ${minLat - padding} ${maxLon - minLon + 2 * padding} ${maxLat - minLat + 2 * padding}`

  // Colors for each kecamatan
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4'  // Cyan
  ]

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Visualisasi Batas Kecamatan Sabu Raijua
      </h3>

      <div className="space-y-4">
        {/* SVG Map */}
        <div className="bg-blue-50 rounded-lg p-4">
          <svg
            viewBox={viewBox}
            className="w-full h-64 border border-blue-200 rounded"
            style={{ transform: 'scaleY(-1)' }} // Flip Y axis for proper geographic display
          >
            {/* Background */}
            <rect
              x={minLon - padding}
              y={minLat - padding}
              width={maxLon - minLon + 2 * padding}
              height={maxLat - minLat + 2 * padding}
              fill="#E0F2FE"
            />

            {/* Kecamatan polygons */}
            {REAL_SABU_RAIJUA_BOUNDARIES.map((boundary, index) => {
              if (!boundary.geometry?.coordinates?.[0]) return null

              const coords = boundary.geometry.coordinates[0] as number[][]
              const pathData = coords.map((coord: number[], i: number) =>
                `${i === 0 ? 'M' : 'L'} ${coord[0]} ${coord[1]}`
              ).join(' ') + ' Z'

              return (
                <g key={boundary.code}>
                  {/* Polygon fill */}
                  <path
                    d={pathData}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.6}
                    stroke={colors[index % colors.length]}
                    strokeWidth={0.002}
                    strokeOpacity={0.8}
                  />

                  {/* Centroid point */}
                  {boundary.centroid?.coordinates && (
                    <circle
                      cx={boundary.centroid.coordinates[0]}
                      cy={boundary.centroid.coordinates[1]}
                      r={0.01}
                      fill="white"
                      stroke={colors[index % colors.length]}
                      strokeWidth={0.003}
                    />
                  )}

                  {/* Label */}
                  {boundary.centroid?.coordinates && (
                    <text
                      x={boundary.centroid.coordinates[0]}
                      y={boundary.centroid.coordinates[1] + 0.02}
                      textAnchor="middle"
                      fontSize="0.02"
                      fill="white"
                      fontWeight="bold"
                      style={{ transform: 'scaleY(-1)' }}
                    >
                      {boundary.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {REAL_SABU_RAIJUA_BOUNDARIES.map((boundary, index) => (
            <div key={boundary.code} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {boundary.name}
                </div>
                <div className="text-xs text-gray-600">
                  {boundary.area} km² • {boundary.capital}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Statistik Batas Wilayah</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Total Kecamatan</div>
              <div className="font-semibold">{REAL_SABU_RAIJUA_BOUNDARIES.length}</div>
            </div>
            <div>
              <div className="text-gray-600">Total Luas</div>
              <div className="font-semibold">
                {REAL_SABU_RAIJUA_BOUNDARIES.reduce((sum, b) => sum + (b.area || 0), 0).toFixed(1)} km²
              </div>
            </div>
            <div>
              <div className="text-gray-600">Koordinat Terjauh</div>
              <div className="font-semibold">
                {(maxLon - minLon).toFixed(3)}° × {(maxLat - minLat).toFixed(3)}°
              </div>
            </div>
            <div>
              <div className="text-gray-600">Presisi Rata-rata</div>
              <div className="font-semibold">4 desimal</div>
            </div>
          </div>
        </div>

        {/* Quality Indicators */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Kualitas Batas Wilayah</h4>
          <div className="space-y-2">
            {REAL_SABU_RAIJUA_BOUNDARIES.map((boundary) => {
              const coords = boundary.geometry?.coordinates?.[0] as number[][] | undefined
              const coordCount = coords?.length || 0
              const quality = coordCount > 10 ? 'Tinggi' : coordCount > 6 ? 'Sedang' : 'Rendah'
              const qualityColor = coordCount > 10 ? 'text-green-600' : coordCount > 6 ? 'text-yellow-600' : 'text-red-600'

              return (
                <div key={boundary.code} className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">{boundary.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{coordCount} titik</span>
                    <span className={`font-medium ${qualityColor}`}>{quality}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Technical Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>📍 Sistem Koordinat: WGS84 (EPSG:4326)</div>
          <div>🗺️ Format: GeoJSON Polygon</div>
          <div>📊 Sumber: Data lokal berdasarkan penelitian geografis</div>
          <div>⚡ Status: Siap digunakan untuk pemetaan web</div>
        </div>
      </div>
    </div>
  )
}

export default BoundaryVisualization
