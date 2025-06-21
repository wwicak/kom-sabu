'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  FileText,
  MapPin,
  BarChart3,
  Calendar,
  Shield,
  Database,
  Plus,
  Settings,
  Eye,
  Activity,
  TrendingUp
} from 'lucide-react'

interface DashboardStats {
  destinations: number
  officials: number
  villages: number
  pages: number
  gallery: number
  totalViews: number
  recentActivity: Array<{
    type: string
    title: string
    date: string
    status: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/profile', {
          credentials: 'include'
        })
        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        const userData = await response.json()
        // Check if user has admin role
        if (!userData.data || !['admin', 'super_admin'].includes(userData.data.role)) {
          router.push('/admin/login')
          return
        }

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/admin/dashboard/stats', {
          credentials: 'include'
        })
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  const quickActions = [
    { name: 'Kelola Destinasi', href: '/admin/destinations', icon: MapPin, color: 'bg-blue-500' },
    { name: 'Kelola Pejabat', href: '/admin/officials', icon: Users, color: 'bg-green-500' },
    { name: 'Kelola Layanan Publik', href: '/admin/services', icon: FileText, color: 'bg-indigo-500' },
    { name: 'Kelola Warisan Budaya', href: '/admin/cultural-heritage', icon: Shield, color: 'bg-purple-500' },
    { name: 'Pesan Kontak', href: '/admin/contacts', icon: Database, color: 'bg-yellow-500' },
    { name: 'Tambah Pejabat', href: '/admin/officials/new', icon: Users, color: 'bg-emerald-500' },
    { name: 'Lihat Website', href: '/', icon: FileText, color: 'bg-orange-500' },
    { name: 'Peta Kecamatan', href: '/peta-kecamatan', icon: MapPin, color: 'bg-gray-500' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Main Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to Sabu Raijua Government Admin Panel</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Destinations</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.destinations || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Tourism destinations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Officials</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.officials || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Government officials</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Villages</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.villages || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Village profiles</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalViews?.toLocaleString() || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Page views</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Chart */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Credits Usage Last Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization would go here</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">149,758</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start h-12" variant="outline" asChild>
                <a href="/admin/destinations/new">
                  <MapPin className="h-4 w-4 mr-3" />
                  Add New Destination
                </a>
              </Button>
              <Button className="w-full justify-start h-12" variant="outline" asChild>
                <a href="/admin/officials/new">
                  <Users className="h-4 w-4 mr-3" />
                  Add New Official
                </a>
              </Button>
              <Button className="w-full justify-start h-12" variant="outline" asChild>
                <a href="/admin/villages/new">
                  <MapPin className="h-4 w-4 mr-3" />
                  Add New Village
                </a>
              </Button>
              <Button className="w-full justify-start h-12" variant="outline" asChild>
                <a href="/admin/gallery/new">
                  <FileText className="h-4 w-4 mr-3" />
                  Upload to Gallery
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">EMAIL ADDRESS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">PROVIDER</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CREATED</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">LAST SIGN IN</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">USER UID</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map((activity, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-25">
                        <td className="py-4 px-4 text-sm text-gray-900">{activity.title}</td>
                        <td className="py-4 px-4 text-sm text-gray-600 capitalize">{activity.type}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{activity.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{activity.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">f3f42fc419-ce32-49fc-9cdf...</td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            <span className="text-gray-400">...</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
