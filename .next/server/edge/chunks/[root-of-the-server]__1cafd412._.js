(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__1cafd412._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:events [external] (node:events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}}),
"[externals]/node:util [external] (node:util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}}),
"[externals]/node:assert [external] (node:assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}}),
"[project]/src/lib/security.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "SECURITY_CONFIG": (()=>SECURITY_CONFIG),
    "checkRateLimit": (()=>checkRateLimit),
    "cleanupRateLimitStore": (()=>cleanupRateLimitStore),
    "decryptData": (()=>decryptData),
    "encryptData": (()=>encryptData),
    "generateSecureToken": (()=>generateSecureToken),
    "getRateLimitInfo": (()=>getRateLimitInfo),
    "hashPassword": (()=>hashPassword),
    "sanitizeHtml": (()=>sanitizeHtml),
    "setSecurityHeaders": (()=>setSecurityHeaders),
    "validateCSRFToken": (()=>validateCSRFToken),
    "validateInput": (()=>validateInput),
    "verifyPassword": (()=>verifyPassword)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dompurify/dist/purify.es.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsdom$2f$lib$2f$api$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsdom/lib/api.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/validator/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/crypto-js/index.js [middleware-edge] (ecmascript)");
;
;
;
;
// Initialize DOMPurify for server-side use
const window = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsdom$2f$lib$2f$api$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["JSDOM"]('').window;
const purify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])(window);
const SECURITY_CONFIG = {
    // Rate limiting
    RATE_LIMIT: {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.'
    },
    // CSRF protection
    CSRF: {
        secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
        cookie: {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        }
    },
    // Session configuration
    SESSION: {
        secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
        maxAge: 24 * 60 * 60 * 1000,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        httpOnly: true,
        sameSite: 'strict'
    },
    // Content Security Policy
    CSP: {
        'default-src': [
            "'self'"
        ],
        'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'"
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com'
        ],
        'font-src': [
            "'self'",
            'https://fonts.gstatic.com'
        ],
        'img-src': [
            "'self'",
            'data:',
            'https:'
        ],
        'connect-src': [
            "'self'"
        ],
        'frame-ancestors': [
            "'none'"
        ],
        'base-uri': [
            "'self'"
        ],
        'form-action': [
            "'self'"
        ]
    }
};
function sanitizeHtml(dirty) {
    return purify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'b',
            'i',
            'em',
            'strong',
            'a',
            'p',
            'br'
        ],
        ALLOWED_ATTR: [
            'href'
        ]
    });
}
const validateInput = {
    email: (email)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].isEmail(email) && email.length <= 254;
    },
    phone: (phone)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].isMobilePhone(phone, 'any');
    },
    name: (name)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].isLength(name, {
            min: 1,
            max: 100
        }) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].matches(name, /^[a-zA-Z\s'-]+$/);
    },
    message: (message)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].isLength(message, {
            min: 1,
            max: 1000
        });
    },
    url: (url)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$validator$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].isURL(url, {
            protocols: [
                'http',
                'https'
            ],
            require_protocol: true
        });
    }
};
function encryptData(data) {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].AES.encrypt(data, key).toString();
}
function decryptData(encryptedData) {
    const key = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    const bytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].AES.decrypt(encryptedData, key);
    return bytes.toString(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].enc.Utf8);
}
function generateSecureToken() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].lib.WordArray.random(32).toString();
}
function setSecurityHeaders(response) {
    // Prevent XSS attacks
    response.headers.set('X-XSS-Protection', '1; mode=block');
    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // Enforce HTTPS
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    // Content Security Policy
    const cspString = Object.entries(SECURITY_CONFIG.CSP).map(([directive, sources])=>`${directive} ${sources.join(' ')}`).join('; ');
    response.headers.set('Content-Security-Policy', cspString);
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Permissions Policy
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    return response;
}
// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();
function checkRateLimit(ip, options) {
    const now = Date.now();
    const windowMs = options?.windowMs || SECURITY_CONFIG.RATE_LIMIT.windowMs;
    const maxRequests = options?.max || SECURITY_CONFIG.RATE_LIMIT.max;
    const record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + windowMs
        });
        return true;
    }
    if (record.count >= maxRequests) {
        return false;
    }
    record.count++;
    return true;
}
function cleanupRateLimitStore() {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()){
        if (now > record.resetTime) {
            rateLimitStore.delete(ip);
        }
    }
}
function getRateLimitInfo(ip) {
    const now = Date.now();
    const windowMs = SECURITY_CONFIG.RATE_LIMIT.windowMs;
    const maxRequests = SECURITY_CONFIG.RATE_LIMIT.max;
    const record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
        return {
            count: 0,
            remaining: maxRequests,
            resetTime: now + windowMs,
            isLimited: false
        };
    }
    return {
        count: record.count,
        remaining: Math.max(0, maxRequests - record.count),
        resetTime: record.resetTime,
        isLimited: record.count >= maxRequests
    };
}
function validateCSRFToken(token, sessionToken) {
    return token === sessionToken && token.length === 64;
}
async function hashPassword(password) {
    const bcrypt = await Promise.resolve().then(()=>__turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [middleware-edge] (ecmascript)"));
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}
async function verifyPassword(password, hash) {
    const bcrypt = await Promise.resolve().then(()=>__turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [middleware-edge] (ecmascript)"));
    return bcrypt.compare(password, hash);
}
}}),
"[project]/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/security.ts [middleware-edge] (ecmascript)");
;
;
// Security configuration
const SECURITY_CONFIG = {
    // Paths that require CSRF protection
    csrfProtectedPaths: [
        '/api/contact',
        '/api/upload',
        '/api/admin'
    ],
    // Paths that require authentication
    protectedPaths: [
        '/admin',
        '/api/admin'
    ],
    // Paths with stricter rate limiting
    strictRateLimitPaths: [
        '/api/contact',
        '/api/upload',
        '/api/auth'
    ],
    // Blocked user agents (bots, scrapers)
    blockedUserAgents: [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python-requests/i
    ],
    // Blocked countries (if needed)
    blockedCountries: [],
    // Suspicious patterns in URLs
    suspiciousPatterns: [
        /\.\./,
        /\/etc\/passwd/,
        /\/proc\//,
        /\bscript\b/i,
        /\bjavascript:/i,
        /\bdata:/i,
        /\bvbscript:/i,
        /\bon\w+=/i,
        /<script/i,
        /\beval\(/i,
        /\balert\(/i
    ]
};
function middleware(request) {
    const { pathname, search } = request.nextUrl;
    const fullUrl = pathname + search;
    const userAgent = request.headers.get('user-agent') || '';
    // Get client IP with multiple fallbacks
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || // Cloudflare
    request.headers.get('x-client-ip') || 'unknown';
    // 1. Block suspicious user agents
    if (SECURITY_CONFIG.blockedUserAgents.some((pattern)=>pattern.test(userAgent))) {
        console.warn(`Blocked suspicious user agent: ${userAgent} from IP: ${ip}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Forbidden', {
            status: 403
        });
    }
    // 2. Check for suspicious URL patterns
    if (SECURITY_CONFIG.suspiciousPatterns.some((pattern)=>pattern.test(fullUrl))) {
        console.warn(`Blocked suspicious URL pattern: ${fullUrl} from IP: ${ip}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Bad Request', {
            status: 400
        });
    }
    // 3. Validate request size (prevent large payload attacks)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
        console.warn(`Blocked large request: ${contentLength} bytes from IP: ${ip}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Payload Too Large', {
            status: 413
        });
    }
    // 4. Apply rate limiting (stricter for sensitive endpoints)
    const isStrictPath = SECURITY_CONFIG.strictRateLimitPaths.some((path)=>pathname.startsWith(path));
    const rateLimitPassed = isStrictPath ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["checkRateLimit"])(ip, {
        windowMs: 15 * 60 * 1000,
        max: 20
    }) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["checkRateLimit"])(ip) // Default rate limiting
    ;
    if (!rateLimitPassed) {
        console.warn(`Rate limit exceeded for IP: ${ip} on path: ${pathname}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Too Many Requests', {
            status: 429,
            headers: {
                'Retry-After': '900',
                'X-RateLimit-Limit': isStrictPath ? '20' : '100',
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': new Date(Date.now() + 15 * 60 * 1000).toISOString()
            }
        });
    }
    // 5. CSRF Protection for state-changing operations
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
        if (SECURITY_CONFIG.csrfProtectedPaths.some((path)=>pathname.startsWith(path))) {
            const csrfToken = request.headers.get('x-csrf-token') || request.headers.get('x-xsrf-token');
            const sessionToken = request.cookies.get('csrf-token')?.value;
            if (!csrfToken || !sessionToken || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["validateCSRFToken"])(csrfToken, sessionToken)) {
                console.warn(`CSRF token validation failed for IP: ${ip} on path: ${pathname}`);
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Forbidden - Invalid CSRF Token', {
                    status: 403
                });
            }
        }
    }
    // 6. Check for SQL injection patterns in query parameters
    const queryString = search.toLowerCase();
    const sqlInjectionPatterns = [
        /union\s+select/i,
        /drop\s+table/i,
        /insert\s+into/i,
        /delete\s+from/i,
        /update\s+set/i,
        /exec\s*\(/i,
        /script\s*>/i,
        /'.*or.*'.*=/i,
        /".*or.*".*=/i
    ];
    if (sqlInjectionPatterns.some((pattern)=>pattern.test(queryString))) {
        console.warn(`Blocked SQL injection attempt: ${queryString} from IP: ${ip}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Bad Request', {
            status: 400
        });
    }
    // 7. Validate HTTP methods
    const allowedMethods = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS'
    ];
    if (!allowedMethods.includes(request.method)) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Method Not Allowed', {
            status: 405
        });
    }
    // 8. Check for path traversal attempts
    if (pathname.includes('../') || pathname.includes('..\\')) {
        console.warn(`Blocked path traversal attempt: ${pathname} from IP: ${ip}`);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]('Bad Request', {
            status: 400
        });
    }
    // Create response and apply security headers
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    // 9. Set comprehensive security headers
    const secureResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$security$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["setSecurityHeaders"])(response);
    // 10. Add additional security headers
    secureResponse.headers.set('X-Request-ID', crypto.randomUUID());
    secureResponse.headers.set('X-Timestamp', new Date().toISOString());
    // 11. Remove server information
    secureResponse.headers.delete('Server');
    secureResponse.headers.delete('X-Powered-By');
    // 12. Set CSRF token for GET requests
    if (request.method === 'GET' && !request.cookies.get('csrf-token')) {
        const csrfToken = crypto.randomUUID();
        secureResponse.cookies.set('csrf-token', csrfToken, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'strict',
            maxAge: 3600
        });
    }
    return secureResponse;
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */ '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1cafd412._.js.map