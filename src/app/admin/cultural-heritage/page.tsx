'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Palette,
  Music,
  MapPin,
  Camera,
  Utensils,
  Users,
  Building,
  Heart
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface CulturalAsset {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  type: string
  images: Array<{
    url: string
    caption?: string
    alt?: string
    order: number
  }>
  icon: string
  status: 'active' | 'endangered' | 'extinct' | 'reviving'
  featured: boolean
  order: number
  visibility: 'public' | 'private' | 'draft'
  location?: {
    district?: string
    village?: string
  }
  createdBy?: {
    fullName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface AssetsResponse {
  assets: CulturalAsset[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function CulturalHeritagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [assets, setAssets] = useState<CulturalAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Kerajinan Tradisional', label: 'Kerajinan Tradisional' },
    { value: 'Seni Pertunjukan', label: 'Seni Pertunjukan' },
    { value: 'Bahasa & Sastra', label: 'Bahasa & Sastra' },
    { value: 'Wisata Alam', label: 'Wisata Alam' },
    { value: 'Kuliner', label: 'Kuliner' },
    { value: 'Upacara Adat', label: 'Upacara Adat' },
    { value: 'Arsitektur', label: 'Arsitektur' },
    { value: 'Musik Tradisional', label: 'Musik Tradisional' }
  ]

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'asset', label: 'Asset' },
    { value: 'tradition', label: 'Tradition' },
    { value: 'destination', label: 'Destination' },
    { value: 'culinary', label: 'Culinary' }
  ]

  const iconMap = {
    Palette,
    Music,
    MapPin,
    Camera,
    Utensils,
    Users,
    Building,
    Heart
  }

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(visibilityFilter !== 'all' && { visibility: visibilityFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      })

      const response = await fetch(`/api/admin/cultural-heritage?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch cultural assets')
      }

      const data: { success: boolean; data: AssetsResponse } = await response.json()
      setAssets(data.data.assets)
      setPagination(data.data.pagination)
    } catch (error) {
      console.error('Error fetching cultural assets:', error)
      toast({
        title: 'Error',
        description: 'Failed to load cultural assets',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, categoryFilter, typeFilter, statusFilter, visibilityFilter, searchTerm, sortBy, router, toast])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const handleVisibilityUpdate = async (assetIds: string[], newVisibility: string) => {
    try {
      const response = await fetch('/api/admin/cultural-heritage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ids: assetIds,
          updates: { visibility: newVisibility }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update asset visibility')
      }

      toast({
        title: 'Success',
        description: 'Asset visibility updated successfully',
      })

      // Refresh the list
      fetchAssets()
      setSelectedAssets([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update asset visibility',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (assetIds: string[]) => {
    if (!confirm('Are you sure you want to delete the selected cultural asset(s)?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/cultural-heritage?ids=${assetIds.join(',')}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete cultural assets')
      }

      toast({
        title: 'Success',
        description: 'Cultural asset(s) deleted successfully',
      })

      // Refresh the list
      fetchAssets()
      setSelectedAssets([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete cultural assets',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, color: 'bg-green-500' },
      endangered: { label: 'Endangered', variant: 'destructive' as const, color: 'bg-red-500' },
      extinct: { label: 'Extinct', variant: 'secondary' as const, color: 'bg-gray-500' },
      reviving: { label: 'Reviving', variant: 'outline' as const, color: 'bg-yellow-500' }
    }

    const config = statusConfig[status as keyof typeof statusConfig]

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const getVisibilityBadge = (visibility: string) => {
    const visibilityConfig = {
      public: { label: 'Public', variant: 'default' as const },
      private: { label: 'Private', variant: 'secondary' as const },
      draft: { label: 'Draft', variant: 'outline' as const }
    }

    const config = visibilityConfig[visibility as keyof typeof visibilityConfig]

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Heart
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Warisan Budaya</h1>
            <p className="text-gray-600">Manage cultural heritage assets and traditions</p>
          </div>
          <Button onClick={() => router.push('/admin/cultural-heritage/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Warisan Budaya
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cultural assets by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visibility</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="order">By Order</SelectItem>
                    <SelectItem value="category">By Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedAssets.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedAssets.length} asset(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityUpdate(selectedAssets, 'public')}
                    >
                      Make Public
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVisibilityUpdate(selectedAssets, 'draft')}
                    >
                      Make Draft
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedAssets)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedAssets.length === assets.length && assets.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssets(assets.map(a => a._id))
                          } else {
                            setSelectedAssets([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No cultural assets found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((asset) => (
                      <TableRow key={asset._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedAssets.includes(asset._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAssets([...selectedAssets, asset._id])
                              } else {
                                setSelectedAssets(selectedAssets.filter(id => id !== asset._id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            {asset.images && asset.images.length > 0 ? (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={asset.images[0].url}
                                  alt={asset.images[0].alt || asset.title}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {getIcon(asset.icon)}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{asset.title}</h3>
                                {asset.featured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {asset.description}
                              </p>
                              {asset.location?.district && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {asset.location.district}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {asset.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm capitalize">
                          {asset.type}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(asset.status)}
                        </TableCell>
                        <TableCell>
                          {getVisibilityBadge(asset.visibility)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(asset.createdAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/cultural-heritage/${asset._id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/cultural-heritage/${asset._id}/edit`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete([asset._id])}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
