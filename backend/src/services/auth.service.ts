import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'
import { RegisterDto } from '../interfaces/auth.interface'
import { prisma } from '../lib/prisma'
import { ConflictError, ValidationError, UnauthorizedError, ErrorCode } from '../utils/errors'
import { logInfo } from '../utils/logger'

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

        // Validate password strength
        if (data.password.length < 8) {
            throw new ValidationError('Password must be at least 8 characters long', {
                field: 'password',
                minLength: 8
            })
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 10)

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

        // Generate JWT token
        const token = generateToken({ userId: user.id, role: 'user' })

        logInfo('User registered successfully', {
            userId: user.id,
            username: user.username,
            email: user.email
        })

        return { user, token }
    }

    static async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS)
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated', ErrorCode.ACCOUNT_DEACTIVATED)
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            throw new UnauthorizedError('Invalid email or password', ErrorCode.INVALID_CREDENTIALS)
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        })

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = user

        // Generate JWT token
        const token = generateToken({ userId: user.id, role: user.role })

        logInfo('User logged in successfully', {
            userId: user.id,
            username: user.username
        })

        return { user: userWithoutPassword, token }
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
                createdAt: true
            }
        })

        if (!user) {
            throw new UnauthorizedError('User not found', ErrorCode.NOT_FOUND)
        }

        return user
    }
}

