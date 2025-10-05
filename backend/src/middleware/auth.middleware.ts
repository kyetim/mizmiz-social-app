import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
        // Get token from header
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided'
            })
            return
        }

        const token = authHeader.substring(7) // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token)

            // Attach user info to request
            ; (req as any).user = decoded

        next()
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        })
    }
}

