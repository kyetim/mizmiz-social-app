import bcrypt from 'bcryptjs'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import { RegisterDto } from '../interfaces/auth.interface'
import { prisma } from '../lib/prisma'
import { ConflictError, ValidationError, UnauthorizedError, ErrorCode } from '../utils/errors'
import { logInfo, logWarning } from '../utils/logger'
import { securityConfig, PASSWORD_REGEX } from '../config/security.config'

export class AuthService {
    static async register(data: RegisterDto) {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { username: data.username }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.email === data.email) {
                throw new ConflictError('Email already exists', {
                    field: 'email',
                    value: data.email
                })
            }
            if (existingUser.username === data.username) {
                throw new ConflictError('Username already exists', {
                    field: 'username',
                    value: data.username
                })
            }
        }

        // Validate password strength with regex
        if (!PASSWORD_REGEX.test(data.password)) {
            throw new ValidationError(
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
                {
                    field: 'password',
                    requirements: 'min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char'
                }
            )
        }

        // Hash password with increased salt rounds
        const passwordHash = await bcrypt.hash(data.password, securityConfig.password.saltRounds)

        // Create user
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                bio: true,
                createdAt: true
            }
        })

        // Generate access and refresh tokens
        const accessToken = generateAccessToken({ userId: user.id, role: 'user' })
        const refreshToken = generateRefreshToken()

        // Store refresh token in database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            }
        })

        logInfo('User registered successfully', {
            userId: user.id,
            username: user.username,
            email: user.email
        })

        return { user, accessToken, refreshToken }
    }

    static async login(email: string, password: string, userAgent?: string, ipAddress?: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            logWarning('Login attempt with non-existent email', { email })
            throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS)
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
            logWarning('Login attempt on locked account', {
                userId: user.id,
                email: user.email,
                minutesLeft
            })
            throw new UnauthorizedError(
                `Account is locked due to too many failed login attempts. Please try again in ${minutesLeft} minutes.`,
                ErrorCode.ACCOUNT_LOCKED
            )
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated', ErrorCode.ACCOUNT_DEACTIVATED)
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            // Increment failed login attempts
            const newFailedAttempts = user.failedLoginAttempts + 1
            const maxAttempts = securityConfig.accountLockout.maxFailedAttempts

            // Lock account if max attempts reached
            if (newFailedAttempts >= maxAttempts) {
                const lockUntil = new Date(Date.now() + securityConfig.accountLockout.lockDuration)
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        failedLoginAttempts: newFailedAttempts,
                        lockedUntil: lockUntil
                    }
                })

                logWarning('Account locked due to failed login attempts', {
                    userId: user.id,
                    email: user.email,
                    attempts: newFailedAttempts
                })

                throw new UnauthorizedError(
                    `Account locked due to too many failed login attempts. Please try again in 30 minutes.`,
                    ErrorCode.ACCOUNT_LOCKED
                )
            }

            // Update failed attempts
            await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: newFailedAttempts }
            })

            logWarning('Failed login attempt', {
                userId: user.id,
                email: user.email,
                attempts: newFailedAttempts,
                remainingAttempts: maxAttempts - newFailedAttempts
            })

            throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS)
        }

        // Successful login - reset failed attempts and update last login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null
            }
        })

        // Generate access and refresh tokens
        const accessToken = generateAccessToken({ userId: user.id, role: user.role })
        const refreshToken = generateRefreshToken()

        // Store refresh token in database
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
                userAgent,
                ipAddress
            }
        })

        // Remove sensitive data from response
        const { passwordHash, failedLoginAttempts, lockedUntil, ...userWithoutPassword } = user

        logInfo('User logged in successfully', {
            userId: user.id,
            username: user.username
        })

        return { user: userWithoutPassword, accessToken, refreshToken }
    }

    static async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                bio: true,
                avatarUrl: true,
                coverImageUrl: true,
                location: true,
                website: true,
                isVerified: true,
                followersCount: true,
                followingCount: true,
                postsCount: true,
                createdAt: true,
                gamification: true
            }
        })

        if (!user) {
            throw new UnauthorizedError('User not found', ErrorCode.NOT_FOUND)
        }

        return user
    }

    /**
     * Refresh access token using refresh token
     */
    static async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string }> {
        // Find refresh token in database
        const refreshToken = await prisma.refreshToken.findUnique({
            where: { token: refreshTokenString },
            include: { user: true }
        })

        if (!refreshToken) {
            throw new UnauthorizedError('Invalid refresh token', ErrorCode.INVALID_TOKEN)
        }

        // Check if token is expired
        if (refreshToken.expiresAt < new Date()) {
            // Delete expired token
            await prisma.refreshToken.delete({
                where: { id: refreshToken.id }
            })
            throw new UnauthorizedError('Refresh token expired', ErrorCode.TOKEN_EXPIRED)
        }

        // Check if token is revoked
        if (refreshToken.isRevoked) {
            throw new UnauthorizedError('Refresh token has been revoked', ErrorCode.TOKEN_REVOKED)
        }

        // Check if user is still active
        if (!refreshToken.user.isActive) {
            throw new UnauthorizedError('Account is deactivated', ErrorCode.ACCOUNT_DEACTIVATED)
        }

        // Generate new access token
        const accessToken = generateAccessToken({
            userId: refreshToken.userId,
            role: refreshToken.user.role
        })

        logInfo('Access token refreshed', {
            userId: refreshToken.userId
        })

        return { accessToken }
    }

    /**
     * Logout - revoke refresh token
     */
    static async logout(refreshTokenString: string) {
        try {
            const refreshToken = await prisma.refreshToken.findUnique({
                where: { token: refreshTokenString }
            })

            if (refreshToken) {
                await prisma.refreshToken.update({
                    where: { id: refreshToken.id },
                    data: {
                        isRevoked: true,
                        revokedAt: new Date()
                    }
                })

                logInfo('User logged out', {
                    userId: refreshToken.userId
                })
            }
        } catch (error) {
            // Fail silently - logout should always succeed from user perspective
            logWarning('Logout error', { error })
        }
    }

    /**
     * Logout from all devices - revoke all refresh tokens
     */
    static async logoutAllDevices(userId: string) {
        await prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: {
                isRevoked: true,
                revokedAt: new Date()
            }
        })

        logInfo('User logged out from all devices', { userId })
    }

    /**
     * Clean up expired refresh tokens (run as cron job)
     */
    static async cleanupExpiredTokens() {
        const result = await prisma.refreshToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    {
                        isRevoked: true,
                        revokedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Revoked > 7 days ago
                    }
                ]
            }
        })

        logInfo('Cleaned up expired refresh tokens', { count: result.count })
        return result.count
    }
}

