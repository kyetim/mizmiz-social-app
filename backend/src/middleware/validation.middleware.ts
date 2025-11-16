import { Request, Response, NextFunction } from 'express'
import { body, ValidationChain, validationResult } from 'express-validator'
import { PASSWORD_REGEX, EMAIL_REGEX, USERNAME_REGEX } from '../config/security.config'
import sanitizeHtml from 'sanitize-html'

/**
 * Input Sanitization Middleware
 * Sanitizes all string inputs to prevent XSS attacks
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body)
    }

    // Sanitize query params
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query)
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeValue(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }

  const sanitized: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key])
    }
  }

  return sanitized
}

/**
 * Sanitize individual value
 */
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Remove all HTML tags and dangerous characters
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard'
    }).trim()
  }
  return value
}

/**
 * Validation error handler
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const formattedErrors: Record<string, string> = {}
    
    errors.array().forEach((error: any) => {
      if (error.path) {
        formattedErrors[error.path] = error.msg
      }
    })

    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: formattedErrors,
    })
    return
  }
  
  next()
}

/**
 * Register validation rules
 */
export const validateRegister: ValidationChain[] = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(USERNAME_REGEX)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .toLowerCase(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    ),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),
]

/**
 * Login validation rules
 */
export const validateLogin: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

/**
 * Post content validation rules
 */
export const validatePost: ValidationChain[] = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Post content must be between 1 and 500 characters'),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid image URL'),
]

/**
 * Comment validation rules
 */
export const validateComment: ValidationChain[] = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 300 })
    .withMessage('Comment content must be between 1 and 300 characters'),
]

/**
 * Profile update validation rules
 */
export const validateProfileUpdate: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Bio must not exceed 160 characters'),

  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),

  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
]

