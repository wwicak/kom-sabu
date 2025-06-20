'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Crown,
  Shield,
  Briefcase,
  Users,
  Phone,
  Mail,
  Calendar,
  Award,
  GraduationCap,
  MapPin
} from 'lucide-react'

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
  education?: string
  experience: string[]
  achievements: string[]
  vision?: string
  contact?: {
    phone?: string
    email?: string
    office?: string
  }
  photo?: {
    url?: string
    alt?: string
  }
  biography?: string
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  order: number
  status: string
  featured: boolean
}

export default function PejabatPage() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchOfficials()
  }, [])

  const fetchOfficials = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/officials', {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setOfficials(data.data)
      } else {
        console.warn('API returned success: false, using fallback data')
        // Use static data as fallback
        setOfficials([])
      }
    } catch (error) {
      console.error('Failed to fetch officials:', error)
      // Use static data as fallback when API fails
      setOfficials([])
    } finally {
      setLoading(false)
    }
  }

  // Filter officials based on selection
  const filteredOfficials = officials.filter(official => {
    const matchesLevel = selectedLevel === 'all' || official.level === selectedLevel
    const matchesCategory = selectedCategory === 'all' || official.category === selectedCategory
    return matchesLevel && matchesCategory
  })

  // Group officials by level and category
  const groupedOfficials = filteredOfficials.reduce((acc: any, official) => {
    const key = `${official.level}_${official.category}`
    if (!acc[key]) {
      acc[key] = {
        level: official.level,
        category: official.category,
        officials: []
      }
    }
    acc[key].officials.push(official)
    return acc
  }, {})

  // Get main officials (pimpinan level) - use CMS data or fallback to static
  const mainOfficials = officials.length > 0
    ? officials.filter(official =>
      official.level === 'kabupaten' && official.category === 'pimpinan'
    ).sort((a, b) => a.order - b.order)
    : [] // Will show static data in the component when CMS data is not available

  const departmentHeads = [
    {
      name: 'Drs. Yosef Haning, M.Pd',
      position: 'Kepala Dinas Pendidikan dan Kebudayaan',
      education: 'S2 Pendidikan',
      phone: '(0380) 21010'
    },
    {
      name: 'dr. Maria Goreti Bria, M.Kes',
      position: 'Kepala Dinas Kesehatan',
      education: 'S2 Kesehatan Masyarakat',
      phone: '(0380) 21011'
    },
    {
      name: 'Ir. Yohanes Seran, M.T',
      position: 'Kepala Dinas PU dan Penataan Ruang',
      education: 'S2 Teknik Sipil',
      phone: '(0380) 21012'
    },
    {
      name: 'Dra. Yustina Haning, M.Si',
      position: 'Kepala Dinas Sosial',
      education: 'S2 Administrasi Publik',
      phone: '(0380) 21013'
    },
    {
      name: 'Drs. Kornelius Rihi, M.Par',
      position: 'Kepala Dinas Pariwisata dan Ekonomi Kreatif',
      education: 'S2 Pariwisata',
      phone: '(0380) 21014'
    },
    {
      name: 'SE. Maria Fatima Rihi, M.Si',
      position: 'Kepala Bappeda',
      education: 'S2 Perencanaan Pembangunan',
      phone: '(0380) 21015'
    }
  ]

  const districtHeads = [
    {
      name: 'Drs. Yohanes Manu',
      district: 'Sabu Barat',
      period: '2020-2025',
      phone: '(0380) 21020'
    },
    {
      name: 'Kornelius Haning, S.Sos',
      district: 'Sabu Tengah',
      period: '2021-2026',
      phone: '(0380) 21021'
    },
    {
      name: 'Dra. Maria Seran',
      district: 'Sabu Timur',
      period: '2019-2024',
      phone: '(0380) 21022'
    },
    {
      name: 'Yosef Rihi, S.AP',
      district: 'Raijua',
      period: '2020-2025',
      phone: '(0380) 21023'
    },
    {
      name: 'Drs. Marthen Kale',
      district: 'Sabu Liae',
      period: '2021-2026',
      phone: '(0380) 21024'
    },
    {
      name: 'Maria Haning, S.Sos',
      district: 'Hawu Mehara',
      period: '2020-2025',
      phone: '(0380) 21025'
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pejabat Kabupaten Sabu Raijua
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Profil lengkap pejabat dan pimpinan di lingkungan Pemerintah Kabupaten Sabu Raijua
          </p>
        </div>

        {/* Main Officials */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pimpinan Daerah
          </h2>
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-200 p-6 h-48"></div>
                    <div className="md:w-2/3 p-6">
                      <div className="w-3/4 h-8 bg-gray-200 rounded mb-4"></div>
                      <div className="w-1/2 h-4 bg-gray-200 rounded mb-6"></div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="w-full h-4 bg-gray-200 rounded"></div>
                          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-4 bg-gray-200 rounded"></div>
                          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : mainOfficials.length === 0 ? (
            <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Data Pejabat Harus Dikelola via CMS
                </h3>
                <p className="text-yellow-700 mb-4">
                  Data pejabat dan pimpinan daerah harus dikelola melalui sistem Content Management System (CMS)
                  untuk memastikan informasi yang akurat dan terkini.
                </p>
                <p className="text-sm text-yellow-600">
                  Silakan hubungi administrator untuk menambahkan data pejabat melalui panel admin CMS.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {mainOfficials.map((official) => {
                const getIcon = (position: string) => {
                  if (position.toLowerCase().includes('bupati') && !position.toLowerCase().includes('wakil')) return Crown
                  if (position.toLowerCase().includes('wakil')) return Shield
                  return Briefcase
                }
                const getColor = (position: string) => {
                  if (position.toLowerCase().includes('bupati') && !position.toLowerCase().includes('wakil')) return 'bg-blue-600'
                  if (position.toLowerCase().includes('wakil')) return 'bg-green-600'
                  return 'bg-purple-600'
                }

                const Icon = getIcon(official.position)
                const color = getColor(official.position)

                return (
                  <Card key={official._id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex flex-col items-center justify-center">
                        {official.photo?.url ? (
                          <img
                            src={official.photo.url}
                            alt={official.photo.alt || official.name}
                            className="w-24 h-24 rounded-full object-cover mb-4"
                          />
                        ) : (
                          <div className={`p-4 ${color} rounded-full mb-4`}>
                            <Icon className="h-12 w-12 text-white" />
                          </div>
                        )}
                        <Badge className={color} variant="default">
                          {official.position}
                        </Badge>
                      </div>

                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              {official.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              {official.period && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Periode: {new Date(official.period.start).getFullYear()}-{new Date(official.period.end).getFullYear()}
                                </div>
                              )}
                              {official.education && (
                                <div className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {official.education}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {official.experience && official.experience.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Pengalaman
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {official.experience.map((exp, idx) => (
                                  <li key={idx}>• {exp}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {official.achievements && official.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Pencapaian
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {official.achievements.map((achievement, idx) => (
                                  <li key={idx}>• {achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {official.vision && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Visi</h4>
                            <p className="text-blue-800 text-sm italic">"{official.vision}"</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          {official.contact?.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              {official.contact.phone}
                            </div>
                          )}
                          {official.contact?.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              {official.contact.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Department Heads */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Kepala Dinas dan Badan
          </h2>

          {/* CMS Notice */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-100 rounded">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">
                  Kelola Data via CMS
                </h3>
                <p className="text-sm text-blue-700">
                  Data kepala dinas dan badan harus dikelola melalui Content Management System untuk informasi yang akurat dan terkini.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentHeads.map((head, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{head.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {head.education}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-900 mb-3">
                    {head.position}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {head.phone}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* District Heads */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Camat Kecamatan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districtHeads.map((head, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{head.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Camat {head.district}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Periode: {head.period}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {head.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak Pejabat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Jam Kerja</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Senin - Kamis: 07:30 - 16:00 WITA</p>
                  <p>Jumat: 07:30 - 16:30 WITA</p>
                  <p>Sabtu - Minggu: Libur</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kontak Umum</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    (0380) 21001 (Sekretariat)
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    info@saburajua.go.id
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
