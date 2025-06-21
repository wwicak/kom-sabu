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
import { ArrowLeft, Building, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FormData {
  name: string
  description: string
  category: string
  department: string
  requirements: string[]
  procedures: Array<{
    step: number
    description: string
    duration?: string
    cost?: string
  }>
  documents: string[]
  fees: Array<{
    type: string
    amount: string
    description?: string
  }>
  duration: string
  contact: {
    phone?: string
    email?: string
    address?: string
    hours?: string
  }
  onlineService: {
    available: boolean
    url?: string
    description?: string
  }
  status: string
  featured: boolean
  order: number
}

export default function NewServicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    department: '',
    requirements: [],
    procedures: [],
    documents: [],
    fees: [],
    duration: '',
    contact: {
      phone: '',
      email: '',
      address: '',
      hours: ''
    },
    onlineService: {
      available: false,
      url: '',
      description: ''
    },
    status: 'active',
    featured: false,
    order: 0
  })

  const categories = [
    { value: 'administrasi', label: 'Administrasi' },
    { value: 'perizinan', label: 'Perizinan' },
    { value: 'sosial', label: 'Sosial' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'ekonomi', label: 'Ekonomi' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'lingkungan', label: 'Lingkungan' }
  ]

  const handleInputChange = (field: string, value: string | boolean | number | string[]) => {
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
    const items = value.split('\n').map(item => item.trim()).filter(item => item.length > 0)
    handleInputChange(field, items)
  }

  const addProcedure = () => {
    const newProcedure = {
      step: formData.procedures.length + 1,
      description: '',
      duration: '',
      cost: ''
    }
    setFormData(prev => ({
      ...prev,
      procedures: [...prev.procedures, newProcedure]
    }))
  }

  const removeProcedure = (index: number) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.filter((_, i) => i !== index)
    }))
  }

  const updateProcedure = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.map((proc, i) =>
        i === index ? { ...proc, [field]: value } : proc
      )
    }))
  }

  const addFee = () => {
    const newFee = {
      type: '',
      amount: '',
      description: ''
    }
    setFormData(prev => ({
      ...prev,
      fees: [...prev.fees, newFee]
    }))
  }

  const removeFee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index)
    }))
  }

  const updateFee = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fees: prev.fees.map((fee, i) =>
        i === index ? { ...fee, [field]: value } : fee
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category || !formData.department || !formData.duration) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create service')
      }

      toast({
        title: 'Success',
        description: 'Service created successfully',
      })

      router.push('/admin/services')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create service'
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
            <h1 className="text-3xl font-bold text-gray-900">Tambah Layanan Publik</h1>
            <p className="text-gray-600">Create a new public service</p>
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
                    <Label htmlFor="name">Nama Layanan *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Masukkan nama layanan"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Deskripsi layanan"
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
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="department">Dinas/Instansi *</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        placeholder="Nama dinas atau instansi"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Durasi Pelayanan *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Contoh: 3 hari kerja"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Persyaratan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="requirements">Persyaratan (satu per baris)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements.join('\n')}
                      onChange={(e) => handleArrayChange('requirements', e.target.value)}
                      placeholder="Masukkan persyaratan, satu per baris"
                      rows={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Procedures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Prosedur Pelayanan
                    <Button type="button" onClick={addProcedure} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Langkah
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.procedures.map((procedure, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Langkah {index + 1}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeProcedure(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={procedure.description}
                          onChange={(e) => updateProcedure(index, 'description', e.target.value)}
                          placeholder="Deskripsi langkah"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Durasi</Label>
                          <Input
                            value={procedure.duration || ''}
                            onChange={(e) => updateProcedure(index, 'duration', e.target.value)}
                            placeholder="Contoh: 1 hari"
                          />
                        </div>
                        <div>
                          <Label>Biaya</Label>
                          <Input
                            value={procedure.cost || ''}
                            onChange={(e) => updateProcedure(index, 'cost', e.target.value)}
                            placeholder="Contoh: Gratis"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Layanan Unggulan</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="onlineAvailable"
                      checked={formData.onlineService.available}
                      onCheckedChange={(checked) => handleInputChange('onlineService.available', checked)}
                    />
                    <Label htmlFor="onlineAvailable">Layanan Online</Label>
                  </div>

                  {formData.onlineService.available && (
                    <div>
                      <Label htmlFor="onlineUrl">URL Layanan Online</Label>
                      <Input
                        id="onlineUrl"
                        value={formData.onlineService.url || ''}
                        onChange={(e) => handleInputChange('onlineService.url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan Layanan'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/admin/services')}
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
