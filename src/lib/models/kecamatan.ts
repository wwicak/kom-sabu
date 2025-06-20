import mongoose, { Schema, Document } from 'mongoose'

// GeoJSON interfaces
export interface GeoJSONPoint {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: number[][][] // Array of linear rings
}

export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon'
  coordinates: number[][][][] // Array of polygons
}

export type GeoJSONGeometry = GeoJSONPoint | GeoJSONPolygon | GeoJSONMultiPolygon

// Demographic data interface
export interface DemographicData {
  totalPopulation: number
  malePopulation: number
  femalePopulation: number
  households: number
  populationDensity: number // per km²
  ageGroups: {
    under15: number
    age15to64: number
    over64: number
  }
  education: {
    noEducation: number
    elementary: number
    juniorHigh: number
    seniorHigh: number
    university: number
  }
  religion: {
    christian: number
    catholic: number
    islam: number
    hindu: number
    buddhist: number
    other: number
  }
  lastUpdated: Date
}

// Economic data interface
export interface EconomicData {
  gdpPerCapita?: number
  mainIndustries: string[]
  employmentRate: number
  unemploymentRate: number
  povertyRate: number
  averageIncome?: number
  economicSectors: {
    agriculture: number // percentage
    industry: number
    services: number
  }
  lastUpdated: Date
}

// Agricultural data interface
export interface AgriculturalData {
  totalAgriculturalArea: number // in hectares
  riceFields: number
  dryFields: number
  plantations: number
  mainCrops: Array<{
    name: string
    area: number // hectares
    production: number // tons per year
    productivity: number // tons per hectare
  }>
  livestock: Array<{
    type: string
    count: number
  }>
  fishery: {
    marineCapture: number // tons per year
    aquaculture: number // tons per year
  }
  lastUpdated: Date
}

// Natural resources interface
export interface NaturalResources {
  minerals: Array<{
    type: string
    reserves?: string
    status: 'explored' | 'exploited' | 'potential'
  }>
  forestArea: number // hectares
  coastalLength?: number // km
  waterResources: Array<{
    type: 'river' | 'lake' | 'spring' | 'reservoir'
    name: string
    capacity?: number // for reservoirs
  }>
  renewableEnergy: Array<{
    type: 'solar' | 'wind' | 'hydro' | 'biomass'
    potential: string
    status: 'developed' | 'planned' | 'potential'
  }>
  lastUpdated: Date
}

// Infrastructure data interface
export interface InfrastructureData {
  roads: {
    totalLength: number // km
    pavedRoads: number // km
    unpavedRoads: number // km
  }
  healthFacilities: {
    hospitals: number
    healthCenters: number
    clinics: number
    doctors: number
    nurses: number
  }
  education: {
    kindergartens: number
    elementarySchools: number
    juniorHighSchools: number
    seniorHighSchools: number
    universities: number
    teachers: number
  }
  utilities: {
    electricityAccess: number // percentage
    cleanWaterAccess: number // percentage
    internetAccess: number // percentage
    wasteManagement: boolean
  }
  lastUpdated: Date
}

// Tourism data interface
export interface TourismData {
  attractions: Array<{
    name: string
    type: 'beach' | 'cultural' | 'historical' | 'natural' | 'religious'
    description: string
    coordinates?: GeoJSONPoint
  }>
  accommodations: {
    hotels: number
    guesthouses: number
    homestays: number
  }
  annualVisitors?: number
  lastUpdated: Date
}

// Main Kecamatan interface
export interface IKecamatan extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  nameEnglish?: string
  code: string // Official BPS code
  regencyCode: string // Parent regency code
  regencyName: string
  provinceCode: string
  provinceName: string
  
  // Geographic data
  geometry: GeoJSONGeometry
  centroid: GeoJSONPoint
  area: number // in km²
  
  // Administrative data
  capital: string // Kecamatan capital/center
  villages: Array<{
    name: string
    type: 'desa' | 'kelurahan'
    population?: number
  }>
  
  // Demographic and economic data
  demographics: DemographicData
  economy: EconomicData
  agriculture: AgriculturalData
  naturalResources: NaturalResources
  infrastructure: InfrastructureData
  tourism: TourismData
  
  // Metadata
  isActive: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
  createdBy: mongoose.Types.ObjectId
  updatedBy: mongoose.Types.ObjectId
}

