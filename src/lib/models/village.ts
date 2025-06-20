import mongoose from 'mongoose'

// Village/Desa Schema
const villageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['desa', 'kelurahan']
  },
  district: {
    type: String,
    required: true,
    enum: ['Sabu Barat', 'Sabu Tengah', 'Sabu Timur', 'Raijua', 'Sabu Liae', 'Hawu Mehara']
  },
  districtCode: {
    type: String,
    required: true
  },
  head: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      enum: ['Kepala Desa', 'Lurah']
    },
    period: {
      start: Date,
      end: Date
    },
    contact: {
      phone: String,
      email: String
    }
  },
  demographics: {
    population: {
      total: {
        type: Number,
        required: true,
        min: 0
      },
      male: Number,
      female: Number,
      families: Number
    },
    ageGroups: {
      children: Number, // 0-14
      youth: Number,    // 15-24
      adults: Number,   // 25-64
      elderly: Number   // 65+
    },
    education: {
      noSchool: Number,
      elementary: Number,
      juniorHigh: Number,
      seniorHigh: Number,
      university: Number
    },
    occupation: {
      farmer: Number,
      fisherman: Number,
      trader: Number,
      civilServant: Number,
      private: Number,
      unemployed: Number,
      other: Number
    }
  },
  geography: {
    area: {
      type: Number,
      required: true,
      min: 0
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    boundaries: {
      north: String,
      south: String,
      east: String,
      west: String
    },
    topography: {
      type: String,
      enum: ['Dataran', 'Perbukitan', 'Pantai', 'Campuran']
    },
    altitude: Number
  },
  infrastructure: {
    roads: {
      asphalt: Number,
      gravel: Number,
      dirt: Number,
      total: Number
    },
    utilities: {
      electricity: {
        coverage: Number, // percentage
        households: Number
      },
      water: {
        coverage: Number, // percentage
        households: Number,
        sources: [String] // PDAM, Sumur, Mata Air, etc
      },
      sanitation: {
        coverage: Number,
        households: Number
      }
    },
    communication: {
      cellularCoverage: Number,
      internetAccess: Number
    }
  },
  facilities: {
    education: {
      kindergarten: Number,
      elementary: Number,
      juniorHigh: Number,
      seniorHigh: Number,
      university: Number
    },
    health: {
      puskesmas: Number,
      pustu: Number,
      posyandu: Number,
      clinic: Number,
      hospital: Number
    },
    religious: {
      mosque: Number,
      church: Number,
      temple: Number,
      other: Number
    },
    public: {
      market: Number,
      office: Number,
      hall: Number,
      library: Number,
      sports: Number
    }
  },
  economy: {
    mainSectors: [String],
    agriculture: {
      riceField: Number,
      dryField: Number,
      plantation: Number,
      fishpond: Number
    },
    business: {
      shops: Number,
      restaurants: Number,
      services: Number,
      industry: Number
    },
    income: {
      average: Number,
      median: Number,
      currency: {
        type: String,
        default: 'IDR'
      }
    },
    poverty: {
      rate: Number, // percentage
      families: Number
    }
  },
  tourism: {
    destinations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination'
    }],
    accommodations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation'
    }],
    restaurants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Culinary'
    }],
    attractions: [String],
    events: [String]
  },
  contact: {
    office: {
      address: {
        type: String,
        required: true
      },
      phone: String,
      email: String,
      website: String
    },
    emergencyContacts: [{
      type: String, // Police, Fire, Medical
      name: String,
      phone: String
    }]
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    youtube: String,
    website: String
  },
  images: [{
    url: String,
    caption: String,
    alt: String,
    category: {
      type: String,
      enum: ['office', 'landscape', 'facility', 'event', 'people']
    }
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  history: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  culture: {
    traditions: [String],
    languages: [String],
    festivals: [String],
    crafts: [String]
  },
  achievements: [String],
  challenges: [String],
  developmentPlans: [String],
  lastUpdated: {
    demographics: Date,
    infrastructure: Date,
    facilities: Date,
    economy: Date
  },
  dataSource: {
    type: String,
    default: 'BPS'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'merged'],
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

// Add indexes for better performance
villageSchema.index({ code: 1 })
villageSchema.index({ district: 1 })
villageSchema.index({ type: 1 })
villageSchema.index({ name: 'text', description: 'text' })
villageSchema.index({ featured: 1, status: 1 })

// Virtual for population density
villageSchema.virtual('populationDensity').get(function() {
  if (this.demographics?.population?.total && this.geography?.area) {
    return this.demographics.population.total / this.geography.area
  }
  return 0
})

// Export model
export const Village = mongoose.models.Village || mongoose.model('Village', villageSchema)
