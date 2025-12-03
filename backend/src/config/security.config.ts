/**
 * Security Configuration
 * Production-ready security settings
 */

const sameSiteValues = ['strict', 'lax', 'none'] as const
type SameSiteOption = (typeof sameSiteValues)[number]

const isProduction = process.env.NODE_ENV === 'production'

const resolveSameSite = (): SameSiteOption => {
  const envValue = process.env.COOKIE_SAMESITE?.toLowerCase() as SameSiteOption | undefined

  if (envValue && sameSiteValues.includes(envValue)) {
    return envValue
  }

  // Cross-site deployments (e.g., Vercel frontend + separate API) require SameSite=None
  // However, SameSite=None REQUIRES Secure=true.
  // If we are not secure (e.g. local dev on IP), we MUST use 'lax' or 'strict'.
  // For mobile devices accessing local API via IP, we need 'lax'.
  if (!isSecure) {
    return 'lax'
  }

  return isProduction ? 'none' : 'lax'
}

const cookieDomain = process.env.COOKIE_DOMAIN?.trim() || undefined

// Determine secure flag - must be false in development for mobile to work
// In production, secure should be true (HTTPS required)
const isSecure = isProduction && process.env.NODE_ENV !== 'development'

const baseCookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: resolveSameSite(),
  // Mobile-friendly: ensure cookies work across different contexts
  // Don't set domain in development - let browser handle it
  // Only set domain if explicitly provided and in production
  ...(cookieDomain && isProduction ? { domain: cookieDomain } : {}),
  // Path should be root to ensure cookies are accessible everywhere
  path: '/',
}

export const securityConfig = {
  // JWT Configuration
  jwt: {
    accessTokenSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this',
    accessTokenExpiry: (process.env.JWT_EXPIRES_IN || '15m') as string, // 15 minutes
    refreshTokenExpiry: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string, // 7 days
  },

  // Cookie Configuration
  cookie: {
    accessToken: {
      name: 'accessToken',
      ...baseCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    },
    refreshToken: {
      name: 'refreshToken',
      ...baseCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12, // bcrypt rounds (increased from 10)
  },

  // Rate Limiting
  rateLimit: {
    // General API rate limit
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
      message: 'Too many requests, please try again later',
    },
    // Login endpoint rate limit
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // 10 failed login attempts per window (successful logins don't count)
      message: 'Too many login attempts, please try again after 15 minutes',
    },
    // Register endpoint rate limit
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 registrations per hour per IP
      message: 'Too many registration attempts, please try again later',
    },
    // Password reset rate limit
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 attempts per hour
      message: 'Too many password reset attempts, please try again later',
    },
  },

  // Account Lockout Policy
  accountLockout: {
    maxFailedAttempts: 5,
    lockDuration: 30 * 60 * 1000, // 30 minutes
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL
      ? [process.env.FRONTEND_URL.replace(/\/$/, '')]
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  },

  // Helmet Security Headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },

  // Input Sanitization
  sanitization: {
    allowedTags: [], // No HTML tags allowed by default
    allowedAttributes: {},
    allowedSchemes: ['http', 'https'],
  },
}

// Password validation regex
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Username validation regex (alphanumeric and underscore only)
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/

