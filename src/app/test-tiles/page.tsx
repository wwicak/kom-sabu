'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestTilesPage() {
  const [z, setZ] = useState('10')
  const [x, setX] = useState('512')
  const [y, setY] = useState('512')
  const [tileUrl, setTileUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testTile = async () => {
    setLoading(true)
    setError('')
    
    const url = `/api/tiles/${z}/${x}/${y}.png`
    setTileUrl(url)
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      console.log('Tile loaded successfully:', response.headers.get('content-type'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tile Proxy Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test the tile proxy API to ensure it's working correctly
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="z">Zoom (Z)</Label>
              <Input
                id="z"
                value={z}
                onChange={(e) => setZ(e.target.value)}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="x">X Coordinate</Label>
              <Input
                id="x"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="512"
              />
            </div>
            <div>
              <Label htmlFor="y">Y Coordinate</Label>
              <Input
                id="y"
                value={y}
                onChange={(e) => setY(e.target.value)}
                placeholder="512"
              />
            </div>
          </div>

          <Button onClick={testTile} disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Test Tile'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">Error: {error}</p>
            </div>
          )}

          {tileUrl && !error && (
            <div className="space-y-4">
              <div>
                <Label>Tile URL:</Label>
                <code className="block p-2 bg-gray-100 rounded text-sm break-all">
                  {tileUrl}
                </code>
              </div>
              
              <div>
                <Label>Tile Image:</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={tileUrl}
                    alt={`Tile ${z}/${x}/${y}`}
                    className="max-w-full h-auto border"
                    onLoad={() => console.log('Image loaded successfully')}
                    onError={(e) => {
                      console.error('Image failed to load:', e)
                      setError('Failed to load tile image')
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p><strong>Note:</strong> This page tests the tile proxy API that resolves CORS issues with map tiles.</p>
            <p>Try different coordinates to test various tiles. Sabu Raijua area coordinates:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Zoom: 10-12</li>
              <li>X: 3430-3440</li>
              <li>Y: 2165-2175</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
