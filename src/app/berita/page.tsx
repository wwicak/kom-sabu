'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Calendar,
  User,
  Search,
  Clock,
  TrendingUp,
  Newspaper,
  Eye,
  Share2
} from 'lucide-react'

interface NewsArticle {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage?: {
    url: string
    alt?: string
  }
  author: {
    fullName: string
    username: string
  }
  publishedAt: string
  featured: boolean
  statistics: {
    views: number
  }
}

const CATEGORIES = ['Semua', 'pemerintahan', 'pembangunan', 'sosial', 'ekonomi', 'budaya', 'pariwisata', 'pendidikan', 'kesehatan', 'lingkungan', 'olahraga']

export default function BeritaPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [selectedCategory, searchTerm])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (selectedCategory !== 'Semua') {
        params.append('category', selectedCategory)
      }

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      params.append('limit', '20')
      params.append('sort', 'newest')

      const response = await fetch(`/api/news?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()
      if (data.success) {
        setNewsData(data.data.news)
      } else {
        throw new Error(data.error || 'Failed to fetch news')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news')
    } finally {
      setLoading(false)
    }
  }

  const featuredNews = newsData.filter(news => news.featured)
  const regularNews = newsData.filter(news => !news.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViews = (views: number) => {
    return new Intl.NumberFormat('id-ID').format(views)
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Berita Terkini</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchNews}>Coba Lagi</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Berita Terkini</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Informasi terbaru seputar pemerintahan, pembangunan, dan kegiatan masyarakat
            di Kabupaten Sabu Raijua
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari berita..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'Semua' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Berita Utama</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((news) => (
                <Card key={news._id} className="hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={news.featuredImage?.url || '/images/placeholder-news.jpg'}
                      alt={news.featuredImage?.alt || news.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3E${encodeURIComponent(news.title)}%3C/text%3E%3C/svg%3E`
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white">
                        UTAMA
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{news.category.charAt(0).toUpperCase() + news.category.slice(1)}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatViews(news.statistics.views)}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">
                      {news.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {news.author.fullName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(news.publishedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {news.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/berita/${news.slug}`)}
                      >
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular News */}
        <div>
          <div className="flex items-center mb-6">
            <Newspaper className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Berita Lainnya</h2>
          </div>

          {regularNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((news) => (
                <Card key={news._id} className="hover:shadow-lg transition-shadow">
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    <img
                      src={news.featuredImage?.url || '/images/placeholder-news.jpg'}
                      alt={news.featuredImage?.alt || news.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='160' viewBox='0 0 400 160'%3E%3Crect width='400' height='160' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='%236b7280'%3E${encodeURIComponent(news.title)}%3C/text%3E%3C/svg%3E`
                      }}
                    />
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">{news.category.charAt(0).toUpperCase() + news.category.slice(1)}</Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatViews(news.statistics.views)}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-blue-600 cursor-pointer line-clamp-2">
                      {news.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{news.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {news.author.fullName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(news.publishedAt)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => router.push(`/berita/${news.slug}`)}
                      >
                        Baca
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Tidak ada berita yang ditemukan</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('Semua')
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {regularNews.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Muat Berita Lainnya
            </Button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berlangganan Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Dapatkan berita terbaru langsung di email Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Masukkan email Anda"
                  className="flex-1"
                />
                <Button>
                  Berlangganan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
