'use client'

import { useEffect, useState } from 'react'

export default function TestGeoJSONPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/test-geojson')
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">GeoJSON Test Results</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
