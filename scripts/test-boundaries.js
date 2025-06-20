#!/usr/bin/env node

/**
 * Test script to validate boundary data quality and coverage
 * Run with: node scripts/test-boundaries.js
 */

const fs = require('fs')
const path = require('path')

// Import the boundary data (we'll read the file directly since it's TS)
function loadBoundaryData() {
  const boundaryFile = path.join(__dirname, '..', 'src', 'lib', 'data', 'real-sabu-raijua-boundaries.ts')
  
  if (!fs.existsSync(boundaryFile)) {
    console.error('❌ Boundary file not found:', boundaryFile)
    return null
  }
  
  const content = fs.readFileSync(boundaryFile, 'utf8')
  
  // Extract the boundary data (simple regex parsing)
  const match = content.match(/export const REAL_SABU_RAIJUA_BOUNDARIES[^=]*=\s*(\[[\s\S]*?\])/m)
  
  if (!match) {
    console.error('❌ Could not parse boundary data from file')
    return null
  }
  
  try {
    // This is a simplified extraction - in a real scenario you'd use proper TS parsing
    const dataStr = match[1]
    // For testing, we'll just validate the structure exists
    return { found: true, content: dataStr }
  } catch (error) {
    console.error('❌ Error parsing boundary data:', error.message)
    return null
  }
}

function validateCoordinates(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { valid: false, reason: 'No coordinates provided' }
  }
  
  // Check if coordinates are in valid range for Sabu Raijua
  const SABU_BOUNDS = {
    minLon: 121.6,
    maxLon: 121.95,
    minLat: -10.65,
    maxLat: -10.40
  }
  
  let validCount = 0
  let totalCount = coordinates.length
  
  for (const coord of coordinates) {
    if (Array.isArray(coord) && coord.length >= 2) {
      const [lon, lat] = coord
      if (
        lon >= SABU_BOUNDS.minLon && lon <= SABU_BOUNDS.maxLon &&
        lat >= SABU_BOUNDS.minLat && lat <= SABU_BOUNDS.maxLat
      ) {
        validCount++
      }
    }
  }
  
  const validPercentage = (validCount / totalCount) * 100
  
  return {
    valid: validPercentage > 80, // At least 80% of coordinates should be in valid range
    validCount,
    totalCount,
    validPercentage: validPercentage.toFixed(1),
    reason: validPercentage <= 80 ? `Only ${validPercentage.toFixed(1)}% coordinates in valid range` : 'OK'
  }
}

function calculatePolygonArea(coordinates) {
  // Simple area calculation using shoelace formula
  if (!coordinates || coordinates.length < 3) return 0
  
  let area = 0
  const n = coordinates.length
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += coordinates[i][0] * coordinates[j][1]
    area -= coordinates[j][0] * coordinates[i][1]
  }
  
  return Math.abs(area) / 2
}

