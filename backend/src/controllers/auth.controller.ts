import { Request, Response, CookieOptions } from 'express'
import { AuthService } from '../services/auth.service'
import { RegisterDto, LoginDto } from '../interfaces/auth.interface'
import { asyncHandler } from '../middleware/error.middleware'
import { securityConfig } from '../config/security.config'

const getCookieClearOptions = (
    cookieConfig: typeof securityConfig.cookie.accessToken
): CookieOptions => {
    const { httpOnly, secure, sameSite, domain, path } = cookieConfig
    const options: CookieOptions = { httpOnly, secure, sameSite, path }
    if (domain) {
        options.domain = domain
    }
    return options
}

const accessTokenClearOptions = getCookieClearOptions(securityConfig.cookie.accessToken)
const refreshTokenClearOptions = getCookieClearOptions(securityConfig.cookie.refreshToken)

export class AuthController {
    /**
     * Register new user
     * Validation is handled by middleware
     */
    static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const data: RegisterDto = req.body

        const result = await AuthService.register(data)

        // Set httpOnly cookies
        res.cookie(
            securityConfig.cookie.accessToken.name,
            result.accessToken,
            securityConfig.cookie.accessToken
        )

        res.cookie(
            securityConfig.cookie.refreshToken.name,
            result.refreshToken,
            securityConfig.cookie.refreshToken
        )

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: result.user }
        })
    })

    /**
     * Login user
     * Validation is handled by middleware
     */
    static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const data: LoginDto = req.body

        // Get user agent and IP for security tracking
        const userAgent = req.headers['user-agent']
        const ipAddress = req.ip || req.connection.remoteAddress

        const result = await AuthService.login(data.email, data.password, userAgent, ipAddress)

        // Set httpOnly cookies
        res.cookie(
            securityConfig.cookie.accessToken.name,
            result.accessToken,
            securityConfig.cookie.accessToken
        )

        res.cookie(
            securityConfig.cookie.refreshToken.name,
            result.refreshToken,
            securityConfig.cookie.refreshToken
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user: result.user }
        })
    })

    /**
     * Refresh access token
     */
    static refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies[securityConfig.cookie.refreshToken.name]

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: 'No refresh token provided'
            })
            return
        }

        const result = await AuthService.refreshAccessToken(refreshToken)

        // Set new access token cookie
        res.cookie(
            securityConfig.cookie.accessToken.name,
            result.accessToken,
            securityConfig.cookie.accessToken
        )

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully'
        })
    })

    /**
     * Logout user
     */
    static logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const refreshToken = req.cookies[securityConfig.cookie.refreshToken.name]

        if (refreshToken) {
            await AuthService.logout(refreshToken)
        }

        // Clear cookies
        res.clearCookie(securityConfig.cookie.accessToken.name, accessTokenClearOptions)
        res.clearCookie(securityConfig.cookie.refreshToken.name, refreshTokenClearOptions)

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        })
    })

    /**
     * Logout from all devices
     */
    static logoutAllDevices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.userId

        await AuthService.logoutAllDevices(userId)

        // Clear cookies
        res.clearCookie(securityConfig.cookie.accessToken.name, accessTokenClearOptions)
        res.clearCookie(securityConfig.cookie.refreshToken.name, refreshTokenClearOptions)

        res.status(200).json({
            success: true,
            message: 'Logged out from all devices'
        })
    })

    /**
     * Get current user
     */
    static getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.userId
        const user = await AuthService.getUserById(userId)

        res.status(200).json({
            success: true,
            data: user
        })
    })
}

