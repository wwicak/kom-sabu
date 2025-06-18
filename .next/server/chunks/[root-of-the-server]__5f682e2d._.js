module.exports = {

"[project]/.next-internal/server/app/api/seed/kecamatan/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/mongodb [external] (mongodb, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}}),
"[project]/src/lib/mongodb.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "checkDatabaseHealth": (()=>checkDatabaseHealth),
    "closeDatabaseConnection": (()=>closeDatabaseConnection),
    "connectToDatabase": (()=>connectToDatabase),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const uri = process.env.MONGODB_URI;
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global;
    if (!globalWithMongo._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    "TURBOPACK unreachable";
}
async function connectToDatabase() {
    try {
        const client = await clientPromise;
        const db = client.db('sabu-raijua');
        return {
            client,
            db
        };
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
    }
}
async function checkDatabaseHealth() {
    try {
        const { client } = await connectToDatabase();
        await client.db('admin').command({
            ping: 1
        });
        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
}
async function closeDatabaseConnection() {
    try {
        const client = await clientPromise;
        await client.close();
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}
const __TURBOPACK__default__export__ = clientPromise;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/src/lib/models/index.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Agenda": (()=>Agenda),
    "AuditLog": (()=>AuditLog),
    "ContactForm": (()=>ContactForm),
    "GalleryItem": (()=>GalleryItem),
    "Kecamatan": (()=>Kecamatan),
    "News": (()=>News),
    "User": (()=>User)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
// Contact Form Schema
const contactFormSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        validate: {
            validator: (v)=>/^[a-zA-Z\s'-]+$/.test(v),
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
            validator: (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Please enter a valid email address'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (v)=>!v || /^[\+]?[1-9][\d]{0,15}$/.test(v),
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
            validator: (v)=>v === true,
            message: 'Consent is required'
        }
    },
    status: {
        type: String,
        enum: [
            'pending',
            'read',
            'replied',
            'archived'
        ],
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
});
// Gallery Item Schema
const galleryItemSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
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
        enum: [
            'Pemerintahan',
            'Pembangunan',
            'Sosial',
            'Budaya',
            'Kesehatan',
            'Pendidikan'
        ]
    },
    tags: [
        String
    ],
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    uploadedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
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
});
// News/Article Schema
const newsSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
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
        enum: [
            'Berita',
            'Pengumuman',
            'Artikel',
            'Press Release'
        ]
    },
    tags: [
        String
    ],
    author: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
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
    seoKeywords: [
        String
    ],
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
});
// Agenda Schema
const agendaSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
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
        enum: [
            'Rapat',
            'Upacara',
            'Kunjungan',
            'Acara',
            'Pelatihan',
            'Lainnya'
        ]
    },
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    participants: [
        String
    ],
    isPublic: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: [
            'scheduled',
            'ongoing',
            'completed',
            'cancelled'
        ],
        default: 'scheduled'
    },
    createdBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
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
});
// User Schema (for admin/staff)
const userSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
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
        enum: [
            'admin',
            'editor',
            'viewer'
        ],
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
});
// Kecamatan Schema
const kecamatanSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    area: {
        type: Number,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    villages: {
        type: Number,
        required: true
    },
    coordinates: {
        center: {
            lat: {
                type: Number,
                required: true
            },
            lng: {
                type: Number,
                required: true
            }
        },
        bounds: {
            north: Number,
            south: Number,
            east: Number,
            west: Number
        }
    },
    polygon: {
        type: {
            type: String,
            enum: [
                'Polygon',
                'MultiPolygon'
            ],
            default: 'Polygon'
        },
        coordinates: {
            type: [
                [
                    [
                        Number
                    ]
                ]
            ],
            required: true
        }
    },
    potency: {
        agriculture: {
            mainCrops: [
                String
            ],
            productivity: String,
            farmingArea: Number // in hectares
        },
        fishery: {
            mainSpecies: [
                String
            ],
            productivity: String,
            fishingArea: Number // in hectares
        },
        tourism: {
            attractions: [
                String
            ],
            facilities: [
                String
            ],
            annualVisitors: Number
        },
        economy: {
            mainSectors: [
                String
            ],
            averageIncome: Number,
            businessUnits: Number
        },
        infrastructure: {
            roads: String,
            electricity: Number,
            water: Number,
            internet: Number // percentage coverage
        }
    },
    demographics: {
        ageGroups: {
            children: Number,
            adults: Number,
            elderly: Number // 65+ years
        },
        education: {
            elementary: Number,
            junior: Number,
            senior: Number,
            higher: Number
        },
        occupation: {
            agriculture: Number,
            fishery: Number,
            trade: Number,
            services: Number,
            others: Number
        }
    },
    images: [
        {
            url: String,
            caption: String,
            category: {
                type: String,
                enum: [
                    'landscape',
                    'culture',
                    'economy',
                    'infrastructure',
                    'tourism'
                ]
            }
        }
    ],
    headOffice: {
        address: String,
        phone: String,
        email: String,
        head: String // Camat name
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});
// Audit Log Schema
const auditLogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
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
    details: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});
