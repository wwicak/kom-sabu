'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface Destination {
  _id: string
  name: string
  slug: string
  category: string
  subcategory?: string
  location: {
    district: string
    village?: string
  }
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  rating: {
    average: number
    count: number
  }
  statistics: {
    views: number
  }
  createdAt: string
  updatedAt: string
  createdBy?: {
    fullName: string
    email: string
  }
}

export default function AdminDestinationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const categories = ['Pantai', 'Bukit', 'Hutan', 'Mata Air', 'Budaya', 'Sejarah', 'Religi', 'Kuliner']
  const districts = ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
  const statuses = ['draft', 'published', 'archived']

  useEffect(() => {
    fetchDestinations()
  }, [page, searchTerm, selectedCategory, selectedDistrict, selectedStatus])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedDistrict !== 'all' && { district: selectedDistrict }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      })

      const response = await fetch(`/api/admin/destinations?${params}`)
      const data = await response.json()

      if (data.success) {
        setDestinations(data.data)
        setTotalPages(data.pagination.pages)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch destinations',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch destinations error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch destinations',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Destination deleted successfully'
        })
        fetchDestinations()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete destination',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Delete destination error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete destination',
        variant: 'destructive'
      })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select items first',
        variant: 'destructive'
      })
      return
    }

    try {
      let response
      if (action === 'delete') {
        if (!confirm(`Are you sure you want to delete ${selectedItems.length} destinations?`)) return
        response = await fetch(`/api/admin/destinations?ids=${selectedItems.join(',')}`, {
          method: 'DELETE'
        })
      } else {
        const updates: any = {}
        if (action === 'publish') updates.status = 'published'
        if (action === 'draft') updates.status = 'draft'
        if (action === 'archive') updates.status = 'archived'
        if (action === 'feature') updates.featured = true
        if (action === 'unfeature') updates.featured = false

        response = await fetch('/api/admin/destinations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedItems, updates })
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `Successfully ${action}ed ${selectedItems.length} destinations`
        })
        setSelectedItems([])
        fetchDestinations()
      } else {
        toast({
          title: 'Error',
          description: data.error || `Failed to ${action} destinations`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      toast({
        title: 'Error',
        description: `Failed to ${action} destinations`,
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Destinasi Wisata</h1>
            <p className="text-gray-600">Manage tourism destinations and attractions</p>
          </div>
          <Button onClick={() => router.push('/admin/destinations/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Destinasi
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari destinasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kecamatan</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'published' ? 'Dipublikasi' : 
                     status === 'draft' ? 'Draft' : 'Diarsipkan'}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  {selectedItems.length} item dipilih
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                    Publikasi
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('draft')}>
                    Draft
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('feature')}>
                    Feature
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destinations Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === destinations.length && destinations.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(destinations.map(d => d._id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : destinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      No destinations found
                    </TableCell>
                  </TableRow>
                ) : (
                  destinations.map((destination) => (
                    <TableRow key={destination._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(destination._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, destination._id])
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== destination._id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{destination.name}</div>
                            {destination.featured && (
                              <Star className="h-3 w-3 text-yellow-500 inline" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{destination.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{destination.location.district}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(destination.status)}>
                          {destination.status === 'published' ? 'Dipublikasi' : 
                           destination.status === 'draft' ? 'Draft' : 'Diarsipkan'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">
                            {destination.rating.average.toFixed(1)} ({destination.rating.count})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{destination.statistics.views}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">
                            {new Date(destination.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/destinations/${destination._id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/destinations/${destination.slug}`, '_blank')}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(destination._id)}
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
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