function analyzeBoundaryQuality() {
  console.log('🔍 Analyzing boundary data quality...\n')
  
  const boundaryData = loadBoundaryData()
  
  if (!boundaryData) {
    console.log('❌ Cannot analyze - boundary data not accessible')
    return
  }
  
  console.log('✅ Boundary data file found and readable')
  
  // Expected kecamatan for Sabu Raijua
  const expectedKecamatan = [
    'Sabu Barat',
    'Sabu Tengah', 
    'Sabu Timur',
    'Sabu Liae',
    'Hawu Mehara',
    'Raijua'
  ]
  
  console.log('\n📊 Expected Kecamatan Coverage:')
  expectedKecamatan.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`)
  })
  
  // Check if the content includes all expected kecamatan
  const content = boundaryData.content
  const foundKecamatan = []
  
  expectedKecamatan.forEach(name => {
    if (content.includes(`'${name}'`) || content.includes(`"${name}"`)) {
      foundKecamatan.push(name)
      console.log(`  ✅ ${name} - Found`)
    } else {
      console.log(`  ❌ ${name} - Missing`)
    }
  })
  
  console.log(`\n📈 Coverage: ${foundKecamatan.length}/${expectedKecamatan.length} (${((foundKecamatan.length/expectedKecamatan.length)*100).toFixed(1)}%)`)
  
  // Analyze coordinate complexity
  const coordinateMatches = content.match(/coordinates:\s*\[\[\[([\s\S]*?)\]\]\]/g) || []
  
  console.log('\n🗺️ Boundary Complexity Analysis:')
  console.log(`  Found ${coordinateMatches.length} polygon definitions`)
  
  if (coordinateMatches.length > 0) {
    coordinateMatches.forEach((match, index) => {
      // Count coordinate points (rough estimate)
      const pointCount = (match.match(/\[[\d\.-]+,\s*[\d\.-]+\]/g) || []).length
      console.log(`  Polygon ${index + 1}: ~${pointCount} coordinate points`)
      
      if (pointCount < 5) {
        console.log(`    ⚠️ Very simple (${pointCount} points) - may be rectangular approximation`)
      } else if (pointCount < 15) {
        console.log(`    ✅ Basic polygon (${pointCount} points) - reasonable detail`)
      } else {
        console.log(`    🎯 Detailed polygon (${pointCount} points) - high quality`)
      }
    })
  }
  
  // Check for coordinate precision
  const coordMatches = content.match(/\[[\d\.-]+,\s*[\d\.-]+\]/g) || []
  if (coordMatches.length > 0) {
    const sampleCoord = coordMatches[0]
    const decimalPlaces = (sampleCoord.match(/\.\d+/g) || []).map(d => d.length - 1)
    const avgPrecision = decimalPlaces.reduce((a, b) => a + b, 0) / decimalPlaces.length
    
    console.log('\n🎯 Coordinate Precision:')
    console.log(`  Average decimal places: ${avgPrecision.toFixed(1)}`)
    
    if (avgPrecision < 3) {
      console.log('  ⚠️ Low precision - may affect accuracy')
    } else if (avgPrecision < 5) {
      console.log('  ✅ Good precision - suitable for web mapping')
    } else {
      console.log('  🎯 High precision - excellent for detailed mapping')
    }
  }
  
  console.log('\n📋 Recommendations:')
  
  if (foundKecamatan.length < expectedKecamatan.length) {
    console.log('  🔧 Add missing kecamatan boundaries')
  }
  
  if (coordinateMatches.length > 0) {
    const avgComplexity = coordinateMatches.reduce((sum, match) => {
      const pointCount = (match.match(/\[[\d\.-]+,\s*[\d\.-]+\]/g) || []).length
      return sum + pointCount
    }, 0) / coordinateMatches.length
    
    if (avgComplexity < 10) {
      console.log('  🔧 Consider adding more coordinate points for better accuracy')
      console.log('  💡 Try fetching from OpenStreetMap: node scripts/fetch-real-boundaries.js')
    }
  }
  
  console.log('  📖 See docs/REAL_BOUNDARIES.md for detailed instructions')
  
  return {
    coverage: foundKecamatan.length / expectedKecamatan.length,
    foundKecamatan,
    missingKecamatan: expectedKecamatan.filter(k => !foundKecamatan.includes(k)),
    polygonCount: coordinateMatches.length
  }
}

function testMapIntegration() {
  console.log('\n🗺️ Testing Map Integration...')
  
  // Check if map component exists
  const mapComponent = path.join(__dirname, '..', 'src', 'components', 'maps', 'SabuRaijuaMap.tsx')
  
  if (fs.existsSync(mapComponent)) {
    console.log('✅ Map component found')
    
    const mapContent = fs.readFileSync(mapComponent, 'utf8')
    
    // Check for real boundary imports
    if (mapContent.includes('useRealBoundaries')) {
      console.log('✅ Real boundaries hook integrated')
    } else {
      console.log('⚠️ Real boundaries hook not found in map component')
    }
    
    if (mapContent.includes('SABU_RAIJUA_CENTER')) {
      console.log('✅ Real center coordinates imported')
    } else {
      console.log('⚠️ Still using old center coordinates')
    }
    
  } else {
    console.log('❌ Map component not found')
  }
  
  // Check if hook exists
  const hookFile = path.join(__dirname, '..', 'src', 'hooks', 'useRealBoundaries.ts')
  
  if (fs.existsSync(hookFile)) {
    console.log('✅ Real boundaries hook found')
  } else {
    console.log('❌ Real boundaries hook missing')
  }
}

function main() {
  console.log('🚀 Sabu Raijua Boundary Data Test\n')
  console.log('=' .repeat(50))
  
  const results = analyzeBoundaryQuality()
  testMapIntegration()
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  
  if (results) {
    console.log(`  Coverage: ${(results.coverage * 100).toFixed(1)}%`)
    console.log(`  Polygons: ${results.polygonCount}`)
    
    if (results.coverage >= 1.0) {
      console.log('  🎉 All kecamatan boundaries available!')
    } else {
      console.log(`  ⚠️ Missing: ${results.missingKecamatan.join(', ')}`)
    }
  }
  
  console.log('\n💡 Next steps:')
  console.log('  1. Run: npm run dev')
  console.log('  2. Visit: http://localhost:3001/peta-kecamatan')
  console.log('  3. Check if polygons follow real boundaries')
  console.log('  4. If needed, run: node scripts/fetch-real-boundaries.js')
}

if (require.main === module) {
  main()
}
