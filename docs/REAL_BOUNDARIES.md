# Real Kecamatan Boundaries for Sabu Raijua

This document explains how to obtain and use real administrative boundaries for the kecamatan (districts) in Sabu Raijua instead of the simplified rectangular approximations.

## Overview

The map currently uses simplified polygon boundaries as placeholders. To display accurate kecamatan boundaries that follow the real geographic borders, you have several options:

## Option 1: Use Our Enhanced Local Data (Recommended)

We've created improved boundary data in `src/lib/data/real-sabu-raijua-boundaries.ts` with more realistic polygon shapes based on research and satellite imagery.

**Pros:**
- ✅ Ready to use immediately
- ✅ Optimized for web performance
- ✅ Includes all 6 kecamatan
- ✅ Proper coordinate precision

**Cons:**
- ⚠️ Still approximated (not survey-grade accurate)

## Option 2: Fetch from OpenStreetMap (Most Accurate)

Use the provided script to fetch real boundaries from OpenStreetMap's Overpass API.

### Steps:

1. **Run the fetch script:**
   ```bash
   node scripts/fetch-real-boundaries.js
   ```

2. **The script will:**
   - Query OpenStreetMap for Sabu Raijua administrative boundaries
   - Convert the data to GeoJSON format
   - Generate TypeScript files for your project
   - Save files to `src/lib/data/`

3. **Files generated:**
   - `osm-sabu-raijua.json` - Raw GeoJSON data
   - `osm-sabu-raijua-boundaries.ts` - TypeScript interface

### Requirements:
- Internet connection
- Node.js installed
- OpenStreetMap data availability for Sabu Raijua

## Option 3: Indonesian Government Sources

### BPS (Badan Pusat Statistik)
- **URL:** https://www.bps.go.id/
- **Data:** Official administrative boundaries
- **Format:** Shapefile, sometimes GeoJSON
- **Accuracy:** Survey-grade accurate

### Geoportal Indonesia (BIG)
- **URL:** https://tanahair.indonesia.go.id/
- **Data:** Official government geospatial data
- **Format:** Shapefile, KML
- **Accuracy:** Survey-grade accurate

### Steps for Government Data:
1. Download shapefile for NTT Province or Sabu Raijua specifically
2. Convert to GeoJSON using tools like:
   - QGIS (free, open-source)
   - ogr2ogr command line tool
   - Online converters
3. Extract kecamatan-level boundaries
4. Import into your project

## Option 4: GADM Database

GADM provides global administrative boundaries including Indonesia.

### Steps:
1. Visit https://gadm.org/download_country_v3.html
2. Download Indonesia level 3 data (includes kecamatan)
3. Filter for Sabu Raijua boundaries
4. Convert and import

## Implementation

### Current Implementation

The map component (`SabuRaijuaMap.tsx`) now includes:

```typescript
import { useRealBoundaries } from '@/hooks/useRealBoundaries'

// The hook automatically enhances your kecamatan data with real boundaries
const { enhancedKecamatanData, isLoading, error, boundarySource } = useRealBoundaries(kecamatanData)
```

### Boundary Quality Indicators

The system includes quality scoring:
- **0-30:** Simple rectangles/approximations
- **31-60:** Basic polygon shapes
- **61-80:** Detailed boundaries with good precision
- **81-100:** Survey-grade accurate boundaries

### Fallback Strategy

The implementation uses a fallback hierarchy:
1. **Local enhanced data** (immediate)
2. **OpenStreetMap data** (if available)
3. **GADM data** (if OSM fails)
4. **Original simple boundaries** (final fallback)

## Data Sources Comparison

| Source | Accuracy | Update Frequency | Ease of Use | Cost |
|--------|----------|------------------|-------------|------|
| Local Enhanced | Medium | Manual | ✅ Easy | Free |
| OpenStreetMap | High | Community-driven | ✅ Easy | Free |
| BPS/BIG | Very High | Official updates | ⚠️ Complex | Free |
| GADM | High | Annual | ✅ Easy | Free |

## Coordinate System

All boundary data should use:
- **Coordinate System:** WGS84 (EPSG:4326)
- **Format:** [longitude, latitude]
- **Precision:** At least 4 decimal places for good accuracy

## Sabu Raijua Geographic Bounds

```typescript
const SABU_RAIJUA_BOUNDS = {
  north: -10.4100,
  south: -10.6200,
  east: 121.9300,
  west: 121.6000
}
```

## Kecamatan List

Sabu Raijua has 6 kecamatan:
1. **Sabu Barat** (West Sabu) - Capital: Seba
2. **Sabu Tengah** (Central Sabu) - Capital: Dimu  
3. **Sabu Timur** (East Sabu) - Capital: Lobohede
4. **Sabu Liae** - Capital: Liae
5. **Hawu Mehara** - Capital: Mehara
6. **Raijua** - Capital: Raijua (separate island)

## Troubleshooting

### Common Issues:

1. **No boundaries found in OSM**
   - Sabu Raijua might have limited OSM coverage
   - Try alternative data sources
   - Use our enhanced local data as fallback

2. **Coordinate precision issues**
   - Ensure coordinates are in WGS84
   - Check longitude/latitude order
   - Verify decimal precision

3. **Performance issues**
   - Simplify polygons if too detailed
   - Use appropriate zoom levels
   - Consider polygon simplification algorithms

### Validation:

```typescript
import { validateBoundaryData, getBoundaryQuality } from '@/hooks/useRealBoundaries'

// Check if boundary data is valid
const isValid = validateBoundaryData(geoJsonData)

// Get quality score (0-100)
const quality = getBoundaryQuality(kecamatanData)
```

## Contributing

If you obtain high-quality boundary data for Sabu Raijua:

1. Validate the data accuracy
2. Ensure proper licensing/attribution
3. Update the boundary files
4. Test with the map component
5. Submit a pull request

## Legal Considerations

- Ensure you have rights to use the boundary data
- Provide proper attribution for data sources
- Government data is typically public domain
- OpenStreetMap data requires attribution

## Future Improvements

- [ ] Automatic boundary updates from OSM
- [ ] Integration with Indonesian government APIs
- [ ] Boundary simplification for better performance
- [ ] Multi-resolution boundaries (zoom-dependent detail)
- [ ] Validation against official sources
