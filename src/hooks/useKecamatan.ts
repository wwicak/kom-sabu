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
  details?: any
}

// Fetch all kecamatan data
export function useKecamatanList(includeInactive = false) {
  return useQuery<KecamatanData[]>({
    queryKey: ['kecamatan', 'list', includeInactive],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (includeInactive) {
        params.append('includeInactive', 'true')
      }
      
      const response = await fetch(`/api/kecamatan?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch kecamatan data')
      }
      
      const result: ApiResponse<KecamatanData[]> = await response.json()
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch kecamatan data')
      }
      
      return result.data
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
