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
import { ArrowLeft, Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImageUpload } from '@/components/admin/ImageUpload'

interface FormData {
  title: string
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
  content: string
  metadata: {
    origin: string
    period: string
    significance: string
    preservation: string
    practitioners: string
    materials: string[]
    techniques: string[]
    occasions: string[]
  }
  location: {
    district: string
    village: string
    coordinates: {
      latitude: number | null
      longitude: number | null
    }
  }
  status: string
  featured: boolean
  order: number
  visibility: string
  tags: string[]
}

export default function NewCulturalHeritagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    type: '',
    images: [],
    icon: 'Heart',
    content: '',
    metadata: {
      origin: '',
      period: '',
      significance: '',
      preservation: '',
      practitioners: '',
      materials: [],
      techniques: [],
      occasions: []
    },
    location: {
      district: '',
      village: '',
      coordinates: {
        latitude: null,
        longitude: null
      }
    },
    status: 'active',
    featured: false,
    order: 0,
    visibility: 'draft',
    tags: []
  })

  const categories = [
    'Kerajinan Tradisional',
    'Seni Pertunjukan',
    'Bahasa & Sastra',
    'Wisata Alam',
    'Kuliner',
    'Upacara Adat',
    'Arsitektur',
    'Musik Tradisional'
  ]

  const types = [
    { value: 'asset', label: 'Asset' },
    { value: 'tradition', label: 'Tradition' },
    { value: 'destination', label: 'Destination' },
    { value: 'culinary', label: 'Culinary' }
  ]



  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'endangered', label: 'Endangered' },
    { value: 'extinct', label: 'Extinct' },
    { value: 'reviving', label: 'Reviving' }
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

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    handleInputChange(field, items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category || !formData.type) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/cultural-heritage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create cultural asset')
      }

      toast({
        title: 'Success',
        description: 'Cultural heritage asset created successfully',
      })

      router.push('/admin/cultural-heritage')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create cultural asset'
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Warisan Budaya</h1>
            <p className="text-gray-600">Create a new cultural heritage asset</p>
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
                    <Label htmlFor="title">Judul *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Masukkan judul warisan budaya"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Deskripsi warisan budaya"
                      rows={4}
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
                      <Label htmlFor="type">Tipe *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Konten Lengkap</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Konten lengkap tentang warisan budaya"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Gambar Warisan Budaya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => handleInputChange('images', images)}
                    maxImages={10}
                    folder="cultural-heritage"
                  />
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origin">Asal Daerah</Label>
                      <Input
                        id="origin"
                        value={formData.metadata.origin}
                        onChange={(e) => handleInputChange('metadata.origin', e.target.value)}
                        placeholder="Asal daerah warisan budaya"
                      />
                    </div>

                    <div>
                      <Label htmlFor="period">Periode/Era</Label>
                      <Input
                        id="period"
                        value={formData.metadata.period}
                        onChange={(e) => handleInputChange('metadata.period', e.target.value)}
                        placeholder="Periode atau era"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="significance">Makna/Signifikansi</Label>
                    <Textarea
                      id="significance"
                      value={formData.metadata.significance}
                      onChange={(e) => handleInputChange('metadata.significance', e.target.value)}
                      placeholder="Makna dan signifikansi budaya"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="materials">Bahan-bahan (pisahkan dengan koma)</Label>
                    <Input
                      id="materials"
                      value={formData.metadata.materials.join(', ')}
                      onChange={(e) => handleArrayChange('metadata.materials', e.target.value)}
                      placeholder="Contoh: Kapas, Pewarna alami, Benang"
                    />
                  </div>
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
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="visibility">Visibilitas</Label>
                    <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Warisan Budaya Unggulan</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Warisan Budaya'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin/cultural-heritage')}
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
