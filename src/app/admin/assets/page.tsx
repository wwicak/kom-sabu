'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { ASSET_CATEGORIES } from '@/lib/asset-management'

interface Asset {
  _id: string
  key: string
  url: string
  title: string
  description?: string
  alt?: string
  type: string
  category: string
  status: string
  order: number
  metadata?: {
    fileSize?: number
    dimensions?: {
      width: number
      height: number
    }
    format?: string
    originalName?: string
  }
  createdAt: string
  updatedAt: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/assets', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      const data = await response.json()
      setAssets(data.assets || [])
    } catch (error) {
      console.error('Error fetching assets:', error)
      toast({
        title: 'Error',
        description: 'Failed to load assets',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return

    try {
      const response = await fetch(`/api/admin/assets/${assetId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }

      toast({
        title: 'Success',
        description: 'Asset deleted successfully'
      })

      fetchAssets()
    } catch (error) {
      console.error('Error deleting asset:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive'
      })
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-600 mt-2">Manage website assets and media files</p>
          </div>
          <Button asChild>
            <a href="/admin/assets/upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload Asset
            </a>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(ASSET_CATEGORIES).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={fetchAssets} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading assets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset._id} className="overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  {asset.type === 'image' ? (
                    <Image
                      src={asset.url}
                      alt={asset.alt || asset.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1 truncate">{asset.title}</h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">Key: {asset.key}</p>

                  {asset.metadata && (
                    <div className="text-xs text-gray-500 mb-3">
                      {asset.metadata.dimensions && (
                        <div>{asset.metadata.dimensions.width} × {asset.metadata.dimensions.height}</div>
                      )}
                      <div>{formatFileSize(asset.metadata.fileSize)}</div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDeleteAsset(asset._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAssets.length === 0 && !loading && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Upload your first asset to get started'
              }
            </p>
            <Button asChild>
              <a href="/admin/assets/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Asset
              </a>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
