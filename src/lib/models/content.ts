import mongoose from 'mongoose'

// Official/Pejabat Schema
const officialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  level: {
    type: String,
    required: true,
    enum: ['kabupaten', 'kecamatan', 'dinas', 'badan', 'sekretariat']
  },
  category: {
    type: String,
    required: true,
    enum: ['pimpinan', 'kepala_dinas', 'camat', 'sekretaris', 'staff']
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  period: {
    start: Date,
    end: Date
  },
  education: {
    type: String,
    trim: true
  },
  experience: [String],
  achievements: [String],
  vision: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  contact: {
    phone: String,
    email: String,
    office: String
  },
  photo: {
    url: String,
    alt: String
  },
  biography: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  order: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'retired'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// News/Berita Schema
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['pemerintahan', 'pembangunan', 'sosial', 'ekonomi', 'budaya', 'pariwisata', 'pendidikan', 'kesehatan', 'lingkungan', 'olahraga']
  },
  tags: [String],
  featuredImage: {
    url: String,
    caption: String,
    alt: String
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Page Content Schema (for static pages like Profil, Sejarah, etc.)
const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['profile', 'history', 'vision_mission', 'structure', 'service', 'about', 'contact', 'custom']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  sections: [{
    title: String,
    content: String,
    order: Number,
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'gallery', 'table', 'list', 'quote']
    }
  }],
  metadata: {
    description: String,
    keywords: [String],
    lastReviewed: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    order: Number
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['administrasi', 'perizinan', 'sosial', 'kesehatan', 'pendidikan', 'ekonomi', 'infrastruktur', 'lingkungan']
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  requirements: [String],
  procedures: [{
    step: Number,
    description: String,
    duration: String,
    cost: String
  }],
  documents: [String],
  fees: [{
    type: String,
    amount: String,
    description: String
  }],
  duration: {
    type: String,
    required: true
  },
  contact: {
    phone: String,
    email: String,
    address: String,
    hours: String
  },
  onlineService: {
    available: {
      type: Boolean,
      default: false
    },
    url: String,
    description: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['kegiatan', 'infrastruktur', 'wisata', 'budaya', 'pejabat', 'acara', 'pembangunan']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    alt: String,
    order: Number,
    photographer: String,
    dateTaken: Date
  }],
  tags: [String],
  location: {
    district: String,
    village: String,
    address: String
  },
  eventDate: Date,
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Add indexes for better performance
officialSchema.index({ level: 1, category: 1, status: 1 })
officialSchema.index({ department: 1 })
officialSchema.index({ order: 1 })

newsSchema.index({ slug: 1 })
newsSchema.index({ category: 1, status: 1 })
newsSchema.index({ publishedAt: -1 })
newsSchema.index({ featured: 1, status: 1 })
newsSchema.index({ title: 'text', content: 'text' })

pageSchema.index({ slug: 1 })
pageSchema.index({ type: 1, status: 1 })

serviceSchema.index({ slug: 1 })
serviceSchema.index({ category: 1, status: 1 })
serviceSchema.index({ department: 1 })

gallerySchema.index({ category: 1, status: 1 })
gallerySchema.index({ featured: 1, status: 1 })
gallerySchema.index({ eventDate: -1 })

// Export models
export const Official = mongoose.models.Official || mongoose.model('Official', officialSchema)
export const News = mongoose.models.News || mongoose.model('News', newsSchema)
export const Page = mongoose.models.Page || mongoose.model('Page', pageSchema)
export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema)
export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema)
