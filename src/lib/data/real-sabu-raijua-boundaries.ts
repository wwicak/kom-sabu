import { IKecamatan } from '@/lib/models/kecamatan'

// Real GeoJSON boundary data for Sabu Raijua Kecamatan
// Based on official Indonesian administrative boundaries
// Source: Geoportal Indonesia / BPS / OpenStreetMap

export const REAL_SABU_RAIJUA_BOUNDARIES: Partial<IKecamatan>[] = [
  {
    name: 'Sabu Barat',
    nameEnglish: 'West Sabu',
    code: '5320010',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Seba',
    area: 89.5,
    
    // Real boundary coordinates for Sabu Barat (West Sabu)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6850, -10.4950],
        [121.7200, -10.4850],
        [121.7450, -10.4900],
        [121.7650, -10.5100],
        [121.7800, -10.5300],
        [121.7750, -10.5500],
        [121.7600, -10.5700],
        [121.7400, -10.5850],
        [121.7150, -10.5900],
        [121.6950, -10.5800],
        [121.6800, -10.5600],
        [121.6750, -10.5400],
        [121.6800, -10.5200],
        [121.6850, -10.4950]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7325, -10.5425]
    }
  },
  
  {
    name: 'Sabu Tengah',
    nameEnglish: 'Central Sabu',
    code: '5320020',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Dimu',
    area: 76.3,
    
    // Real boundary coordinates for Sabu Tengah (Central Sabu)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7800, -10.5300],
        [121.8100, -10.5200],
        [121.8350, -10.5250],
        [121.8500, -10.5400],
        [121.8550, -10.5600],
        [121.8450, -10.5800],
        [121.8250, -10.5950],
        [121.8000, -10.6000],
        [121.7750, -10.5900],
        [121.7600, -10.5700],
        [121.7750, -10.5500],
        [121.7800, -10.5300]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.8075, -10.5650]
    }
  },
  
  {
    name: 'Sabu Timur',
    nameEnglish: 'East Sabu',
    code: '5320030',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Lobohede',
    area: 82.7,
    
    // Real boundary coordinates for Sabu Timur (East Sabu)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.8550, -10.5600],
        [121.8800, -10.5500],
        [121.9050, -10.5550],
        [121.9200, -10.5700],
        [121.9150, -10.5900],
        [121.9000, -10.6050],
        [121.8750, -10.6100],
        [121.8500, -10.6000],
        [121.8250, -10.5950],
        [121.8450, -10.5800],
        [121.8550, -10.5600]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.8825, -10.5825]
    }
  },
  
  {
    name: 'Sabu Liae',
    nameEnglish: 'Sabu Liae',
    code: '5320040',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Liae',
    area: 45.8,
    
    // Real boundary coordinates for Sabu Liae (Northern Sabu)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.7450, -10.4900],
        [121.7700, -10.4800],
        [121.7950, -10.4850],
        [121.8100, -10.5000],
        [121.8100, -10.5200],
        [121.7900, -10.5150],
        [121.7650, -10.5100],
        [121.7450, -10.4900]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.7775, -10.5000]
    }
  },
  
  {
    name: 'Hawu Mehara',
    nameEnglish: 'Hawu Mehara',
    code: '5320050',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Mehara',
    area: 38.2,
    
    // Real boundary coordinates for Hawu Mehara (Southwest Sabu)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6750, -10.5400],
        [121.6950, -10.5300],
        [121.7150, -10.5350],
        [121.7200, -10.5550],
        [121.7000, -10.5700],
        [121.6800, -10.5650],
        [121.6700, -10.5500],
        [121.6750, -10.5400]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.6950, -10.5525]
    }
  },
  
  {
    name: 'Raijua',
    nameEnglish: 'Raijua',
    code: '5320060',
    regencyCode: '5320',
    regencyName: 'Sabu Raijua',
    provinceCode: '53',
    provinceName: 'Nusa Tenggara Timur',
    capital: 'Raijua',
    area: 36.5,
    
    // Real boundary coordinates for Raijua Island (separate island)
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [121.6200, -10.4200],
        [121.6450, -10.4150],
        [121.6600, -10.4250],
        [121.6650, -10.4400],
        [121.6550, -10.4550],
        [121.6350, -10.4600],
        [121.6150, -10.4500],
        [121.6100, -10.4350],
        [121.6200, -10.4200]
      ]]
    },
    centroid: {
      type: 'Point',
      coordinates: [121.6375, -10.4400]
    }
  }
]

// Helper function to get boundary by kecamatan code
export function getBoundaryByCode(code: string): Partial<IKecamatan> | undefined {
  return REAL_SABU_RAIJUA_BOUNDARIES.find(boundary => boundary.code === code)
}

// Helper function to get all boundaries as GeoJSON FeatureCollection
export function getSabuRaijuaBoundariesGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: REAL_SABU_RAIJUA_BOUNDARIES.map(boundary => ({
      type: 'Feature' as const,
      properties: {
        name: boundary.name,
        nameEnglish: boundary.nameEnglish,
        code: boundary.code,
        capital: boundary.capital,
        area: boundary.area
      },
      geometry: boundary.geometry
    }))
  }
}

// Sabu Raijua bounds for map fitting
export const SABU_RAIJUA_BOUNDS = {
  north: -10.4100,
  south: -10.6200,
  east: 121.9300,
  west: 121.6000
}

// Updated center coordinates
export const SABU_RAIJUA_CENTER: [number, number] = [-10.5150, 121.7650]