// Mongoose schemas
const GeoJSONPointSchema = new Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true, validate: [arrayLimit, '{PATH} must have exactly 2 coordinates'] }
})

const GeoJSONPolygonSchema = new Schema({
  type: { type: String, enum: ['Polygon'], required: true },
  coordinates: { type: [[[Number]]], required: true }
})

const GeoJSONMultiPolygonSchema = new Schema({
  type: { type: String, enum: ['MultiPolygon'], required: true },
  coordinates: { type: [[[[Number]]]], required: true }
})

function arrayLimit(val: number[]) {
  return val.length === 2
}

const DemographicDataSchema = new Schema({
  totalPopulation: { type: Number, required: true, min: 0 },
  malePopulation: { type: Number, required: true, min: 0 },
  femalePopulation: { type: Number, required: true, min: 0 },
  households: { type: Number, required: true, min: 0 },
  populationDensity: { type: Number, required: true, min: 0 },
  ageGroups: {
    under15: { type: Number, required: true, min: 0 },
    age15to64: { type: Number, required: true, min: 0 },
    over64: { type: Number, required: true, min: 0 }
  },
  education: {
    noEducation: { type: Number, default: 0, min: 0 },
    elementary: { type: Number, default: 0, min: 0 },
    juniorHigh: { type: Number, default: 0, min: 0 },
    seniorHigh: { type: Number, default: 0, min: 0 },
    university: { type: Number, default: 0, min: 0 }
  },
  religion: {
    christian: { type: Number, default: 0, min: 0 },
    catholic: { type: Number, default: 0, min: 0 },
    islam: { type: Number, default: 0, min: 0 },
    hindu: { type: Number, default: 0, min: 0 },
    buddhist: { type: Number, default: 0, min: 0 },
    other: { type: Number, default: 0, min: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
})

const EconomicDataSchema = new Schema({
  gdpPerCapita: { type: Number, min: 0 },
  mainIndustries: [{ type: String }],
  employmentRate: { type: Number, required: true, min: 0, max: 100 },
  unemploymentRate: { type: Number, required: true, min: 0, max: 100 },
  povertyRate: { type: Number, required: true, min: 0, max: 100 },
  averageIncome: { type: Number, min: 0 },
  economicSectors: {
    agriculture: { type: Number, required: true, min: 0, max: 100 },
    industry: { type: Number, required: true, min: 0, max: 100 },
    services: { type: Number, required: true, min: 0, max: 100 }
  },
  lastUpdated: { type: Date, default: Date.now }
})

const AgriculturalDataSchema = new Schema({
  totalAgriculturalArea: { type: Number, required: true, min: 0 },
  riceFields: { type: Number, default: 0, min: 0 },
  dryFields: { type: Number, default: 0, min: 0 },
  plantations: { type: Number, default: 0, min: 0 },
  mainCrops: [{
    name: { type: String, required: true },
    area: { type: Number, required: true, min: 0 },
    production: { type: Number, required: true, min: 0 },
    productivity: { type: Number, required: true, min: 0 }
  }],
  livestock: [{
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 0 }
  }],
  fishery: {
    marineCapture: { type: Number, default: 0, min: 0 },
    aquaculture: { type: Number, default: 0, min: 0 }
  },
  lastUpdated: { type: Date, default: Date.now }
})

const KecamatanSchema = new Schema<IKecamatan>({
  name: { type: String, required: true, trim: true },
  nameEnglish: { type: String, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  regencyCode: { type: String, required: true, trim: true },
  regencyName: { type: String, required: true, trim: true },
  provinceCode: { type: String, required: true, trim: true },
  provinceName: { type: String, required: true, trim: true },
  
  geometry: {
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(v: any) {
        return v && ['Polygon', 'MultiPolygon'].includes(v.type)
      },
      message: 'Geometry must be a Polygon or MultiPolygon'
    }
  },
  centroid: { type: GeoJSONPointSchema, required: true },
  area: { type: Number, required: true, min: 0 },
  
  capital: { type: String, required: true, trim: true },
  villages: [{
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['desa', 'kelurahan'], required: true },
    population: { type: Number, min: 0 }
  }],
  
  demographics: { type: DemographicDataSchema, required: true },
  economy: { type: EconomicDataSchema, required: true },
  agriculture: { type: AgriculturalDataSchema, required: true },
  naturalResources: {
    minerals: [{
      type: { type: String, required: true },
      reserves: String,
      status: { type: String, enum: ['explored', 'exploited', 'potential'], required: true }
    }],
    forestArea: { type: Number, default: 0, min: 0 },
    coastalLength: { type: Number, min: 0 },
    waterResources: [{
      type: { type: String, enum: ['river', 'lake', 'spring', 'reservoir'], required: true },
      name: { type: String, required: true },
      capacity: Number
    }],
    renewableEnergy: [{
      type: { type: String, enum: ['solar', 'wind', 'hydro', 'biomass'], required: true },
      potential: { type: String, required: true },
      status: { type: String, enum: ['developed', 'planned', 'potential'], required: true }
    }],
    lastUpdated: { type: Date, default: Date.now }
  },
  infrastructure: {
    roads: {
      totalLength: { type: Number, default: 0, min: 0 },
      pavedRoads: { type: Number, default: 0, min: 0 },
      unpavedRoads: { type: Number, default: 0, min: 0 }
    },
    healthFacilities: {
      hospitals: { type: Number, default: 0, min: 0 },
      healthCenters: { type: Number, default: 0, min: 0 },
      clinics: { type: Number, default: 0, min: 0 },
      doctors: { type: Number, default: 0, min: 0 },
      nurses: { type: Number, default: 0, min: 0 }
    },
    education: {
      kindergartens: { type: Number, default: 0, min: 0 },
      elementarySchools: { type: Number, default: 0, min: 0 },
      juniorHighSchools: { type: Number, default: 0, min: 0 },
      seniorHighSchools: { type: Number, default: 0, min: 0 },
      universities: { type: Number, default: 0, min: 0 },
      teachers: { type: Number, default: 0, min: 0 }
    },
    utilities: {
      electricityAccess: { type: Number, default: 0, min: 0, max: 100 },
      cleanWaterAccess: { type: Number, default: 0, min: 0, max: 100 },
      internetAccess: { type: Number, default: 0, min: 0, max: 100 },
      wasteManagement: { type: Boolean, default: false }
    },
    lastUpdated: { type: Date, default: Date.now }
  },
  tourism: {
    attractions: [{
      name: { type: String, required: true },
      type: { type: String, enum: ['beach', 'cultural', 'historical', 'natural', 'religious'], required: true },
      description: { type: String, required: true },
      coordinates: GeoJSONPointSchema
    }],
    accommodations: {
      hotels: { type: Number, default: 0, min: 0 },
      guesthouses: { type: Number, default: 0, min: 0 },
      homestays: { type: Number, default: 0, min: 0 }
    },
    annualVisitors: { type: Number, min: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  collection: 'kecamatan'
})

// Indexes for better performance
// Note: code field already has unique index from schema definition
KecamatanSchema.index({ regencyCode: 1 })
KecamatanSchema.index({ name: 1 })
KecamatanSchema.index({ isActive: 1 })
KecamatanSchema.index({ geometry: '2dsphere' })
KecamatanSchema.index({ centroid: '2dsphere' })

// Virtual for formatted area
KecamatanSchema.virtual('formattedArea').get(function() {
  return `${this.area.toFixed(2)} km²`
})

// Virtual for population density
KecamatanSchema.virtual('populationDensityFormatted').get(function() {
  return `${this.demographics.populationDensity.toFixed(0)} jiwa/km²`
})

export const Kecamatan = mongoose.models.Kecamatan || mongoose.model<IKecamatan>('Kecamatan', KecamatanSchema)
