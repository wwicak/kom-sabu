import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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
  geometry?: {
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
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastUpdated: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: unknown
}

// Interface for raw API data from kecamatan endpoint
interface RawKecamatanData {
  _id: string
  name: string
  code: string
  capital: string
  area: number
  demographics?: {
    totalPopulation?: number
    ageGroups?: {
      under15?: number
      age15to64?: number
      over64?: number
    }
  }
  villages?: unknown[]
  centroid?: {
    coordinates?: [number, number]
  }
  geometry?: {
    type?: string
    coordinates?: unknown[]
  }
  agriculture?: {
    mainCrops?: Array<{ name: string }>
    totalAgriculturalArea?: number
    fishery?: {
      marineCapture?: number
    }
  }
  tourism?: {
    attractions?: Array<{ name: string }>
    annualVisitors?: number
  }
  economy?: {
    mainIndustries?: string[]
    averageIncome?: number
    economicSectors?: {
      agriculture?: number
      industry?: number
      services?: number
    }
  }
  infrastructure?: {
    utilities?: {
      electricityAccess?: number
      cleanWaterAccess?: number
      internetAccess?: number
    }
    education?: {
      elementarySchools?: number
      juniorHighSchools?: number
      seniorHighSchools?: number
      universities?: number
    }
  }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

// Fetch all kecamatan data
export function useKecamatanList(includeInactive = false) {
  return useQuery<KecamatanData[]>({
    queryKey: ['kecamatan', 'list', includeInactive],
    queryFn: async () => {
      // First try the GeoJSON API for accurate polygon data
      try {
        const geoJsonResponse = await fetch('/api/geojson/kecamatan')
        if (geoJsonResponse.ok) {
          const geoJsonResult: ApiResponse<KecamatanData[]> = await geoJsonResponse.json()
          if (geoJsonResult.success && geoJsonResult.data) {
            console.log('Using GeoJSON data for accurate polygons')
            return geoJsonResult.data
          }
        }
      } catch (geoJsonError) {
        console.warn('GeoJSON API failed, falling back to regular API:', geoJsonError)
      }

      // Fallback to regular kecamatan API
      const params = new URLSearchParams()
      if (includeInactive) {
        params.append('includeInactive', 'true')
      }

      // Add includeGeometry parameter to get polygon data
      params.append('includeGeometry', 'true')
      params.append('regencyCode', '5320') // Sabu Raijua code
      const response = await fetch(`/api/kecamatan?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch kecamatan data')
      }

      const result: ApiResponse<RawKecamatanData[]> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch kecamatan data')
      }

      // Transform API data to match expected structure
      const transformedData: KecamatanData[] = result.data.map((item: RawKecamatanData) => ({
        _id: item._id,
        name: item.name,
        slug: item.code, // Use code as slug for now
        description: `Kecamatan ${item.name} dengan ibu kota ${item.capital}`,
        area: item.area,
        population: item.demographics?.totalPopulation || 0,
        villages: item.villages?.length || 0,
        coordinates: {
          center: {
            lat: item.centroid?.coordinates?.[1] || 0,
            lng: item.centroid?.coordinates?.[0] || 0
          }
        },
        polygon: {
          type: (item.geometry?.type === 'MultiPolygon' ? 'MultiPolygon' : 'Polygon') as 'Polygon' | 'MultiPolygon',
          coordinates: (item.geometry?.coordinates as number[][][]) || []
        },
        geometry: {
          type: (item.geometry?.type === 'MultiPolygon' ? 'MultiPolygon' : 'Polygon') as 'Polygon' | 'MultiPolygon',
          coordinates: (item.geometry?.coordinates as number[][][]) || []
        },
        potency: {
          agriculture: item.agriculture ? {
            mainCrops: item.agriculture.mainCrops?.map((crop) => crop.name) || [],
            productivity: 'Tinggi',
            farmingArea: item.agriculture.totalAgriculturalArea || 0
          } : undefined,
          fishery: item.agriculture?.fishery ? {
            mainSpecies: ['Ikan Laut'],
            productivity: 'Sedang',
            fishingArea: item.agriculture.fishery.marineCapture || 0
          } : undefined,
          tourism: item.tourism ? {
            attractions: item.tourism.attractions?.map((attr) => attr.name) || [],
            facilities: ['Homestay'],
            annualVisitors: item.tourism.annualVisitors || 0
          } : undefined,
          economy: item.economy ? {
            mainSectors: item.economy.mainIndustries || [],
            averageIncome: item.economy.averageIncome || 0,
            businessUnits: 0
          } : undefined,
          infrastructure: item.infrastructure ? {
            roads: 'Baik',
            electricity: item.infrastructure.utilities?.electricityAccess || 0,
            water: item.infrastructure.utilities?.cleanWaterAccess || 0,
            internet: item.infrastructure.utilities?.internetAccess || 0
          } : undefined
        },
        demographics: {
          ageGroups: {
            children: item.demographics?.ageGroups?.under15 || 0,
            adults: item.demographics?.ageGroups?.age15to64 || 0,
            elderly: item.demographics?.ageGroups?.over64 || 0
          },
          education: {
            elementary: item.infrastructure?.education?.elementarySchools || 0,
            junior: item.infrastructure?.education?.juniorHighSchools || 0,
            senior: item.infrastructure?.education?.seniorHighSchools || 0,
            higher: item.infrastructure?.education?.universities || 0
          },
          occupation: {
            agriculture: Math.round((item.economy?.economicSectors?.agriculture || 0) * (item.demographics?.totalPopulation || 0) / 100),
            fishery: Math.round((item.economy?.economicSectors?.industry || 0) * (item.demographics?.totalPopulation || 0) / 100),
            trade: Math.round((item.economy?.economicSectors?.services || 0) * (item.demographics?.totalPopulation || 0) / 100),
            services: 0,
            others: 0
          }
        },
        isActive: item.isActive !== false,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        lastUpdated: item.updatedAt || new Date().toISOString()
      }))

      return transformedData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Fetch specific kecamatan data
export function useKecamatan(slug: string) {
  return useQuery<KecamatanData>({
    queryKey: ['kecamatan', slug],
    queryFn: async () => {
      const response = await fetch(`/api/kecamatan/${slug}`)
      if (!response.ok) {
        throw new Error('Failed to fetch kecamatan data')
      }
      
      const result: ApiResponse<KecamatanData> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch kecamatan data')
      }
      
      return result.data
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create new kecamatan
export function useCreateKecamatan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<KecamatanData, '_id' | 'isActive' | 'createdAt' | 'updatedAt' | 'lastUpdated'>) => {
      const response = await fetch('/api/kecamatan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create kecamatan')
      }
      
      const result: ApiResponse<KecamatanData> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create kecamatan')
      }
      
      return result.data
    },
    onSuccess: () => {
      // Invalidate and refetch kecamatan list
      queryClient.invalidateQueries({ queryKey: ['kecamatan', 'list'] })
    },
  })
}

// Update kecamatan
export function useUpdateKecamatan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ slug, data }: { 
      slug: string
      data: Partial<Omit<KecamatanData, '_id' | 'slug' | 'createdAt' | 'updatedAt' | 'lastUpdated'>>
    }) => {
      const response = await fetch(`/api/kecamatan/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update kecamatan')
      }
      
      const result: ApiResponse<KecamatanData> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update kecamatan')
      }
      
      return result.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch kecamatan list and specific kecamatan
      queryClient.invalidateQueries({ queryKey: ['kecamatan', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['kecamatan', data.slug] })
    },
  })
}

// Delete (deactivate) kecamatan
export function useDeleteKecamatan() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/kecamatan/${slug}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete kecamatan')
      }
      
      const result: ApiResponse<null> = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete kecamatan')
      }
      
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch kecamatan list
      queryClient.invalidateQueries({ queryKey: ['kecamatan', 'list'] })
    },
  })
}
