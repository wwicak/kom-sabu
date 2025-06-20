'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Building2, Wheat, Camera } from 'lucide-react'
import { IKecamatan } from '@/lib/models/kecamatan'

// Dynamically import the MapLibre component to avoid SSR issues
const MapLibreComponent = dynamic(() => import('./MapLibreComponent').then(mod => ({ default: mod.MapLibreComponent })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

interface InteractiveMapProps {
  kecamatanData: IKecamatan[]
  selectedKecamatan?: string | null
  onKecamatanSelect?: (kecamatan: IKecamatan | null) => void
  onKecamatanHover?: (kecamatan: IKecamatan | null) => void
  showHoverInfo?: boolean
}

export function InteractiveMap({ kecamatanData, selectedKecamatan, onKecamatanSelect, onKecamatanHover, showHoverInfo }: InteractiveMapProps) {
  return (
    <MapLibreComponent
      kecamatanData={kecamatanData}
      selectedKecamatan={selectedKecamatan}
      onKecamatanSelect={onKecamatanSelect}
      onKecamatanHover={onKecamatanHover}
      showHoverInfo={showHoverInfo}
    />
  )
}

// Kecamatan detail card component
export function KecamatanDetailCard({ kecamatan, onClose }: { kecamatan: IKecamatan; onClose: () => void }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-blue-900">
            Kecamatan {kecamatan.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Ibukota: {kecamatan.capital} • Kode: {kecamatan.code}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium">{kecamatan.demographics.totalPopulation.toLocaleString()}</div>
              <div className="text-gray-500">Penduduk</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium">{kecamatan.villages.length}</div>
              <div className="text-gray-500">Desa</div>
            </div>
          </div>
        </div>

        {/* Agriculture & Tourism */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Potensi Unggulan</h4>
          <div className="flex flex-wrap gap-1">
            {kecamatan.agriculture.mainCrops?.slice(0, 3).map((crop, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Wheat className="h-3 w-3 mr-1" />
                {crop.name}
              </Badge>
            ))}
            {kecamatan.tourism.attractions?.slice(0, 2).map((attraction, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Camera className="h-3 w-3 mr-1" />
                {attraction.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Informasi Tambahan</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Luas Wilayah:</strong> {kecamatan.area.toFixed(2)} km²</div>
            <div><strong>Kepadatan:</strong> {Math.round(kecamatan.demographics.populationDensity)} jiwa/km²</div>
            <div className="flex items-start gap-1">
              <MapPin className="h-3 w-3 mt-0.5 text-gray-400" />
              Ibukota: {kecamatan.capital}
            </div>
          </div>
        </div>

        <Button className="w-full" size="sm">
          Lihat Detail Lengkap
        </Button>
      </CardContent>
    </Card>
  )
}