// Create indexes for better performance
contactFormSchema.index({
    createdAt: -1
});
contactFormSchema.index({
    status: 1
});
galleryItemSchema.index({
    category: 1,
    isPublished: 1
});
galleryItemSchema.index({
    createdAt: -1
});
newsSchema.index({
    slug: 1
});
newsSchema.index({
    category: 1,
    isPublished: 1
});
newsSchema.index({
    publishedAt: -1
});
agendaSchema.index({
    startDate: 1
});
agendaSchema.index({
    isPublic: 1,
    status: 1
});
userSchema.index({
    email: 1
});
userSchema.index({
    username: 1
});
kecamatanSchema.index({
    slug: 1
});
kecamatanSchema.index({
    name: 1
});
kecamatanSchema.index({
    isActive: 1
});
kecamatanSchema.index({
    'coordinates.center': '2dsphere'
});
auditLogSchema.index({
    timestamp: -1
});
auditLogSchema.index({
    userId: 1
});
const ContactForm = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ContactForm || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('ContactForm', contactFormSchema);
const GalleryItem = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.GalleryItem || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('GalleryItem', galleryItemSchema);
const News = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.News || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('News', newsSchema);
const Agenda = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Agenda || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Agenda', agendaSchema);
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', userSchema);
const Kecamatan = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Kecamatan || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Kecamatan', kecamatanSchema);
const AuditLog = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.AuditLog || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('AuditLog', auditLogSchema);
}}),
"[project]/src/lib/seedKecamatan.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "seedKecamatanData": (()=>seedKecamatanData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/models/index.ts [app-route] (ecmascript)");
;
;
// Sample kecamatan data for Sabu Raijua
const kecamatanData = [
    {
        name: 'Sabu Barat',
        slug: 'sabu-barat',
        description: 'Kecamatan yang terletak di bagian barat Pulau Sabu dengan potensi pertanian dan perikanan yang melimpah.',
        area: 89.5,
        population: 15420,
        villages: 12,
        coordinates: {
            center: {
                lat: -10.5234,
                lng: 121.7456
            },
            bounds: {
                north: -10.4800,
                south: -10.5800,
                east: 121.8000,
                west: 121.6800
            }
        },
        polygon: {
            type: 'Polygon',
            coordinates: [
                [
                    [
                        121.6800,
                        -10.4800
                    ],
                    [
                        121.8000,
                        -10.4800
                    ],
                    [
                        121.8000,
                        -10.5800
                    ],
                    [
                        121.6800,
                        -10.5800
                    ],
                    [
                        121.6800,
                        -10.4800
                    ]
                ]
            ]
        },
        potency: {
            agriculture: {
                mainCrops: [
                    'Jagung',
                    'Kacang Tanah',
                    'Ubi Kayu'
                ],
                productivity: 'Tinggi',
                farmingArea: 2500
            },
            fishery: {
                mainSpecies: [
                    'Ikan Tuna',
                    'Ikan Cakalang',
                    'Udang'
                ],
                productivity: 'Sedang',
                fishingArea: 150
            },
            tourism: {
                attractions: [
                    'Pantai Namosain',
                    'Bukit Wairinding'
                ],
                facilities: [
                    'Homestay',
                    'Warung Makan'
                ],
                annualVisitors: 2500
            },
            economy: {
                mainSectors: [
                    'Pertanian',
                    'Perikanan',
                    'Perdagangan'
                ],
                averageIncome: 2500000,
                businessUnits: 145
            },
            infrastructure: {
                roads: 'Baik',
                electricity: 85,
                water: 78,
                internet: 45
            }
        },
        demographics: {
            ageGroups: {
                children: 4200,
                adults: 9800,
                elderly: 1420
            },
            education: {
                elementary: 12,
                junior: 3,
                senior: 2,
                higher: 0
            },
            occupation: {
                agriculture: 8500,
                fishery: 2800,
                trade: 1900,
                services: 1200,
                others: 1020
            }
        },
        images: [
            {
                url: '/images/kecamatan/sabu-barat-1.jpg',
                caption: 'Pemandangan sawah di Kecamatan Sabu Barat',
                category: 'landscape'
            }
        ],
        headOffice: {
            address: 'Jl. Trans Sabu No. 15, Desa Dimu',
            phone: '0380-21001',
            email: 'kec.sabubarat@saburaijuakab.go.id',
            head: 'Drs. Yosef Ndolu'
        }
    },
    {
        name: 'Sabu Tengah',
        slug: 'sabu-tengah',
        description: 'Kecamatan yang menjadi pusat pemerintahan dengan infrastruktur terbaik di Kabupaten Sabu Raijua.',
        area: 76.8,
        population: 18750,
        villages: 10,
        coordinates: {
            center: {
                lat: -10.5100,
                lng: 121.8200
            },
            bounds: {
                north: -10.4600,
                south: -10.5600,
                east: 121.8800,
                west: 121.7600
            }
        },
        polygon: {
            type: 'Polygon',
            coordinates: [
                [
                    [
                        121.7600,
                        -10.4600
                    ],
                    [
                        121.8800,
                        -10.4600
                    ],
                    [
                        121.8800,
                        -10.5600
                    ],
                    [
                        121.7600,
                        -10.5600
                    ],
                    [
                        121.7600,
                        -10.4600
                    ]
                ]
            ]
        },
        potency: {
            agriculture: {
                mainCrops: [
                    'Padi',
                    'Jagung',
                    'Sayuran'
                ],
                productivity: 'Sangat Tinggi',
                farmingArea: 1800
            },
            tourism: {
                attractions: [
                    'Museum Sabu',
                    'Pasar Tradisional Seba',
                    'Pantai Seba'
                ],
                facilities: [
                    'Hotel',
                    'Restoran',
                    'Pusat Oleh-oleh'
                ],
                annualVisitors: 8500
            },
            economy: {
                mainSectors: [
                    'Pemerintahan',
                    'Perdagangan',
                    'Jasa'
                ],
                averageIncome: 3200000,
                businessUnits: 285
            },
            infrastructure: {
                roads: 'Sangat Baik',
                electricity: 95,
                water: 90,
                internet: 75
            }
        },
        demographics: {
            ageGroups: {
                children: 5100,
                adults: 11800,
                elderly: 1850
            },
            education: {
                elementary: 15,
                junior: 5,
                senior: 3,
                higher: 1
            },
            occupation: {
                agriculture: 6200,
                fishery: 1800,
                trade: 4500,
                services: 5200,
                others: 1050
            }
        },
        headOffice: {
            address: 'Jl. Merdeka No. 1, Seba',
            phone: '0380-21002',
            email: 'kec.sabutengah@saburaijuakab.go.id',
            head: 'Ir. Maria Kaka, M.Si'
        }
    },
    {
        name: 'Sabu Timur',
        slug: 'sabu-timur',
        description: 'Kecamatan dengan potensi perikanan laut yang sangat besar dan pantai-pantai indah.',
        area: 95.2,
        population: 14680,
        villages: 14,
        coordinates: {
            center: {
                lat: -10.5300,
                lng: 121.9000
            },
            bounds: {
                north: -10.4800,
                south: -10.5800,
                east: 121.9600,
                west: 121.8400
            }
        },
        polygon: {
            type: 'Polygon',
            coordinates: [
                [
                    [
                        121.8400,
                        -10.4800
                    ],
                    [
                        121.9600,
                        -10.4800
                    ],
                    [
                        121.9600,
                        -10.5800
                    ],
                    [
                        121.8400,
                        -10.5800
                    ],
                    [
                        121.8400,
                        -10.4800
                    ]
                ]
            ]
        },
        potency: {
            fishery: {
                mainSpecies: [
                    'Ikan Tuna',
                    'Ikan Tongkol',
                    'Cumi-cumi'
                ],
                productivity: 'Sangat Tinggi',
                fishingArea: 280
            },
            tourism: {
                attractions: [
                    'Pantai Namosain',
                    'Pantai Wadu',
                    'Spot Diving'
                ],
                facilities: [
                    'Homestay',
                    'Boat Rental'
                ],
                annualVisitors: 3200
            },
            economy: {
                mainSectors: [
                    'Perikanan',
                    'Pariwisata',
                    'Pertanian'
                ],
                averageIncome: 2800000,
                businessUnits: 165
            },
            infrastructure: {
                roads: 'Baik',
                electricity: 80,
                water: 72,
                internet: 40
            }
        },
        demographics: {
            ageGroups: {
                children: 4000,
                adults: 9200,
                elderly: 1480
            },
            education: {
                elementary: 14,
                junior: 4,
                senior: 2,
                higher: 0
            },
            occupation: {
                agriculture: 4500,
                fishery: 6800,
                trade: 1600,
                services: 980,
                others: 800
            }
        },
        headOffice: {
            address: 'Jl. Pantai Timur No. 8, Desa Wadu',
            phone: '0380-21003',
            email: 'kec.sabutimur@saburaijuakab.go.id',
            head: 'Bapak Yohanis Dapa'
        }
    },
    {
        name: 'Raijua',
        slug: 'raijua',
        description: 'Kecamatan kepulauan dengan keunikan budaya dan potensi wisata bahari yang menawan.',
        area: 36.5,
        population: 8950,
        villages: 8,
        coordinates: {
            center: {
                lat: -10.6500,
                lng: 121.7200
            },
            bounds: {
                north: -10.6000,
                south: -10.7000,
                east: 121.7800,
                west: 121.6600
            }
        },
        polygon: {
            type: 'Polygon',
            coordinates: [
                [
                    [
                        121.6600,
                        -10.6000
                    ],
                    [
                        121.7800,
                        -10.6000
                    ],
                    [
                        121.7800,
                        -10.7000
                    ],
                    [
                        121.6600,
                        -10.7000
                    ],
                    [
                        121.6600,
                        -10.6000
                    ]
                ]
            ]
        },
        potency: {
            fishery: {
                mainSpecies: [
                    'Ikan Kerapu',
                    'Lobster',
                    'Rumput Laut'
                ],
                productivity: 'Tinggi',
                fishingArea: 120
            },
            tourism: {
                attractions: [
                    'Pantai Pasir Putih',
                    'Desa Adat',
                    'Tenun Tradisional'
                ],
                facilities: [
                    'Homestay',
                    'Galeri Tenun'
                ],
                annualVisitors: 1800
            },
            economy: {
                mainSectors: [
                    'Perikanan',
                    'Kerajinan',
                    'Pariwisata'
                ],
                averageIncome: 2200000,
                businessUnits: 85
            },
            infrastructure: {
                roads: 'Sedang',
                electricity: 70,
                water: 65,
                internet: 25
            }
        },
        demographics: {
            ageGroups: {
                children: 2400,
                adults: 5800,
                elderly: 750
            },
            education: {
                elementary: 8,
                junior: 2,
                senior: 1,
                higher: 0
            },
            occupation: {
                agriculture: 1800,
                fishery: 4200,
                trade: 1200,
                services: 950,
                others: 800
            }
        },
        headOffice: {
            address: 'Jl. Pelabuhan Raijua No. 3, Desa Raijua',
            phone: '0380-21004',
            email: 'kec.raijua@saburaijuakab.go.id',
            head: 'Ibu Theresia Lede, S.Sos'
        }
    }
];
async function seedKecamatanData() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        // Clear existing data
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kecamatan"].deleteMany({});
        // Insert new data
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kecamatan"].insertMany(kecamatanData);
        console.log(`Successfully seeded ${result.length} kecamatan records`);
        return result;
    } catch (error) {
        console.error('Error seeding kecamatan data:', error);
        throw error;
    }
}
// Run this function to seed the database
if (("TURBOPACK member replacement", __turbopack_context__.z).main === module) {
    seedKecamatanData().then(()=>{
        console.log('Seeding completed');
        process.exit(0);
    }).catch((error)=>{
        console.error('Seeding failed:', error);
        process.exit(1);
    });
}
}}),
"[project]/src/app/api/seed/kecamatan/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seedKecamatan$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/seedKecamatan.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    // Only allow in development environment
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$seedKecamatan$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["seedKecamatanData"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Successfully seeded ${result.length} kecamatan records`,
            data: result
        });
    } catch (error) {
        console.error('Error seeding kecamatan data:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to seed kecamatan data'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5f682e2d._.js.map