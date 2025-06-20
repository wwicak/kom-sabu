import mongoose from 'mongoose'

// Event Schema for cultural events, festivals, and tourism events
const eventSchema = new mongoose.Schema({
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
    enum: ['Festival', 'Budaya', 'Pariwisata', 'Olahraga', 'Pendidikan', 'Kesehatan', 'Ekonomi', 'Pemerintahan']
  },
  type: {
    type: String,
    required: true,
    enum: ['Tahunan', 'Bulanan', 'Mingguan', 'Sekali', 'Berkala']
  },
  dates: {
    start: {
      type: Date,
      required: true
    },
    end: Date,
    isMultiDay: {
      type: Boolean,
      default: false
    },
    recurring: {
      isRecurring: {
        type: Boolean,
        default: false
      },
      pattern: {
        type: String,
        enum: ['yearly', 'monthly', 'weekly', 'custom']
      },
      interval: Number, // every X years/months/weeks
      customDates: [Date]
    }
  },
  time: {
    start: String,
    end: String,
    timezone: {
      type: String,
      default: 'WITA'
    }
  },
  location: {
    name: {
      type: String,
      required: true
    },
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
    },
    venue: {
      type: String,
      enum: ['Indoor', 'Outdoor', 'Hybrid']
    }
  },
  organizer: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Pemerintah', 'Swasta', 'Komunitas', 'NGO', 'Gabungan']
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
    }
  },
  participants: {
    capacity: Number,
    registered: {
      type: Number,
      default: 0
    },
    targetAudience: [String],
    ageRestriction: {
      min: Number,
      max: Number
    },
    requirements: [String]
  },
  program: [{
    time: String,
    activity: String,
    description: String,
    performer: String,
    location: String
  }],
  activities: [String],
  highlights: [String],
  culturalElements: {
    traditions: [String],
    performances: [String],
    crafts: [String],
    food: [String],
    music: [String],
    dance: [String]
  },
  pricing: {
    isFree: {
      type: Boolean,
      default: true
    },
    tickets: [{
      type: String, // VIP, Regular, Student, etc.
      price: Number,
      currency: {
        type: String,
        default: 'IDR'
      },
      description: String,
      available: Number,
      sold: {
        type: Number,
        default: 0
      }
    }],
    notes: String
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['poster', 'gallery', 'performer', 'venue', 'previous']
    }
  }],
  media: {
    videos: [{
      url: String,
      title: String,
      description: String,
      platform: String // YouTube, Vimeo, etc.
    }],
    livestream: {
      url: String,
      platform: String,
      isLive: {
        type: Boolean,
        default: false
      }
    }
  },
  sponsors: [{
    name: String,
    logo: String,
    website: String,
    level: {
      type: String,
      enum: ['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner']
    }
  }],
  requirements: {
    equipment: [String],
    permits: [String],
    safety: [String],
    weather: [String]
  },
  statistics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    attendees: {
      expected: Number,
      actual: Number
    },
    feedback: {
      rating: Number,
      comments: Number
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'postponed', 'completed'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationDeadline: Date,
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
eventSchema.index({ slug: 1 })
eventSchema.index({ category: 1, status: 1 })
eventSchema.index({ 'dates.start': 1, 'dates.end': 1 })
eventSchema.index({ 'location.district': 1 })
eventSchema.index({ featured: 1, status: 1 })
eventSchema.index({ title: 'text', description: 'text' })

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function() {
  const now = new Date()
  const start = this.dates.start
  const end = this.dates.end || start
  
  if (now < start) return 'upcoming'
  if (now >= start && now <= end) return 'ongoing'
  return 'past'
})

// Virtual for days until event
eventSchema.virtual('daysUntil').get(function() {
  const now = new Date()
  const start = this.dates.start
  const diffTime = start.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
})

// Export model
export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)
