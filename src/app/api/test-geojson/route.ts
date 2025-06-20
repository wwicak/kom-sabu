import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the GeoJSON API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'
    const response = await fetch(`${baseUrl}/api/geojson/kecamatan`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch GeoJSON data' }, { status: 500 })
    }
    
    const data = await response.json()
    
    // Return a summary of the data
    return NextResponse.json({
      success: data.success,
      count: data.data?.length || 0,
      source: data.source,
      firstKecamatan: data.data?.[0] ? {
        name: data.data[0].name,
        code: data.data[0].code,
        hasGeometry: !!data.data[0].geometry,
        geometryType: data.data[0].geometry?.type,
        coordinatesLength: data.data[0].geometry?.coordinates?.length
      } : null,
      allKecamatan: data.data?.map((k: any) => ({
        name: k.name,
        code: k.code,
        hasGeometry: !!k.geometry,
        geometryType: k.geometry?.type
      })) || []
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: (error as Error).message 
    }, { status: 500 })
  }
}
