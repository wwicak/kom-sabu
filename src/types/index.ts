// Base types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Navigation types
export interface NavigationItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
  children?: NavigationItem[]
}

// Company information types
export interface CompanyInfo {
  name: string
  tagline: string
  description: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  socialMedia: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
}

// Service types
export interface Service extends BaseEntity {
  title: string
  description: string
  icon: string
  features: string[]
  price?: {
    amount: number
    currency: string
    period: string
  }
}

// Team member types
export interface TeamMember extends BaseEntity {
  name: string
  position: string
  bio: string
  image: string
  socialMedia: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

// Testimonial types
export interface Testimonial extends BaseEntity {
  name: string
  position: string
  company: string
  content: string
  rating: number
  image?: string
}

// Contact form types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  consent: boolean
}

export interface ContactFormErrors {
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  consent?: string
  general?: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string>
}

// Security types
export interface SecurityContext {
  csrfToken: string
  sessionId?: string
  userId?: string
}

// Form validation types
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  placeholder?: string
  required?: boolean
  validation?: ValidationRule
  options?: { value: string; label: string }[]
}

// Component props types
export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Layout types
export interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords: string[]
  canonical?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    sans: string
    serif: string
    mono: string
  }
  spacing: Record<string, string>
  breakpoints: Record<string, string>
}

// Analytics types
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: Date
}

// Newsletter types
export interface NewsletterSubscription {
  email: string
  preferences?: {
    marketing: boolean
    updates: boolean
    newsletter: boolean
  }
}

// Blog types (for future expansion)
export interface BlogPost extends BaseEntity {
  title: string
  slug: string
  excerpt: string
  content: string
  author: TeamMember
  tags: string[]
  published: boolean
  publishedAt?: Date
  featuredImage?: string
  readTime: number
}

// Project/Portfolio types (for future expansion)
export interface Project extends BaseEntity {
  title: string
  description: string
  technologies: string[]
  images: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: string
}
