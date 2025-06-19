import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the privacy policy',
    }),
})

// Newsletter subscription validation schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),
  
  preferences: z
    .object({
      marketing: z.boolean().default(false),
      updates: z.boolean().default(true),
      newsletter: z.boolean().default(true),
    })
    .optional(),
})

// Service inquiry validation schema
export const serviceInquirySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .optional(),
  
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  serviceType: z
    .string()
    .min(1, 'Please select a service type'),
  
  budget: z
    .string()
    .optional(),
  
  timeline: z
    .string()
    .optional(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the privacy policy',
    }),
})

// Team member validation schema
export const teamMemberSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
  
  bio: z
    .string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must be less than 500 characters'),
  
  image: z
    .string()
    .url('Please enter a valid image URL'),
  
  socialMedia: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      email: z.string().email().optional(),
    })
    .optional(),
})

// Testimonial validation schema
export const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
  
  company: z
    .string()
    .min(1, 'Company is required')
    .max(100, 'Company must be less than 100 characters'),
  
  content: z
    .string()
    .min(10, 'Testimonial content must be at least 10 characters')
    .max(500, 'Testimonial content must be less than 500 characters'),
  
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  
  image: z
    .string()
    .url('Please enter a valid image URL')
    .optional(),
})

// Service validation schema
export const serviceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  icon: z
    .string()
    .min(1, 'Icon is required'),
  
  features: z
    .array(z.string().min(1, 'Feature cannot be empty'))
    .min(1, 'At least one feature is required'),
  
  price: z
    .object({
      amount: z.number().positive('Price must be positive'),
      currency: z.string().length(3, 'Currency must be 3 characters'),
      period: z.string().min(1, 'Period is required'),
    })
    .optional(),
})

// Blog post validation schema (for future use)
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(300, 'Excerpt must be less than 300 characters'),
  
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters'),
  
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed'),
  
  published: z.boolean(),
  
  featuredImage: z
    .string()
    .url('Please enter a valid image URL')
    .optional(),
})

// Generic validation utilities
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success
}

export const validatePhone = (phone: string): boolean => {
  return /^[\+]?[1-9][\d]{0,15}$/.test(phone)
}

export const validateUrl = (url: string): boolean => {
  return z.string().url().safeParse(url).success
}

export const sanitizeString = (str: string): string => {
  return str.trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+=/gi, '')
}

// Enhanced validation utilities
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 3 && slug.length <= 100
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters')
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    errors.push('Password cannot contain common patterns')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    }
  }

  // Check for suspicious file names
  if (/\.(php|js|html|htm|exe|bat|cmd|scr|vbs|jar)$/i.test(file.name)) {
    return {
      isValid: false,
      error: 'File name contains suspicious extension'
    }
  }

  return { isValid: true }
}

// Kecamatan validation schemas
export const geoJSONPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2)
})

export const geoJSONPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number().array().length(2))))
})

export const geoJSONMultiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(z.array(z.number().array().length(2)))))
})

export const geoJSONGeometrySchema = z.union([
  geoJSONPointSchema,
  geoJSONPolygonSchema,
  geoJSONMultiPolygonSchema
])

export const demographicDataSchema = z.object({
  totalPopulation: z.number().min(0),
  malePopulation: z.number().min(0),
  femalePopulation: z.number().min(0),
  households: z.number().min(0),
  populationDensity: z.number().min(0),
  ageGroups: z.object({
    under15: z.number().min(0),
    age15to64: z.number().min(0),
    over64: z.number().min(0)
  }),
  education: z.object({
    noEducation: z.number().min(0).default(0),
    elementary: z.number().min(0).default(0),
    juniorHigh: z.number().min(0).default(0),
    seniorHigh: z.number().min(0).default(0),
    university: z.number().min(0).default(0)
  }).optional(),
  religion: z.object({
    christian: z.number().min(0).default(0),
    catholic: z.number().min(0).default(0),
    islam: z.number().min(0).default(0),
    hindu: z.number().min(0).default(0),
    buddhist: z.number().min(0).default(0),
    other: z.number().min(0).default(0)
  }).optional(),
  lastUpdated: z.date().optional()
})

export const economicDataSchema = z.object({
  gdpPerCapita: z.number().min(0).optional(),
  mainIndustries: z.array(z.string()),
  employmentRate: z.number().min(0).max(100),
  unemploymentRate: z.number().min(0).max(100),
  povertyRate: z.number().min(0).max(100),
  averageIncome: z.number().min(0).optional(),
  economicSectors: z.object({
    agriculture: z.number().min(0).max(100),
    industry: z.number().min(0).max(100),
    services: z.number().min(0).max(100)
  }),
  lastUpdated: z.date().optional()
})

