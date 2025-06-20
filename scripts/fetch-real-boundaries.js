#!/usr/bin/env node

/**
 * Script to fetch real administrative boundaries for Sabu Raijua from OpenStreetMap
 * Run with: node scripts/fetch-real-boundaries.js
 */

const fs = require('fs')
const path = require('path')

// Overpass API query for Sabu Raijua administrative boundaries
const OVERPASS_QUERY = `
[out:json][timeout:60];
(
  // Get Sabu Raijua regency boundary
  relation["admin_level"="5"]["name"~"Sabu Raijua|Kabupaten Sabu Raijua"];
  
  // Get all kecamatan (district) boundaries within Sabu Raijua
  relation["admin_level"="6"]["name"~"Sabu|Raijua"]["place"!="island"];
  
  // Get specific kecamatan by name
  relation["admin_level"="6"]["name"~"Sabu Barat|West Sabu"];
  relation["admin_level"="6"]["name"~"Sabu Tengah|Central Sabu"];
  relation["admin_level"="6"]["name"~"Sabu Timur|East Sabu"];
  relation["admin_level"="6"]["name"~"Sabu Liae"];
  relation["admin_level"="6"]["name"~"Hawu Mehara"];
  relation["admin_level"="6"]["name"="Raijua"];
);
(._;>;);
out geom;
`

// Alternative query focusing on ways and nodes
const ALTERNATIVE_QUERY = `
[out:json][timeout:60];
(
  // Search for administrative boundaries in the Sabu Raijua area
  way["admin_level"="6"]["place"!="island"](bbox:-10.65,121.60,-10.40,121.95);
  relation["admin_level"="6"]["place"!="island"](bbox:-10.65,121.60,-10.40,121.95);
);
(._;>;);
out geom;
`

async function fetchBoundariesFromOSM() {
  console.log('🌍 Fetching Sabu Raijua boundaries from OpenStreetMap...')
  
  try {
    const query = encodeURIComponent(OVERPASS_QUERY)
    const url = `https://overpass-api.de/api/interpreter?data=${query}`
    
    console.log('📡 Making request to Overpass API...')
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log(`✅ Received ${data.elements?.length || 0} elements from OSM`)
    
    return data
  } catch (error) {
    console.error('❌ Error fetching from OSM:', error.message)
    
    // Try alternative query
    console.log('🔄 Trying alternative query...')
    try {
      const altQuery = encodeURIComponent(ALTERNATIVE_QUERY)
      const altUrl = `https://overpass-api.de/api/interpreter?data=${altQuery}`
      
      const altResponse = await fetch(altUrl)
      if (!altResponse.ok) {
        throw new Error(`HTTP error! status: ${altResponse.status}`)
      }
      
      const altData = await altResponse.json()
      console.log(`✅ Alternative query returned ${altData.elements?.length || 0} elements`)
      return altData
    } catch (altError) {
      console.error('❌ Alternative query also failed:', altError.message)
      throw altError
    }
  }
}

function convertToGeoJSON(osmData) {
  console.log('🔄 Converting OSM data to GeoJSON...')
  
  const features = []
  const nodes = new Map()
  const ways = new Map()
  
  // Index nodes and ways
  osmData.elements.forEach(element => {
    if (element.type === 'node') {
      nodes.set(element.id, element)
    } else if (element.type === 'way') {
      ways.set(element.id, element)
    }
  })
  
  // Process relations (administrative boundaries)
  const relations = osmData.elements.filter(el => el.type === 'relation')
  
  relations.forEach(relation => {
    if (!relation.tags || !relation.tags.name) return
    
    console.log(`📍 Processing: ${relation.tags.name}`)
    
    // Extract coordinates from relation members
    const coordinates = extractCoordinatesFromRelation(relation, ways, nodes)
    
    if (coordinates.length > 3) { // Need at least 4 points for a polygon
      features.push({
        type: 'Feature',
        properties: {
          name: relation.tags.name,
          name_en: relation.tags['name:en'],
          admin_level: relation.tags.admin_level,
          type: relation.tags.type,
          osm_id: relation.id,
          place: relation.tags.place
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        }
      })
      
      console.log(`  ✅ Created polygon with ${coordinates.length} points`)
    } else {
      console.log(`  ⚠️ Insufficient coordinates (${coordinates.length} points)`)
    }
  })
  
  return {
    type: 'FeatureCollection',
    features,
    metadata: {
      source: 'OpenStreetMap',
      fetched_at: new Date().toISOString(),
      query_used: 'overpass_api',
      total_features: features.length
    }
  }
}

