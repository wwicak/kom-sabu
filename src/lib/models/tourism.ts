import mongoose from 'mongoose'

// Tourism Destination Schema
const destinationSchema = new mongoose.Schema({
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
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    enum: ['Pantai', 'Bukit', 'Hutan', 'Mata Air', 'Budaya', 'Sejarah', 'Religi', 'Kuliner']
  },
  subcategory: {
    type: String,
    enum: ['Wisata Alam', 'Wisata Budaya', 'Wisata Religi', 'Wisata Kuliner', 'Wisata Sejarah']
  },
  location: {
    district: {
      type: String,
      required: true,
      enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
    },
    village: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  facilities: [String],
  activities: [String],
  highlights: [String],
  accessibility: {
    difficulty: {
      type: String,
      enum: ['Mudah', 'Sedang', 'Sulit'],
      default: 'Mudah'
    },
    duration: String,
    bestTime: String,
    access: String
  },
  pricing: {
    entrance: String,
    parking: String,
    guide: String,
    notes: String
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      youtube: String
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    visitors: {
      annual: Number,
      monthly: Number
    }
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

// Accommodation Schema
const accommodationSchema = new mongoose.Schema({
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
    maxlength: 2000
  },
  type: {
    type: String,
    required: true,
    enum: ['Hotel', 'Homestay', 'Guesthouse', 'Villa', 'Lodge', 'Resort']
  },
  category: {
    type: String,
    required: true,
    enum: ['Budget', 'Mid-range', 'Luxury', 'Backpacker', 'Family', 'Business', 'Eco', 'Cultural']
  },
  location: {
    district: {
      type: String,
      required: true,
      enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
    },
    village: String,
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rooms: {
    total: {
      type: Number,
      required: true,
      min: 1
    },
    types: [{
      name: String,
      count: Number,
      capacity: Number,
      price: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'IDR'
        }
      }
    }]
  },
  pricing: {
    range: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      }
    },
    currency: {
      type: String,
      default: 'IDR'
    },
    notes: String
  },
  facilities: [String],
  services: [String],
  amenities: [String],
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    payment: [String],
    rules: [String]
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: String,
    website: String,
    whatsapp: String,
    socialMedia: {
      instagram: String,
      facebook: String
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    bookings: {
      total: Number,
      monthly: Number
    }
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
  verified: {
    type: Boolean,
    default: false
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

// Culinary Place Schema
const culinarySchema = new mongoose.Schema({
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
    enum: ['Seafood', 'Tradisional', 'Minuman', 'Daging', 'Vegetarian', 'Snack', 'Dessert']
  },
  specialty: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    district: {
      type: String,
      required: true,
      enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
    },
    village: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  pricing: {
    range: String,
    currency: {
      type: String,
      default: 'IDR'
    },
    notes: String
  },
  operatingHours: {
    open: String,
    close: String,
    days: [String],
    notes: String
  },
  highlights: [String],
  menu: [{
    name: String,
    description: String,
    price: Number,
    category: String,
    isSpecialty: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    phone: String,
    whatsapp: String,
    socialMedia: {
      instagram: String,
      facebook: String
    }
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
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

// Add indexes for better performance
// Note: slug fields already have unique: true, no need for manual index
destinationSchema.index({ category: 1, status: 1 })
destinationSchema.index({ 'location.district': 1 })
destinationSchema.index({ featured: 1, status: 1 })

// Note: slug fields already have unique: true, no need for manual index
accommodationSchema.index({ type: 1, status: 1 })
accommodationSchema.index({ 'location.district': 1 })
accommodationSchema.index({ featured: 1, status: 1 })

// Note: slug fields already have unique: true, no need for manual index
culinarySchema.index({ category: 1, status: 1 })
culinarySchema.index({ 'location.district': 1 })

// Export models
export const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema)
export const Accommodation = mongoose.models.Accommodation || mongoose.model('Accommodation', accommodationSchema)
export const Culinary = mongoose.models.Culinary || mongoose.model('Culinary', culinarySchema)
