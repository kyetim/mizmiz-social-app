import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwt'
import { RegisterDto } from '../interfaces/auth.interface'
import { prisma } from '../lib/prisma'

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
                throw new Error('Email already exists')
            }
            if (existingUser.username === data.username) {
                throw new Error('Username already exists')
            }
        }

        // Validate password strength
        if (data.password.length < 8) {
            throw new Error('Password must be at least 8 characters long')
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

        return { user, token }
    }

    static async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('Invalid email or password')
        }

        // Check if user is active
        if (!user.isActive) {
            throw new Error('Account is deactivated')
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash)

        if (!isValidPassword) {
            throw new Error('Invalid email or password')
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
            throw new Error('User not found')
        }

        return user
    }
}

