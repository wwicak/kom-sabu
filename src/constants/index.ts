import { CompanyInfo, NavigationItem, Service, TeamMember, Testimonial } from '@/types'

// Company information
export const COMPANY_INFO: CompanyInfo = {
  name: 'Pemerintah Kabupaten Sabu Raijua',
  tagline: 'Mira Kaddi - Membangun Bersama Sabu Raijua yang Maju dan Sejahtera',
  description: 'Kabupaten Sabu Raijua adalah kabupaten kepulauan di Provinsi Nusa Tenggara Timur yang terdiri dari Pulau Sabu dan Pulau Raijua. Dengan motto "Mira Kaddi" (Membangun Bersama), kami berkomitmen membangun daerah yang maju, sejahtera, dan berkelanjutan berbasis kearifan lokal dan inovasi.',
  email: 'info@saburaijuakab.go.id',
  phone: '+62 380 21001',
  address: {
    street: 'Jl. Trans Sabu No. 1',
    city: 'Menia, Sabu Barat',
    state: 'Nusa Tenggara Timur',
    zipCode: '85391',
    country: 'Indonesia',
  },
  socialMedia: {
    facebook: 'https://facebook.com/pemkabsaburajua',
    twitter: 'https://twitter.com/saburajuakab',
    instagram: 'https://instagram.com/saburajuakab',
  },
}

// Navigation items
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '/profil' },
  { name: 'Kecamatan', href: '/kecamatan' },
  { name: 'Peta Kecamatan', href: '/peta-kecamatan' },
  { name: 'Budaya', href: '/budaya' },
  { name: 'Wisata', href: '/wisata' },
  { name: 'Layanan', href: '/layanan' },
  { name: 'Berita', href: '/berita' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Kontak', href: '/kontak' },
]

// Services data
export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Pelayanan Administrasi Kependudukan',
    description: 'Layanan pembuatan dan pengurusan dokumen kependudukan seperti KTP, KK, Akta Kelahiran, dan dokumen lainnya.',
    icon: 'users',
    features: [
      'Pembuatan KTP Elektronik',
      'Pengurusan Kartu Keluarga',
      'Akta Kelahiran dan Kematian',
      'Surat Pindah Domisili',
      'Legalisir Dokumen',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Pelayanan Perizinan',
    description: 'Layanan pengurusan berbagai jenis izin usaha dan non-usaha untuk masyarakat dan pelaku usaha.',
    icon: 'fileText',
    features: [
      'Izin Mendirikan Bangunan (IMB)',
      'Izin Usaha Mikro Kecil (IUMK)',
      'Surat Izin Tempat Usaha (SITU)',
      'Izin Gangguan (HO)',
      'Izin Keramaian',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Pelayanan Sosial',
    description: 'Program bantuan sosial dan pemberdayaan masyarakat untuk meningkatkan kesejahteraan rakyat.',
    icon: 'heart',
    features: [
      'Bantuan Sosial Tunai',
      'Program Keluarga Harapan (PKH)',
      'Bantuan Pangan Non Tunai (BPNT)',
      'Program Pemberdayaan Masyarakat',
      'Bantuan untuk Penyandang Disabilitas',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Pelayanan Kesehatan',
    description: 'Layanan kesehatan masyarakat melalui puskesmas dan program kesehatan daerah.',
    icon: 'activity',
    features: [
      'Pelayanan Kesehatan Dasar',
      'Imunisasi dan Vaksinasi',
      'Program KB dan Kesehatan Ibu',
      'Penyuluhan Kesehatan Masyarakat',
      'Rujukan Kesehatan',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Team members data
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    position: 'CEO & Founder',
    bio: 'Sarah has over 15 years of experience in technology leadership and business strategy. She founded TechCorp with a vision to help businesses leverage technology for growth.',
    image: '/images/team/sarah-johnson.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/sarah-johnson',
      twitter: 'https://twitter.com/sarahjohnson',
      email: 'sarah@techcorp.com',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    position: 'CTO',
    bio: 'Michael is a seasoned technology executive with expertise in cloud architecture, software development, and team leadership. He ensures our technical excellence.',
    image: '/images/team/michael-chen.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/michael-chen',
      twitter: 'https://twitter.com/michaelchen',
      email: 'michael@techcorp.com',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    position: 'Head of Design',
    bio: 'Emily brings creativity and user-centered design thinking to every project. She leads our design team in creating intuitive and beautiful user experiences.',
    image: '/images/team/emily-rodriguez.jpg',
    socialMedia: {
      linkedin: 'https://linkedin.com/in/emily-rodriguez',
      twitter: 'https://twitter.com/emilyrodriguez',
      email: 'emily@techcorp.com',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Testimonials data
export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'David Wilson',
    position: 'CEO',
    company: 'InnovateCorp',
    content: 'TechCorp transformed our business with their innovative solutions. Their team is professional, responsive, and delivers exceptional results.',
    rating: 5,
    image: '/images/testimonials/david-wilson.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Lisa Thompson',
    position: 'CTO',
    company: 'GrowthTech',
    content: 'Working with TechCorp was a game-changer for our digital transformation. They understood our needs and delivered beyond our expectations.',
    rating: 5,
    image: '/images/testimonials/lisa-thompson.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Robert Martinez',
    position: 'Founder',
    company: 'StartupXYZ',
    content: 'The custom software solution TechCorp built for us has significantly improved our operational efficiency. Highly recommended!',
    rating: 5,
    image: '/images/testimonials/robert-martinez.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// SEO and metadata
export const DEFAULT_SEO = {
  title: 'TechCorp Solutions - Innovative Technology Solutions',
  description: 'Leading technology company providing custom software development, cloud solutions, and digital transformation services. Transform your business with our expert team.',
  keywords: [
    'software development',
    'cloud solutions',
    'digital transformation',
    'technology consulting',
    'custom software',
    'web development',
    'mobile apps',
  ],
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
}

// Contact form configuration
export const CONTACT_FORM_CONFIG = {
  subjects: [
    'Informasi Umum',
    'Pelayanan Administrasi',
    'Perizinan Usaha',
    'Bantuan Sosial',
    'Kesehatan Masyarakat',
    'Pendidikan',
    'Infrastruktur',
    'Pariwisata & Budaya',
    'Pengaduan',
    'Saran & Kritik',
    'Lainnya',
  ],
  departments: [
    'Sekretariat Daerah',
    'Dinas Kependudukan dan Pencatatan Sipil',
    'Dinas Perizinan dan Penanaman Modal',
    'Dinas Sosial',
    'Dinas Kesehatan',
    'Dinas Pendidikan',
    'Dinas Pekerjaan Umum',
    'Dinas Pariwisata dan Kebudayaan',
    'Inspektorat',
    'Bagian Humas',
  ],
  priorities: [
    'Rendah',
    'Sedang',
    'Tinggi',
    'Mendesak',
  ],
}

// API endpoints
export const API_ENDPOINTS = {
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  services: '/api/services',
  team: '/api/team',
  testimonials: '/api/testimonials',
}

// Feature flags
export const FEATURE_FLAGS = {
  enableNewsletter: true,
  enableBlog: false,
  enablePortfolio: false,
  enableChat: false,
  enableAnalytics: true,
}

// Theme configuration
export const THEME_CONFIG = {
  colors: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#3b82f6',
    neutral: '#f9fafb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Monaco, monospace',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  validation: 'Please check your input and try again.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
}

// Success messages
export const SUCCESS_MESSAGES = {
  contactForm: 'Thank you for your message! We will get back to you soon.',
  newsletter: 'Successfully subscribed to our newsletter!',
  formSubmitted: 'Form submitted successfully!',
}