export const agriculturalDataSchema = z.object({
  totalAgriculturalArea: z.number().min(0),
  riceFields: z.number().min(0).default(0),
  dryFields: z.number().min(0).default(0),
  plantations: z.number().min(0).default(0),
  mainCrops: z.array(z.object({
    name: z.string().min(1),
    area: z.number().min(0),
    production: z.number().min(0),
    productivity: z.number().min(0)
  })),
  livestock: z.array(z.object({
    type: z.string().min(1),
    count: z.number().min(0)
  })),
  fishery: z.object({
    marineCapture: z.number().min(0).default(0),
    aquaculture: z.number().min(0).default(0)
  }),
  lastUpdated: z.date().optional()
})

export const kecamatanCreateSchema = z.object({
  name: z.string().min(1).max(100),
  nameEnglish: z.string().max(100).optional(),
  code: z.string().min(1).max(20),
  regencyCode: z.string().min(1).max(20),
  regencyName: z.string().min(1).max(100),
  provinceCode: z.string().min(1).max(20),
  provinceName: z.string().min(1).max(100),
  geometry: z.union([geoJSONPolygonSchema, geoJSONMultiPolygonSchema]),
  centroid: geoJSONPointSchema,
  area: z.number().min(0),
  capital: z.string().min(1).max(100),
  villages: z.array(z.object({
    name: z.string().min(1).max(100),
    type: z.enum(['desa', 'kelurahan']),
    population: z.number().min(0).optional()
  })),
  demographics: demographicDataSchema,
  economy: economicDataSchema,
  agriculture: agriculturalDataSchema,
  naturalResources: z.object({
    minerals: z.array(z.object({
      type: z.string().min(1),
      reserves: z.string().optional(),
      status: z.enum(['explored', 'exploited', 'potential'])
    })),
    forestArea: z.number().min(0).default(0),
    coastalLength: z.number().min(0).optional(),
    waterResources: z.array(z.object({
      type: z.enum(['river', 'lake', 'spring', 'reservoir']),
      name: z.string().min(1),
      capacity: z.number().optional()
    })),
    renewableEnergy: z.array(z.object({
      type: z.enum(['solar', 'wind', 'hydro', 'biomass']),
      potential: z.string().min(1),
      status: z.enum(['developed', 'planned', 'potential'])
    })),
    lastUpdated: z.date().optional()
  }),
  infrastructure: z.object({
    roads: z.object({
      totalLength: z.number().min(0).default(0),
      pavedRoads: z.number().min(0).default(0),
      unpavedRoads: z.number().min(0).default(0)
    }),
    healthFacilities: z.object({
      hospitals: z.number().min(0).default(0),
      healthCenters: z.number().min(0).default(0),
      clinics: z.number().min(0).default(0),
      doctors: z.number().min(0).default(0),
      nurses: z.number().min(0).default(0)
    }),
    education: z.object({
      kindergartens: z.number().min(0).default(0),
      elementarySchools: z.number().min(0).default(0),
      juniorHighSchools: z.number().min(0).default(0),
      seniorHighSchools: z.number().min(0).default(0),
      universities: z.number().min(0).default(0),
      teachers: z.number().min(0).default(0)
    }),
    utilities: z.object({
      electricityAccess: z.number().min(0).max(100).default(0),
      cleanWaterAccess: z.number().min(0).max(100).default(0),
      internetAccess: z.number().min(0).max(100).default(0),
      wasteManagement: z.boolean().default(false)
    }),
    lastUpdated: z.date().optional()
  }),
  tourism: z.object({
    attractions: z.array(z.object({
      name: z.string().min(1),
      type: z.enum(['beach', 'cultural', 'historical', 'natural', 'religious']),
      description: z.string().min(1),
      coordinates: geoJSONPointSchema.optional()
    })),
    accommodations: z.object({
      hotels: z.number().min(0).default(0),
      guesthouses: z.number().min(0).default(0),
      homestays: z.number().min(0).default(0)
    }),
    annualVisitors: z.number().min(0).optional(),
    lastUpdated: z.date().optional()
  }),
  isActive: z.boolean().default(true),
  displayOrder: z.number().default(0)
})

export const kecamatanUpdateSchema = kecamatanCreateSchema.partial().omit({ code: true })

// Type exports for form data
export type ContactFormData = z.infer<typeof contactFormSchema>
export type NewsletterData = z.infer<typeof newsletterSchema>
export type ServiceInquiryData = z.infer<typeof serviceInquirySchema>
export type TeamMemberData = z.infer<typeof teamMemberSchema>
export type TestimonialData = z.infer<typeof testimonialSchema>
export type ServiceData = z.infer<typeof serviceSchema>
export type BlogPostData = z.infer<typeof blogPostSchema>
