import { Request, Response, NextFunction } from 'express'
import logger, { logHttp } from '../utils/logger'

/**
 * HTTP Request Logger Middleware
 * Logs all incoming requests with timing information
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now()

    // Log request
    logHttp(`${req.method} ${req.path}`, {
        method: req.method,
        path: req.path,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: (req as any).user?.userId,
    })

    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - startTime
        const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http'

        logger.log(logLevel, `${req.method} ${req.path} - ${res.statusCode}`, {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userId: (req as any).user?.userId,
        })
    })

    next()
}

