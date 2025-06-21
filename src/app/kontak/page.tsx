'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function KontakPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Pesan Terkirim",
          description: "Terima kasih! Pesan Anda telah berhasil dikirim. Kami akan segera merespons.",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast({
        title: "Gagal Mengirim",
        description: "Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hubungi Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu Anda. Hubungi kami melalui informasi kontak di bawah ini atau kirim pesan langsung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Office */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Kantor Bupati
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Alamat</p>
                  <p className="text-gray-600">
                    Jl. Diponegoro No. 1<br />
                    Seba, Sabu Raijua<br />
                    Nusa Tenggara Timur 85391
                  </p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Telepon
                  </p>
                  <p className="text-gray-600">(0380) 21001</p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </p>
                  <p className="text-gray-600">info@saburajua.go.id</p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Jam Kerja
                  </p>
                  <p className="text-gray-600">
                    Senin - Jumat: 08:00 - 16:00 WITA<br />
                    Sabtu: 08:00 - 12:00 WITA
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Kontak Darurat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Polres Sabu Raijua</p>
                  <p className="text-gray-600">(0380) 21110</p>
                </div>
                <div>
                  <p className="font-medium">RSUD Sabu Raijua</p>
                  <p className="text-gray-600">(0380) 21119</p>
                </div>
                <div>
                  <p className="font-medium">Damkar Sabu Raijua</p>
                  <p className="text-gray-600">(0380) 21113</p>
                </div>
                <div>
                  <p className="font-medium">SAR Sabu Raijua</p>
                  <p className="text-gray-600">(0380) 21115</p>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Media Sosial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-blue-600">@PemkabSabuRaijua</p>
                </div>
                <div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-blue-600">@saburajuakab</p>
                </div>
                <div>
                  <p className="font-medium">Twitter</p>
                  <p className="text-blue-600">@SabuRaijuaKab</p>
                </div>
                <div>
                  <p className="font-medium">YouTube</p>
                  <p className="text-blue-600">Pemkab Sabu Raijua</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Kirim Pesan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap Anda"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subjek *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Subjek pesan Anda"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Catatan:</strong> Pesan Anda akan diproses dalam 1-2 hari kerja.
                    Untuk urusan mendesak, silakan hubungi langsung melalui telepon.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Lokasi Kantor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Peta akan dimuat di sini</p>
                    <p className="text-sm">Koordinat: -10.8833, 121.8333</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
