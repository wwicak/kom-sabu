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
  Clock,
  Building,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Service {
  _id: string
  name: string
  slug: string
  description: string
  category: string
  department: string
  duration: string
  status: 'active' | 'inactive' | 'maintenance'
  featured: boolean
  order: number
  onlineService?: {
    available: boolean
    url?: string
  }
  createdBy?: {
    fullName: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface ServicesResponse {
  services: Service[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function ServicesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
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
    { value: 'administrasi', label: 'Administrasi' },
    { value: 'perizinan', label: 'Perizinan' },
    { value: 'sosial', label: 'Sosial' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'ekonomi', label: 'Ekonomi' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'lingkungan', label: 'Lingkungan' }
  ]

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      })

      const response = await fetch(`/api/admin/services?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch services')
      }

      const data: { success: boolean; data: ServicesResponse } = await response.json()
      setServices(data.data.services)
      setPagination(data.data.pagination)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, categoryFilter, statusFilter, searchTerm, sortBy, router, toast])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleStatusUpdate = async (serviceIds: string[], newStatus: string) => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ids: serviceIds,
          updates: { status: newStatus }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update service status')
      }

      toast({
        title: 'Success',
        description: 'Service status updated successfully',
      })

      // Refresh the list
      fetchServices()
      setSelectedServices([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service status',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (serviceIds: string[]) => {
    if (!confirm('Are you sure you want to delete the selected service(s)?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/services?ids=${serviceIds.join(',')}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete services')
      }

      toast({
        title: 'Success',
        description: 'Service(s) deleted successfully',
      })

      // Refresh the list
      fetchServices()
      setSelectedServices([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete services',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, color: 'bg-green-500' },
      inactive: { label: 'Inactive', variant: 'secondary' as const, color: 'bg-gray-500' },
      maintenance: { label: 'Maintenance', variant: 'outline' as const, color: 'bg-yellow-500' }
    }

    const config = statusConfig[status as keyof typeof statusConfig]

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      administrasi: 'Administrasi',
      perizinan: 'Perizinan',
      sosial: 'Sosial',
      kesehatan: 'Kesehatan',
      pendidikan: 'Pendidikan',
      ekonomi: 'Ekonomi',
      infrastruktur: 'Infrastruktur',
      lingkungan: 'Lingkungan'
    }
    return categoryMap[category as keyof typeof categoryMap] || category
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Layanan Publik</h1>
            <p className="text-gray-600">Manage public services and their information</p>
          </div>
          <Button onClick={() => router.push('/admin/services/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Layanan
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
                    placeholder="Search services by name, description, or department..."
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

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="order">By Order</SelectItem>
                    <SelectItem value="department">By Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedServices.length} service(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedServices, 'active')}
                    >
                      Activate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedServices, 'inactive')}
                    >
                      Deactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedServices)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Table */}
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
                        checked={selectedServices.length === services.length && services.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices(services.map(s => s._id))
                          } else {
                            setSelectedServices([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No services found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service._id])
                              } else {
                                setSelectedServices(selectedServices.filter(id => id !== service._id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{service.name}</h3>
                                {service.featured && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {service.onlineService?.available && (
                                  <Badge variant="outline" className="text-xs">
                                    Online
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryLabel(service.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {service.department}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(service.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            {service.duration}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(service.createdAt)}
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
                                onClick={() => router.push(`/admin/services/${service._id}`)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => router.push(`/admin/services/${service._id}/edit`)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete([service._id])}
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
