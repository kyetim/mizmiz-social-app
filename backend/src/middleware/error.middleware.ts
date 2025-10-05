import { Request, Response, NextFunction } from 'express'

export function errorMiddleware(
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', error)

    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error'

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    })
}

