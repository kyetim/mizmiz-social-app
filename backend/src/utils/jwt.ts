import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { securityConfig } from '../config/security.config'

interface JwtPayload {
  userId: string
  role?: string
}

/**
 * Generate Access Token (short-lived, 15 minutes)
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    securityConfig.jwt.accessTokenSecret,
    {
      expiresIn: securityConfig.jwt.accessTokenExpiry as string | number
    } as any
  )
}

/**
 * Generate Refresh Token (long-lived, 7 days)
 * Uses a cryptographically secure random token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, securityConfig.jwt.accessTokenSecret)
    return decoded as JwtPayload
  } catch (error) {
    throw new Error('Invalid or expired access token')
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch (error) {
    return null
  }
}

// Legacy support - keep old function names for compatibility
export const generateToken = generateAccessToken
export const verifyToken = verifyAccessToken

