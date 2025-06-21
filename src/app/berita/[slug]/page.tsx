'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  User,
  Eye,
  Share2,
  ArrowLeft,
  Clock,
  Tag
} from 'lucide-react'

interface NewsArticle {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featuredImage?: {
    url: string
    caption?: string
    alt?: string
  }
  author: {
    fullName: string
    username: string
  }
  publishedAt: string
  statistics: {
    views: number
  }
}

interface RelatedNews {
  _id: string
  title: string
  slug: string
  excerpt: string
  featuredImage?: {
    url: string
    alt?: string
  }
  publishedAt: string
  category: string
}

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<NewsArticle | null>(null)
  const [relatedNews, setRelatedNews] = useState<RelatedNews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${params.slug}`)
        if (!response.ok) {
          throw new Error('News article not found')
        }

        const data = await response.json()
        setNews(data.data.news)
        setRelatedNews(data.data.related || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news article')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchNews()
    }
  }, [params.slug])

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

  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
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

  if (error || !news) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Artikel yang Anda cari tidak dapat ditemukan.'}</p>
            <Button onClick={() => router.push('/berita')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Berita
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/berita')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Berita
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Featured Image */}
              {news.featuredImage?.url && (
                <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={news.featuredImage.url}
                    alt={news.featuredImage.alt || news.title}
                    fill
                    className="object-cover"
                  />
                  {news.featuredImage.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                      {news.featuredImage.caption}
                    </div>
                  )}
                </div>
              )}

              {/* Article Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{news.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {formatViews(news.statistics.views)} views
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {news.title}
                </h1>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {news.author.fullName}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(news.publishedAt)}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {news.excerpt}
                </p>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

              {/* Tags */}
              {news.tags.length > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related News */}
            {relatedNews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Berita Terkait</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedNews.map((related) => (
                      <div
                        key={related._id}
                        className="border-b last:border-b-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => router.push(`/berita/${related.slug}`)}
                      >
                        <h4 className="font-medium text-sm mb-2 line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(related.publishedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
