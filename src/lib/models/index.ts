import mongoose from 'mongoose'

// Contact Form Schema
const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    validate: {
      validator: (v: string) => /^[a-zA-Z\s'-]+$/.test(v),
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 254,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: (v: string) => !v || /^[\+]?[1-9][\d]{0,15}$/.test(v),
      message: 'Please enter a valid phone number'
    }
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  consent: {
    type: Boolean,
    required: true,
    validate: {
      validator: (v: boolean) => v === true,
      message: 'Consent is required'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied', 'archived'],
    default: 'pending'
  },
  submissionToken: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Gallery Item Schema
const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  category: {
    type: String,
    required: true,
    enum: ['Pemerintahan', 'Pembangunan', 'Sosial', 'Budaya', 'Kesehatan', 'Pendidikan']
  },
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    fileSize: Number,
    dimensions: {
      width: Number,
      height: Number
    },
    format: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// News/Article Schema
const newsSchema = new mongoose.Schema({
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
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: String,
  category: {
    type: String,
    required: true,
    enum: ['Berita', 'Pengumuman', 'Artikel', 'Press Release']
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Agenda Schema
const agendaSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  startTime: String,
  endTime: String,
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  type: {
    type: String,
    required: true,
    enum: ['Rapat', 'Upacara', 'Kunjungan', 'Acara', 'Pelatihan', 'Lainnya']
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  participants: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// User Schema (for admin/staff)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  department: String,
  position: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Note: Kecamatan schema moved to dedicated file src/lib/models/kecamatan.ts

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  resourceId: String,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
})

// Create indexes for better performance (only for non-unique fields)
contactFormSchema.index({ createdAt: -1 })
contactFormSchema.index({ status: 1 })
galleryItemSchema.index({ category: 1, isPublished: 1 })
galleryItemSchema.index({ createdAt: -1 })
// newsSchema slug already has unique: true, no need for manual index
newsSchema.index({ category: 1, isPublished: 1 })
newsSchema.index({ publishedAt: -1 })
agendaSchema.index({ startDate: 1 })
agendaSchema.index({ isPublic: 1, status: 1 })
// userSchema email and username already have unique: true, no need for manual indexes
auditLogSchema.index({ timestamp: -1 })
auditLogSchema.index({ userId: 1 })

// Export models
export const ContactForm = mongoose.models.ContactForm || mongoose.model('ContactForm', contactFormSchema)
export const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema)
export const News = mongoose.models.News || mongoose.model('News', newsSchema)
export const Agenda = mongoose.models.Agenda || mongoose.model('Agenda', agendaSchema)
export const User = mongoose.models.User || mongoose.model('User', userSchema)
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema)

// Export the comprehensive Kecamatan model from the dedicated file
export { Kecamatan } from './kecamatan'
