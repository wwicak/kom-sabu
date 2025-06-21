import mongoose from 'mongoose'

// Cultural Heritage Asset Schema
const culturalAssetSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Kerajinan Tradisional', 'Seni Pertunjukan', 'Bahasa & Sastra', 'Wisata Alam', 'Kuliner', 'Upacara Adat', 'Arsitektur', 'Musik Tradisional']
  },
  type: {
    type: String,
    required: true,
    enum: ['asset', 'tradition', 'destination', 'culinary']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    alt: String,
    order: {
      type: Number,
      default: 0
    }
  }],
  icon: {
    type: String,
    enum: ['Palette', 'Music', 'MapPin', 'Camera', 'Utensils', 'Users', 'Building', 'Heart'],
    default: 'Heart'
  },
  content: {
    type: String,
    trim: true
  },
  metadata: {
    origin: String, // Asal daerah/kecamatan
    period: String, // Periode/era
    significance: String, // Makna/signifikansi
    preservation: String, // Status pelestarian
    practitioners: String, // Pelaku/penjaga tradisi
    materials: [String], // Bahan-bahan yang digunakan
    techniques: [String], // Teknik/cara pembuatan
    occasions: [String], // Acara/kesempatan penggunaan
    relatedAssets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CulturalAsset'
    }]
  },
  location: {
    district: {
      type: String,
      enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
    },
    village: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  status: {
    type: String,
    enum: ['active', 'endangered', 'extinct', 'reviving'],
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
  visibility: {
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'draft'
  },
  tags: [String],
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

// Traditional Practice Schema
const traditionalPracticeSchema = new mongoose.Schema({
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
    maxlength: 500
  },
  fullDescription: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ritual', 'ceremony', 'dance', 'music', 'craft', 'belief', 'custom', 'festival']
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    order: Number
  }],
  details: {
    participants: String, // Siapa yang terlibat
    timing: String, // Kapan dilakukan
    location: String, // Dimana dilakukan
    materials: [String], // Bahan/alat yang digunakan
    steps: [String], // Langkah-langkah
    significance: String, // Makna dan signifikansi
    variations: [String] // Variasi regional
  },
  preservation: {
    status: {
      type: String,
      enum: ['well-preserved', 'declining', 'endangered', 'extinct', 'reviving'],
      default: 'well-preserved'
    },
    threats: [String], // Ancaman terhadap kelestarian
    efforts: [String], // Upaya pelestarian
    supporters: [String] // Pihak yang mendukung pelestarian
  },
  district: {
    type: String,
    enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'draft'
  },
  tags: [String],
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

// Homepage Content Schema for managing dynamic content
const homepageContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['hero', 'cultural_heritage', 'tourism_highlights', 'statistics', 'news_highlights', 'services_highlights']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: String,
  content: String,
  data: mongoose.Schema.Types.Mixed, // Flexible data structure for different sections
  images: [{
    url: String,
    caption: String,
    alt: String,
    order: Number
  }],
  settings: {
    enabled: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    layout: String, // Layout variant
    theme: String // Color theme
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Add indexes for better performance
culturalAssetSchema.index({ category: 1, type: 1, visibility: 1 })
culturalAssetSchema.index({ featured: 1, visibility: 1 })
culturalAssetSchema.index({ 'location.district': 1 })
culturalAssetSchema.index({ order: 1 })
culturalAssetSchema.index({ title: 'text', description: 'text', content: 'text' })

traditionalPracticeSchema.index({ category: 1, visibility: 1 })
traditionalPracticeSchema.index({ featured: 1, visibility: 1 })
traditionalPracticeSchema.index({ district: 1 })
traditionalPracticeSchema.index({ order: 1 })
traditionalPracticeSchema.index({ name: 'text', description: 'text' })

homepageContentSchema.index({ section: 1 })
homepageContentSchema.index({ 'settings.enabled': 1, 'settings.order': 1 })

// Export models
export const CulturalAsset = mongoose.models.CulturalAsset || mongoose.model('CulturalAsset', culturalAssetSchema)
export const TraditionalPractice = mongoose.models.TraditionalPractice || mongoose.model('TraditionalPractice', traditionalPracticeSchema)
export const HomepageContent = mongoose.models.HomepageContent || mongoose.model('HomepageContent', homepageContentSchema)
