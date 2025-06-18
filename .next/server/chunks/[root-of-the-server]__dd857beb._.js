module.exports = {

"[project]/.next-internal/server/app/api/test-db/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

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
// Create indexes for better performance (only for non-unique fields)
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
// newsSchema slug already has unique: true, no need for manual index
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
// userSchema email and username already have unique: true, no need for manual indexes
// kecamatanSchema slug and name already have unique: true, no need for manual indexes
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
"[project]/src/app/api/test-db/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/models/index.ts [app-route] (ecmascript)");
;
;
;
async function GET() {
    try {
        // Check if already connected
        if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState !== 1) {
            // Try to connect
            await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(process.env.MONGODB_URI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            });
        }
        // Test Kecamatan collection
        const count = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kecamatan"].countDocuments();
        const sample = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kecamatan"].findOne().select('name slug').lean();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Successfully connected to MongoDB',
            state: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState,
            host: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.host,
            name: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.name,
            kecamatanCount: count,
            sampleKecamatan: sample
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to connect to database',
            details: error instanceof Error ? error.message : 'Unknown error',
            state: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__dd857beb._.js.map