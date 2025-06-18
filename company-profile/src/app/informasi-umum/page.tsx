'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface GeneralInfo {
  _id?: string
  logo?: string
  address: string
  longitude: string
  latitude: string
  phone: string
  email: string
  instagram: string
  facebook: string
  linkedin: string
}

export default function InformasiUmumPage() {
  const [formData, setFormData] = useState<GeneralInfo>({
    address: '',
    longitude: '',
    latitude: '',
    phone: '',
    email: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  })
  
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const queryClient = useQueryClient()

  // Fetch current general information
  const { data: currentInfo, isLoading } = useQuery({
    queryKey: ['general-info'],
    queryFn: async () => {
      const response = await fetch('/api/general-info')
      if (!response.ok) throw new Error('Failed to fetch general info')
      return response.json()
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        setFormData(data.data)
      }
    }
  })

  // Update general information mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/general-info', {
        method: 'POST',
        body: data
      })
      if (!response.ok) throw new Error('Failed to update general info')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['general-info'] })
    }
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setLogoFile(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setLogoFile(file)
      }
    }
  }

  const handleInputChange = (field: keyof GeneralInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = new FormData()
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== '_id' && value) {
        submitData.append(key, value)
      }
    })
    
    // Add logo file if selected
    if (logoFile) {
      submitData.append('logo', logoFile)
    }
    
    updateMutation.mutate(submitData)
  }

  if (isLoading) {
    return (
      <SidebarLayout title="Informasi Umum">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="Informasi Umum">
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">Logo</Label>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Current Logo Display */}
                <div className="space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {currentInfo?.data?.logo ? (
                      <img
                        src={currentInfo.data.logo}
                        alt="Current Logo"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Upload Logo</Label>
                  <div
                    className={`
                      relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                      ${dragActive ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}
                      ${logoFile ? 'border-green-400 bg-green-50' : ''}
                      hover:border-yellow-400 hover:bg-yellow-50
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="space-y-3">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {logoFile ? (
                          <ImageIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <Upload className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      {logoFile ? (
                        <div>
                          <p className="text-sm font-medium text-green-600">File terpilih: {logoFile.name}</p>
                          <p className="text-xs text-gray-500">Klik atau drag untuk mengganti</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-yellow-600 hover:text-yellow-500 cursor-pointer">
                              Upload a Image
                            </span>
                            {' '}or Drag and Drop
                          </p>
                          <p className="text-xs text-gray-500">Belum ada File.</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400">Maksimum file 300KB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <Label htmlFor="address" className="text-base font-medium text-gray-900">
                Alamat Kantor Bupati
              </Label>
              <Textarea
                id="address"
                placeholder="121 King Street Melbourne, 3000, Australia"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Coordinates Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-base font-medium text-gray-900">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder="Masukkan Longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-base font-medium text-gray-900">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder="Masukkan Latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium text-gray-900">
                  No. Telp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+123 45 6789"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@aistech.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-base font-medium text-gray-900">
                  Link Instagram
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="info@aistech.com"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-base font-medium text-gray-900">
                  Link Facebook
                </Label>
                <Input
                  id="facebook"
                  type="url"
                  placeholder="info@aistech.com"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-base font-medium text-gray-900">
                  Link Linkdin
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="info@aistech.com"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start pt-6">
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="bg-yellow-500 hover:bg-yellow-600 px-8 py-2 min-w-[120px]"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </div>

            {/* Success/Error Messages */}
            {updateMutation.isSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">Informasi berhasil disimpan!</p>
              </div>
            )}

            {updateMutation.isError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Gagal menyimpan informasi. Silakan coba lagi.</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </SidebarLayout>
  )
}
