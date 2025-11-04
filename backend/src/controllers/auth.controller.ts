import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.service'
import { RegisterDto, LoginDto } from '../interfaces/auth.interface'
import { ValidationError, createValidationError } from '../utils/errors'
import { asyncHandler } from '../middleware/error.middleware'

export class AuthController {
    static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const data: RegisterDto = req.body

        // Validation
        const errors: Record<string, string> = {}
        if (!data.username) errors.username = 'Username is required'
        if (!data.email) errors.email = 'Email is required'
        if (!data.password) errors.password = 'Password is required'

        if (Object.keys(errors).length > 0) {
            throw createValidationError(errors)
        }

        const result = await AuthService.register(data)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        })
    })

    static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const data: LoginDto = req.body

        // Validation
        const errors: Record<string, string> = {}
        if (!data.email) errors.email = 'Email is required'
        if (!data.password) errors.password = 'Password is required'

        if (Object.keys(errors).length > 0) {
            throw createValidationError(errors)
        }

        const result = await AuthService.login(data.email, data.password)

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        })
    })

    static logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
        // JWT is stateless, logout handled on client side
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        })
    })

    static getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.userId
        const user = await AuthService.getUserById(userId)

        res.status(200).json({
            success: true,
            data: user
        })
    })
}

