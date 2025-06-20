'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewOfficialPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    level: '',
    category: '',
    department: '',
    education: '',
    vision: '',
    biography: '',
    phone: '',
    email: '',
    office: '',
    periodStart: '',
    periodEnd: '',
    experience: [''],
    achievements: [''],
    status: 'active',
    featured: false,
    order: 0
  })

  const levels = [
    { value: 'kabupaten', label: 'Kabupaten' },
    { value: 'kecamatan', label: 'Kecamatan' },
    { value: 'dinas', label: 'Dinas' },
    { value: 'badan', label: 'Badan' },
    { value: 'sekretariat', label: 'Sekretariat' }
  ]

  const categories = [
    { value: 'pimpinan', label: 'Pimpinan' },
    { value: 'kepala_dinas', label: 'Kepala Dinas' },
    { value: 'camat', label: 'Camat' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'staff', label: 'Staff' }
  ]

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'experience' | 'achievements', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'experience' | 'achievements') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'experience' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.position || !formData.level || !formData.category || !formData.department) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      // Prepare data for submission
      const submitData = {
        ...formData,
        period: formData.periodStart ? {
          start: formData.periodStart,
          end: formData.periodEnd || undefined
        } : undefined,
        contact: {
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          office: formData.office || undefined
        },
        experience: formData.experience.filter(exp => exp.trim() !== ''),
        achievements: formData.achievements.filter(ach => ach.trim() !== '')
      }

      const response = await fetch('/api/admin/officials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Official created successfully'
        })
        router.push('/admin/officials')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create official',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Create official error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create official',
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
            <h1 className="text-3xl font-bold text-gray-900">Tambah Pejabat Baru</h1>
            <p className="text-gray-600">Create a new government official profile</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Jabatan *</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="Masukkan jabatan"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="level">Level *</Label>
                      <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="order">Urutan</Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="department">Departemen/Instansi *</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Masukkan nama departemen/instansi"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="periodStart">Periode Mulai</Label>
                      <Input
                        id="periodStart"
                        type="date"
                        value={formData.periodStart}
                        onChange={(e) => handleInputChange('periodStart', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="periodEnd">Periode Berakhir</Label>
                      <Input
                        id="periodEnd"
                        type="date"
                        value={formData.periodEnd}
                        onChange={(e) => handleInputChange('periodEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telepon</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(0380) 21001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@saburajua.go.id"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="office">Alamat Kantor</Label>
                    <Input
                      id="office"
                      value={formData.office}
                      onChange={(e) => handleInputChange('office', e.target.value)}
                      placeholder="Alamat kantor"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
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
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured">Featured Official</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informasi Tambahan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="education">Pendidikan</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      placeholder="S1 Administrasi Negara"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vision">Visi</Label>
                    <Textarea
                      id="vision"
                      value={formData.vision}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      placeholder="Visi dan misi pejabat"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="biography">Biografi</Label>
                    <Textarea
                      id="biography"
                      value={formData.biography}
                      onChange={(e) => handleInputChange('biography', e.target.value)}
                      placeholder="Biografi singkat"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Simpan Pejabat'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
