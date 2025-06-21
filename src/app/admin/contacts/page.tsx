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
  Mail,
  Search,
  MoreHorizontal,
  Eye,
  Trash2,
  Archive,
  CheckCircle,
  Clock,
  Reply,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: 'pending' | 'read' | 'replied' | 'archived'
  consent: boolean
  createdAt: string
  updatedAt: string
}

interface ContactsResponse {
  contacts: Contact[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function ContactsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
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

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm }),
        sort: sortBy
      })

      const response = await fetch(`/api/admin/contacts?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error('Failed to fetch contacts')
      }

      const data: { success: boolean; data: ContactsResponse } = await response.json()
      setContacts(data.data.contacts)
      setPagination(data.data.pagination)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, statusFilter, searchTerm, sortBy, router, toast])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const handleStatusUpdate = async (contactIds: string[], newStatus: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ids: contactIds,
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update contact status')
      }

      toast({
        title: 'Success',
        description: 'Contact status updated successfully',
      })

      // Refresh the list
      fetchContacts()
      setSelectedContacts([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
        variant: 'destructive'
      })
    }
  }

  const handleDelete = async (contactIds: string[]) => {
    if (!confirm('Are you sure you want to delete the selected contact(s)?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/contacts?ids=${contactIds.join(',')}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete contacts')
      }

      toast({
        title: 'Success',
        description: 'Contact(s) deleted successfully',
      })

      // Refresh the list
      fetchContacts()
      setSelectedContacts([])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contacts',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      read: { label: 'Read', variant: 'default' as const, icon: Eye },
      replied: { label: 'Replied', variant: 'default' as const, icon: Reply },
      archived: { label: 'Archived', variant: 'outline' as const, icon: Archive }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Pesan Kontak</h1>
            <p className="text-gray-600">Manage contact form submissions and inquiries</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, subject, or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
                    <SelectItem value="status">By Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedContacts.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {selectedContacts.length} contact(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedContacts, 'read')}
                    >
                      Mark as Read
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedContacts, 'replied')}
                    >
                      Mark as Replied
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(selectedContacts, 'archived')}
                    >
                      Archive
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedContacts)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacts Table */}
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
                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts(contacts.map(c => c._id))
                          } else {
                            setSelectedContacts([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No contact messages found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts([...selectedContacts, contact._id])
                              } else {
                                setSelectedContacts(selectedContacts.filter(id => id !== contact._id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{contact.subject}</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contact.status)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(contact.createdAt)}
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
                                onClick={() => {
                                  alert(`Contact Details:\n\nName: ${contact.name}\nEmail: ${contact.email}\nSubject: ${contact.subject}\nMessage: ${contact.message}\nDate: ${formatDate(contact.createdAt)}`)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate([contact._id], 'read')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Read
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate([contact._id], 'replied')}
                              >
                                <Reply className="h-4 w-4 mr-2" />
                                Mark as Replied
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate([contact._id], 'archived')}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete([contact._id])}
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
