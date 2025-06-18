'use client'

import { useState } from 'react'
import { SidebarLayout } from '@/components/layout/SidebarLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Image as ImageIcon } from 'lucide-react'

export default function InformasiJabatanPage() {
  const [formData, setFormData] = useState({
    fotoBupati: null as File | null,
    namaBupati: '',
    fotoWakilBupati: null as File | null,
    namaWakilBupati: ''
  })

  const [dragActive, setDragActive] = useState({
    fotoBupati: false,
    fotoWakilBupati: false
  })

  const handleDrag = (e: React.DragEvent, field: 'fotoBupati' | 'fotoWakilBupati') => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [field]: true }))
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleDrop = (e: React.DragEvent, field: 'fotoBupati' | 'fotoWakilBupati') => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [field]: false }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, [field]: file }))
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'fotoBupati' | 'fotoWakilBupati') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, [field]: file }))
      }
    }
  }

  const handleInputChange = (field: 'namaBupati' | 'namaWakilBupati', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form data:', formData)
    alert('Data berhasil disimpan!')
  }

  const FileUploadArea = ({ 
    field, 
    label, 
    file 
  }: { 
    field: 'fotoBupati' | 'fotoWakilBupati'
    label: string
    file: File | null 
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive[field] ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}
          ${file ? 'border-green-400 bg-green-50' : ''}
          hover:border-yellow-400 hover:bg-yellow-50
        `}
        onDragEnter={(e) => handleDrag(e, field)}
        onDragLeave={(e) => handleDrag(e, field)}
        onDragOver={(e) => handleDrag(e, field)}
        onDrop={(e) => handleDrop(e, field)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, field)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {file ? (
              <ImageIcon className="h-6 w-6 text-green-600" />
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </div>
          
          {file ? (
            <div>
              <p className="text-sm font-medium text-green-600">File terpilih: {file.name}</p>
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
  )

  return (
    <SidebarLayout title="Informasi Jabatan">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Foto Bupati Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <FileUploadArea
                  field="fotoBupati"
                  label="Foto Bupati"
                  file={formData.fotoBupati}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="namaBupati" className="text-sm font-medium text-gray-700">
                    Nama Bupati
                  </Label>
                  <Input
                    id="namaBupati"
                    type="text"
                    placeholder="Masukkan Nama Bupati"
                    value={formData.namaBupati}
                    onChange={(e) => handleInputChange('namaBupati', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Foto Wakil Bupati Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <FileUploadArea
                  field="fotoWakilBupati"
                  label="Foto Wakil Bupati"
                  file={formData.fotoWakilBupati}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="namaWakilBupati" className="text-sm font-medium text-gray-700">
                    Nama Wakil Bupati
                  </Label>
                  <Input
                    id="namaWakilBupati"
                    type="text"
                    placeholder="Masukkan Nama Wakil Bupati"
                    value={formData.namaWakilBupati}
                    onChange={(e) => handleInputChange('namaWakilBupati', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-600 px-8"
              >
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Current Information Display */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Saat Ini</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Bupati */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900">Bupati</h4>
              <p className="text-sm text-gray-600">Nama akan ditampilkan di sini</p>
            </div>

            {/* Current Wakil Bupati */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900">Wakil Bupati</h4>
              <p className="text-sm text-gray-600">Nama akan ditampilkan di sini</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SidebarLayout>
  )
}
