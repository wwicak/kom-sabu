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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Crown,
  Shield,
  Briefcase,
  MoreHorizontal
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

interface Official {
  _id: string
  name: string
  position: string
  level: string
  category: string
  department: string
  period?: {
    start: string
    end: string
  }
  contact?: {
    phone?: string
    email?: string
  }
  status: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminOfficialsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const levels = ['kabupaten', 'kecamatan', 'dinas', 'badan', 'sekretariat']
  const categories = ['pimpinan', 'kepala_dinas', 'camat', 'sekretaris', 'staff']
  const statuses = ['active', 'inactive', 'retired']

  const fetchOfficials = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedLevel !== 'all' && { level: selectedLevel }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      })

      const response = await fetch(`/api/admin/officials?${params}`)
      const data = await response.json()

      if (data.success) {
        setOfficials(data.data)
        setTotalPages(data.pagination.pages)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch officials',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Fetch officials error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch officials',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm, selectedLevel, selectedCategory, selectedStatus])

  useEffect(() => {
    fetchOfficials()
  }, [fetchOfficials])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this official?')) return

    try {
      const response = await fetch(`/api/admin/officials/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Official deleted successfully'
        })
        fetchOfficials()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete official',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Delete official error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete official',
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
        if (!confirm(`Are you sure you want to delete ${selectedItems.length} officials?`)) return
        response = await fetch(`/api/admin/officials?ids=${selectedItems.join(',')}`, {
          method: 'DELETE'
        })
      } else {
        const updates: { status?: string; featured?: boolean } = {}
        if (action === 'activate') updates.status = 'active'
        if (action === 'deactivate') updates.status = 'inactive'
        if (action === 'feature') updates.featured = true
        if (action === 'unfeature') updates.featured = false

        response = await fetch('/api/admin/officials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedItems, updates })
        })
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `Successfully ${action}ed ${selectedItems.length} officials`
        })
        setSelectedItems([])
        fetchOfficials()
      } else {
        toast({
          title: 'Error',
          description: data.error || `Failed to ${action} officials`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error(`Bulk ${action} error:`, error)
      toast({
        title: 'Error',
        description: `Failed to ${action} officials`,
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-yellow-500'
      case 'retired': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'kabupaten': return Crown
      case 'kecamatan': return Shield
      default: return Briefcase
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pejabat</h1>
            <p className="text-gray-600">Manage government officials and their information</p>
          </div>
          <Button onClick={() => router.push('/admin/officials/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pejabat
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pejabat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Level</option>
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').charAt(0).toUpperCase() + category.replace('_', ' ').slice(1)}
                  </option>
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
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                    Aktifkan
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

        {/* Officials Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === officials.length && officials.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(officials.map(o => o._id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                      aria-label="Select all officials"
                    />
                  </TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : officials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No officials found
                    </TableCell>
                  </TableRow>
                ) : (
                  officials.map((official) => {
                    const LevelIcon = getLevelIcon(official.level)
                    return (
                      <TableRow key={official._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(official._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, official._id])
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== official._id))
                              }
                            }}
                            aria-label={`Select ${official.name}`}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LevelIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{official.name}</div>
                              {official.featured && (
                                <Badge variant="secondary" className="text-xs">Featured</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{official.position}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{official.level}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{official.department}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(official.status)}>
                            {official.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-600">
                            {official.contact?.phone && <div>{official.contact.phone}</div>}
                            {official.contact?.email && <div>{official.contact.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" aria-label={`Actions for ${official.name}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/admin/officials/${official._id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`/profil/pejabat`, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(official._id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
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
