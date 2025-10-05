import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { RegisterDto, LoginDto } from '../interfaces/auth.interface'

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const data: RegisterDto = req.body

            // Validation
            if (!data.username || !data.email || !data.password) {
                res.status(400).json({
                    success: false,
                    message: 'Username, email and password are required'
                })
                return
            }

            const result = await AuthService.register(data)

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed'
            })
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const data: LoginDto = req.body

            // Validation
            if (!data.email || !data.password) {
                res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                })
                return
            }

            const result = await AuthService.login(data.email, data.password)

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            })
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message || 'Login failed'
            })
        }
    }

    static async logout(_req: Request, res: Response): Promise<void> {
        // JWT is stateless, logout handled on client side
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        })
    }

    static async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user.userId
            const user = await AuthService.getUserById(userId)

            res.status(200).json({
                success: true,
                data: user
            })
        } catch (error: any) {
            res.status(404).json({
                success: false,
                message: error.message || 'User not found'
            })
        }
    }
}

