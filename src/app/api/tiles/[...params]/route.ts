import { NextRequest, NextResponse } from 'next/server'

// Tile proxy to handle CORS and authentication issues
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const { params: tileParams } = await params
    
    if (!tileParams || tileParams.length < 3) {
      return new NextResponse('Invalid tile parameters', { status: 400 })
    }

    const [z, x, y] = tileParams
    const extension = y.includes('.') ? y.split('.')[1] : 'png'
    const yClean = y.split('.')[0]

    // Validate tile parameters
    const zoom = parseInt(z)
    const xTile = parseInt(x)
    const yTile = parseInt(yClean)

    if (isNaN(zoom) || isNaN(xTile) || isNaN(yTile)) {
      return new NextResponse('Invalid tile coordinates', { status: 400 })
    }

    // Validate zoom level (reasonable bounds)
    if (zoom < 0 || zoom > 20) {
      return new NextResponse('Invalid zoom level', { status: 400 })
    }

    // Multiple tile sources for fallback - OpenFreeMap first for better performance
    const tileSources = [
      // OpenFreeMap (fast and reliable)
      `https://tiles.openfreemap.org/osm/${z}/${x}/${yClean}.png`,
      // CartoDB Positron (clean style)
      `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${yClean}.png`,
      // OpenStreetMap (fallback)
      `https://tile.openstreetmap.org/${z}/${x}/${yClean}.png`,
    ]

    let lastError: Error | null = null

    // Try each tile source
    for (const tileUrl of tileSources) {
      try {
        const response = await fetch(tileUrl, {
          headers: {
            'User-Agent': 'Sabu-Raijua-Government-Website/1.0',
            'Referer': process.env.NEXT_PUBLIC_BASE_URL || 'https://saburajua.go.id',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 seconds
        })

        if (response.ok) {
          const imageBuffer = await response.arrayBuffer()
          
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              'Content-Type': `image/${extension}`,
              'Cache-Control': 'public, max-age=3600', // Cache for 1 hour for better performance
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        }
      } catch (error) {
        lastError = error as Error
        console.warn(`Failed to fetch tile from ${tileUrl}:`, error)
        continue
      }
    }

    // If all sources fail, return a placeholder tile
    console.error('All tile sources failed:', lastError)
    return generatePlaceholderTile(zoom, xTile, yTile)

  } catch (error) {
    console.error('Tile proxy error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

// Generate a placeholder tile when all sources fail
function generatePlaceholderTile(z: number, x: number, y: number): NextResponse {
  // Simple SVG placeholder
  const svg = `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
      <text x="128" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#64748b">
        Map Tile
      </text>
      <text x="128" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
        ${z}/${x}/${y}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600', // Cache placeholder for 1 hour
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
