'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { AdminBreadcrumb } from '@/components/ui/breadcrumb'
import { BackButton } from '@/components/ui/back-button'

interface FormData {
  name: string
  description: string
  shortDescription: string
  category: string
  subcategory: string
  location: {
    district: string
    village: string
    address: string
    coordinates: {
      latitude: number | null
      longitude: number | null
    }
  }
  facilities: string[]
  activities: string[]
  accessibility: {
    parking: boolean
    restroom: boolean
    restaurant: boolean
    guide: boolean
    wheelchair: boolean
  }
  pricing: {
    entrance: number | null
    parking: number | null
    guide: number | null
  }
  operatingHours: {
    open: string
    close: string
    days: string[]
  }
  contact: {
    phone: string
    email: string
    website: string
  }
  images: Array<{
    url: string
    caption?: string
    alt?: string
    order: number
  }>
  featured: boolean
  status: string
}

export default function NewDestinationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    location: {
      district: '',
      village: '',
      address: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    },
    facilities: [],
    activities: [],
    accessibility: {
      parking: false,
      restroom: false,
      restaurant: false,
      guide: false,
      wheelchair: false
    },
    pricing: {
      entrance: null,
      parking: null,
      guide: null
    },
    operatingHours: {
      open: '',
      close: '',
      days: []
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    images: [],
    featured: false,
    status: 'draft'
  })

  const categories = [
    'Pantai', 'Bukit', 'Hutan', 'Mata Air', 'Budaya', 'Sejarah', 'Religi', 'Kuliner'
  ]

  const subcategories = [
    'Wisata Alam', 'Wisata Budaya', 'Wisata Religi', 'Wisata Kuliner', 'Wisata Sejarah'
  ]

  const districts = [
    'Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara'
  ]

  const handleInputChange = (field: string, value: string | boolean | number | string[] | Array<{ url: string; caption?: string; alt?: string; order: number }>) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, unknown>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category || !formData.location.district) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create destination')
      }

      toast({
        title: 'Success',
        description: 'Destination created successfully',
      })

      router.push('/admin/destinations')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create destination'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <AdminBreadcrumb
            items={[
              { label: 'Dashboard Admin', href: '/admin' },
              { label: 'Kelola Destinasi', href: '/admin/destinations' },
              { label: 'Tambah Destinasi', current: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton href="/admin/destinations" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Destinasi Wisata</h1>
            <p className="text-gray-600">Create a new tourism destination</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Dasar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama Destinasi *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama destinasi"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortDescription">Deskripsi Singkat *</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Deskripsi singkat destinasi (max 300 karakter)"
                      maxLength={300}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Lengkap *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Deskripsi lengkap destinasi"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subcategory">Sub Kategori</Label>
                      <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih sub kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem key={subcategory} value={subcategory}>
                              {subcategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Informasi Lokasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">Kecamatan *</Label>
                      <Select value={formData.location.district} onValueChange={(value) => handleInputChange('location.district', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kecamatan" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="village">Desa/Kelurahan</Label>
                      <Input
                        id="village"
                        value={formData.location.village}
                        onChange={(e) => handleInputChange('location.village', e.target.value)}
                        placeholder="Nama desa/kelurahan"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea
                      id="address"
                      value={formData.location.address}
                      onChange={(e) => handleInputChange('location.address', e.target.value)}
                      placeholder="Alamat lengkap destinasi"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Gambar Destinasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => handleInputChange('images', images)}
                    maxImages={10}
                    folder="destinations"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Destinasi Unggulan</Label>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Destinasi'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin/destinations')}
                  >
                    Batal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
