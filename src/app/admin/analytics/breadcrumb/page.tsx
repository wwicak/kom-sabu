'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminBreadcrumb } from '@/components/ui/breadcrumb'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  MousePointer, 
  Eye, 
  Users, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  summary: {
    totalViews: number
    totalClicks: number
    clickThroughRate: number
    dateRange: {
      start: string
      end: string
    }
  }
  popularPaths: Array<{
    path: string
    views: number
  }>
  timeSeries: Array<{
    date: string
    views: number
    clicks: number
    clickThroughRate: number
  }>
  userBehavior: Array<{
    sessionId: string
    totalEvents: number
    totalClicks: number
    totalViews: number
    sessionDuration: number
    uniquePagesCount: number
    clickThroughRate: number
  }>
  pagePerformance: Array<{
    page: string
    totalViews: number
    uniqueSessionCount: number
    avgDepth: number
    totalClicks: number
    clickThroughRate: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function BreadcrumbAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [groupBy, setGroupBy] = useState('day')

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (dateRange.start) params.append('start_date', dateRange.start)
      if (dateRange.end) params.append('end_date', dateRange.end)
      params.append('group_by', groupBy)

      const response = await fetch(`/api/analytics/breadcrumb/insights?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const exportData = () => {
    if (!data) return

    const csvContent = [
      ['Date', 'Views', 'Clicks', 'CTR (%)'],
      ...data.timeSeries.map(item => [
        item.date,
        item.views.toString(),
        item.clicks.toString(),
        item.clickThroughRate.toString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `breadcrumb-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading analytics...</span>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <AdminBreadcrumb 
            items={[
              { label: 'Dashboard Admin', href: '/admin' },
              { label: 'Analytics', href: '/admin/analytics' },
              { label: 'Breadcrumb Analytics', current: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Breadcrumb Analytics</h1>
            <p className="text-gray-600">Navigation behavior and user interaction insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={fetchAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="group-by">Group By</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchAnalytics} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.summary.totalViews.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MousePointer className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.summary.totalClicks.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.summary.clickThroughRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Date Range</p>
                      <p className="text-sm font-bold text-gray-900">
                        {data.summary.dateRange.start} to {data.summary.dateRange.end}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Series Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Views and Clicks Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                    <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Popular Paths and Page Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Paths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.popularPaths.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="path" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Page Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.pagePerformance.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{page.page}</p>
                          <p className="text-xs text-gray-600">
                            {page.totalViews} views • {page.totalClicks} clicks
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{page.clickThroughRate}%</p>
                          <p className="text-xs text-gray-600">CTR</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