function extractCoordinatesFromRelation(relation, ways, nodes) {
  const coordinates = []
  
  if (!relation.members) return coordinates
  
  // Get outer way members
  const outerMembers = relation.members.filter(member => 
    member.type === 'way' && member.role === 'outer'
  )
  
  // If no explicit outer members, use all way members
  const wayMembers = outerMembers.length > 0 ? outerMembers : 
    relation.members.filter(member => member.type === 'way')
  
  wayMembers.forEach(member => {
    const way = ways.get(member.ref)
    if (way && way.nodes) {
      way.nodes.forEach(nodeId => {
        const node = nodes.get(nodeId)
        if (node && node.lat && node.lon) {
          coordinates.push([node.lon, node.lat])
        }
      })
    }
  })
  
  // Close the polygon if not already closed
  if (coordinates.length > 0) {
    const first = coordinates[0]
    const last = coordinates[coordinates.length - 1]
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push([first[0], first[1]])
    }
  }
  
  return coordinates
}

function generateTypeScriptFile(geoJson) {
  console.log('📝 Generating TypeScript file...')
  
  const template = `// Auto-generated real boundary data for Sabu Raijua
// Generated on: ${new Date().toISOString()}
// Source: OpenStreetMap via Overpass API

import { IKecamatan } from '@/lib/models/kecamatan'

export const OSM_SABU_RAIJUA_BOUNDARIES: Partial<IKecamatan>[] = [
${geoJson.features.map(feature => {
  const props = feature.properties
  const coords = feature.geometry.coordinates[0]
  
  // Calculate centroid
  const centroid = calculateCentroid(coords)
  
  return `  {
    name: '${props.name}',
    nameEnglish: '${props.name_en || ''}',
    code: 'OSM_${props.osm_id}',
    
    geometry: {
      type: 'Polygon',
      coordinates: [${JSON.stringify(coords, null, 8)}]
    },
    centroid: {
      type: 'Point',
      coordinates: [${centroid[0]}, ${centroid[1]}]
    },
    
    // OSM metadata
    osmId: ${props.osm_id},
    adminLevel: '${props.admin_level}',
    source: 'OpenStreetMap'
  }`
}).join(',\n')}
]

// Helper function to calculate polygon centroid
function calculateCentroid(coordinates: number[][]): [number, number] {
  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  )
  return [sum[0] / coordinates.length, sum[1] / coordinates.length]
}

// Export as GeoJSON for direct use
export const OSM_SABU_RAIJUA_GEOJSON = ${JSON.stringify(geoJson, null, 2)}
`
  
  return template
}

function calculateCentroid(coordinates) {
  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0]
  )
  return [sum[0] / coordinates.length, sum[1] / coordinates.length]
}

async function main() {
  try {
    console.log('🚀 Starting boundary fetch process...')
    
    // Fetch data from OSM
    const osmData = await fetchBoundariesFromOSM()
    
    // Convert to GeoJSON
    const geoJson = convertToGeoJSON(osmData)
    
    if (geoJson.features.length === 0) {
      console.log('⚠️ No boundary features found. Using fallback data.')
      return
    }
    
    // Save raw GeoJSON
    const geoJsonPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'osm-sabu-raijua.json')
    fs.writeFileSync(geoJsonPath, JSON.stringify(geoJson, null, 2))
    console.log(`💾 Saved GeoJSON to: ${geoJsonPath}`)
    
    // Generate TypeScript file
    const tsContent = generateTypeScriptFile(geoJson)
    const tsPath = path.join(__dirname, '..', 'src', 'lib', 'data', 'osm-sabu-raijua-boundaries.ts')
    fs.writeFileSync(tsPath, tsContent)
    console.log(`💾 Saved TypeScript file to: ${tsPath}`)
    
    console.log('✅ Boundary fetch completed successfully!')
    console.log(`📊 Found ${geoJson.features.length} administrative boundaries`)
    
    // Print summary
    geoJson.features.forEach(feature => {
      const coords = feature.geometry.coordinates[0]
      console.log(`  - ${feature.properties.name}: ${coords.length} coordinate points`)
    })
    
  } catch (error) {
    console.error('💥 Process failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { fetchBoundariesFromOSM, convertToGeoJSON }
