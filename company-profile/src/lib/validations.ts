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
  return str.trim().replace(/[<>]/g, '')
}

// Type exports for form data
export type ContactFormData = z.infer<typeof contactFormSchema>
export type NewsletterData = z.infer<typeof newsletterSchema>
export type ServiceInquiryData = z.infer<typeof serviceInquirySchema>
export type TeamMemberData = z.infer<typeof teamMemberSchema>
export type TestimonialData = z.infer<typeof testimonialSchema>
export type ServiceData = z.infer<typeof serviceSchema>
export type BlogPostData = z.infer<typeof blogPostSchema>
