'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Building2, Wheat, Fish, Camera } from 'lucide-react'

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent').then(mod => ({ default: mod.MapComponent })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

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
  potency: {
    agriculture?: {
      mainCrops: string[]
      productivity: string
      farmingArea: number
    }
    fishery?: {
      mainSpecies: string[]
      productivity: string
      fishingArea: number
    }
    tourism?: {
      attractions: string[]
      facilities: string[]
      annualVisitors: number
    }
    economy?: {
      mainSectors: string[]
      averageIncome: number
      businessUnits: number
    }
    infrastructure?: {
      roads: string
      electricity: number
      water: number
      internet: number
    }
  }
  demographics: {
    ageGroups: {
      children: number
      adults: number
      elderly: number
    }
    education: {
      elementary: number
      junior: number
      senior: number
      higher: number
    }
    occupation: {
      agriculture: number
      fishery: number
      trade: number
      services: number
      others: number
    }
  }
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

interface InteractiveMapProps {
  kecamatanData: KecamatanData[]
  selectedKecamatan?: string | null
  onKecamatanSelect?: (kecamatan: KecamatanData | null) => void
}

export function InteractiveMap({ kecamatanData, selectedKecamatan, onKecamatanSelect }: InteractiveMapProps) {
  return (
    <MapComponent
      kecamatanData={kecamatanData}
      selectedKecamatan={selectedKecamatan}
      onKecamatanSelect={onKecamatanSelect}
    />
  )
}

// Kecamatan detail card component
export function KecamatanDetailCard({ kecamatan, onClose }: { kecamatan: KecamatanData; onClose: () => void }) {
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
        {kecamatan.description && (
          <p className="text-sm text-gray-600">{kecamatan.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium">{kecamatan.population.toLocaleString()}</div>
              <div className="text-gray-500">Penduduk</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium">{kecamatan.villages}</div>
              <div className="text-gray-500">Desa</div>
            </div>
          </div>
        </div>

        {/* Potency */}
        {kecamatan.potency && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Potensi Unggulan</h4>
            <div className="flex flex-wrap gap-1">
              {kecamatan.potency.agriculture?.mainCrops?.map((crop, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Wheat className="h-3 w-3 mr-1" />
                  {crop}
                </Badge>
              ))}
              {kecamatan.potency.fishery?.mainSpecies?.map((species, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Fish className="h-3 w-3 mr-1" />
                  {species}
                </Badge>
              ))}
              {kecamatan.potency.tourism?.attractions?.slice(0, 2).map((attraction, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Camera className="h-3 w-3 mr-1" />
                  {attraction}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Head Office */}
        {kecamatan.headOffice && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Kantor Kecamatan</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {kecamatan.headOffice.head && (
                <div><strong>Camat:</strong> {kecamatan.headOffice.head}</div>
              )}
              {kecamatan.headOffice.address && (
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 text-gray-400" />
                  {kecamatan.headOffice.address}
                </div>
              )}
            </div>
          </div>
        )}

        <Button className="w-full" size="sm">
          Lihat Detail Lengkap
        </Button>
      </CardContent>
    </Card>
  )
}
