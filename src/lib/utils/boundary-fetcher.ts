// Utility to fetch real administrative boundaries from various sources

interface BoundarySource {
  name: string
  url: string
  format: 'geojson' | 'topojson' | 'shapefile'
}

// Available boundary data sources
export const BOUNDARY_SOURCES: Record<string, BoundarySource> = {
  // Indonesian Government Geoportal
  BIG_GEOPORTAL: {
    name: 'Badan Informasi Geospasial (BIG)',
    url: 'https://tanahair.indonesia.go.id/portal-web/download/index',
    format: 'shapefile'
  },
  
  // GADM (Global Administrative Areas)
  GADM: {
    name: 'GADM - Global Administrative Areas',
    url: 'https://gadm.org/download_country_v3.html',
    format: 'geojson'
  },
  
  // OpenStreetMap via Overpass API
  OVERPASS_API: {
    name: 'OpenStreetMap Overpass API',
    url: 'https://overpass-api.de/api/interpreter',
    format: 'geojson'
  },
  
  // Natural Earth Data
  NATURAL_EARTH: {
    name: 'Natural Earth Data',
    url: 'https://www.naturalearthdata.com/downloads/',
    format: 'shapefile'
  }
}

// Overpass API query for Sabu Raijua administrative boundaries
export const SABU_RAIJUA_OVERPASS_QUERY = `
[out:json][timeout:25];
(
  // Get all administrative boundaries for Sabu Raijua Regency
  relation["admin_level"="6"]["name"~"Sabu Raijua|Kabupaten Sabu Raijua"];
  way(r);
  relation["admin_level"="7"]["name"~"Sabu|Raijua"]["admin_level"="7"];
  way(r);
);
out geom;
`

// Function to fetch boundaries from Overpass API
export async function fetchSabuRaijuaBoundariesFromOSM(): Promise<any> {
  try {
    const query = encodeURIComponent(SABU_RAIJUA_OVERPASS_QUERY)
    const response = await fetch(`${BOUNDARY_SOURCES.OVERPASS_API.url}?data=${query}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return convertOverpassToGeoJSON(data)
  } catch (error) {
    console.error('Error fetching boundaries from OSM:', error)
    throw error
  }
}

// Convert Overpass API response to GeoJSON
function convertOverpassToGeoJSON(overpassData: any): any {
  const features: any[] = []
  
  // Process relations (administrative boundaries)
  const relations = overpassData.elements.filter((el: any) => el.type === 'relation')
  
  relations.forEach((relation: any) => {
    if (relation.tags && relation.tags.name) {
      // Extract boundary coordinates from relation members
      const coordinates = extractCoordinatesFromRelation(relation, overpassData.elements)
      
      if (coordinates.length > 0) {
        features.push({
          type: 'Feature',
          properties: {
            name: relation.tags.name,
            admin_level: relation.tags.admin_level,
            type: relation.tags.type,
            id: relation.id
          },
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates]
          }
        })
      }
    }
  })
  
  return {
    type: 'FeatureCollection',
    features
  }
}

// Extract coordinates from relation members
function extractCoordinatesFromRelation(relation: any, elements: any[]): number[][] {
  const coordinates: number[][] = []
  
  // Get ways that are members of this relation
  const wayMembers = relation.members?.filter((member: any) => member.type === 'way') || []
  
  wayMembers.forEach((member: any) => {
    const way = elements.find((el: any) => el.type === 'way' && el.id === member.ref)
    if (way && way.geometry) {
      way.geometry.forEach((node: any) => {
        coordinates.push([node.lon, node.lat])
      })
    }
  })
  
  return coordinates
}

// Alternative: Fetch from GADM (requires preprocessing)
export async function fetchSabuRaijuaBoundariesFromGADM(): Promise<any> {
  // GADM provides country-level data, we need to filter for Sabu Raijua
  // This would typically be done server-side due to file size
  const gadmUrl = 'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_IDN_3.json'
  
  try {
    const response = await fetch(gadmUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Filter for Sabu Raijua features
    const sabuRaijuaFeatures = data.features.filter((feature: any) => {
      const props = feature.properties
      return props.NAME_2 === 'Sabu Raijua' || 
             props.NAME_3?.includes('Sabu') || 
             props.NAME_3?.includes('Raijua')
    })
    
    return {
      type: 'FeatureCollection',
      features: sabuRaijuaFeatures
    }
  } catch (error) {
    console.error('Error fetching boundaries from GADM:', error)
    throw error
  }
}

// Simplified boundary fetcher with fallback
export async function fetchRealBoundaries(): Promise<any> {
  try {
    // Try OSM first (most up-to-date)
    console.log('Fetching boundaries from OpenStreetMap...')
    return await fetchSabuRaijuaBoundariesFromOSM()
  } catch (osmError) {
    console.warn('OSM fetch failed, trying GADM...', osmError)
    
    try {
      // Fallback to GADM
      return await fetchSabuRaijuaBoundariesFromGADM()
    } catch (gadmError) {
      console.error('All boundary sources failed:', gadmError)
      
      // Return our manually created boundaries as final fallback
      const { getSabuRaijuaBoundariesGeoJSON } = await import('../data/real-sabu-raijua-boundaries')
      return getSabuRaijuaBoundariesGeoJSON()
    }
  }
}

// Validate and clean boundary data
export function validateBoundaryData(geoJson: any): boolean {
  if (!geoJson || geoJson.type !== 'FeatureCollection') {
    return false
  }
  
  return geoJson.features.every((feature: any) => {
    return feature.type === 'Feature' &&
           feature.geometry &&
           ['Polygon', 'MultiPolygon'].includes(feature.geometry.type) &&
           Array.isArray(feature.geometry.coordinates)
  })
}

// Simplify polygon coordinates (reduce complexity for better performance)
export function simplifyPolygon(coordinates: number[][], tolerance: number = 0.001): number[][] {
  // Simple Douglas-Peucker-like algorithm
  if (coordinates.length <= 2) return coordinates
  
  const simplified: number[][] = [coordinates[0]]
  
  for (let i = 1; i < coordinates.length - 1; i++) {
    const prev = coordinates[i - 1]
    const curr = coordinates[i]
    const next = coordinates[i + 1]
    
    // Calculate distance from current point to line between prev and next
    const distance = pointToLineDistance(curr, prev, next)
    
    if (distance > tolerance) {
      simplified.push(curr)
    }
  }
  
  simplified.push(coordinates[coordinates.length - 1])
  return simplified
}

// Calculate distance from point to line
function pointToLineDistance(point: number[], lineStart: number[], lineEnd: number[]): number {
  const [px, py] = point
  const [x1, y1] = lineStart
  const [x2, y2] = lineEnd
  
  const A = px - x1
  const B = py - y1
  const C = x2 - x1
  const D = y2 - y1
  
  const dot = A * C + B * D
  const lenSq = C * C + D * D
  
  if (lenSq === 0) return Math.sqrt(A * A + B * B)
  
  const param = dot / lenSq
  
  let xx, yy
  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }
  
  const dx = px - xx
  const dy = py - yy
  return Math.sqrt(dx * dx + dy * dy)
}
