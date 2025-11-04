import { createLogger, format, transports, Logger } from 'winston'
import path from 'path'

const { combine, timestamp, printf, colorize, errors, json } = format

// Custom log format for console
const consoleFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`

    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`
    }

    // Add stack trace if exists
    if (stack) {
        msg += `\n${stack}`
    }

    return msg
})

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs')

// Development logger
const developmentLogger = (): Logger => {
    return createLogger({
        level: 'debug',
        format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            consoleFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({
                filename: path.join(logsDir, 'error.log'),
                level: 'error'
            }),
            new transports.File({
                filename: path.join(logsDir, 'combined.log')
            }),
        ],
    })
}

// Production logger
const productionLogger = (): Logger => {
    return createLogger({
        level: 'info',
        format: combine(
            timestamp(),
            errors({ stack: true }),
            json()
        ),
        defaultMeta: { service: 'mizmiz-api' },
        transports: [
            new transports.Console({
                format: combine(
                    colorize(),
                    consoleFormat
                ),
            }),
            new transports.File({
                filename: path.join(logsDir, 'error.log'),
                level: 'error',
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
            new transports.File({
                filename: path.join(logsDir, 'combined.log'),
                maxsize: 5242880, // 5MB
                maxFiles: 5,
            }),
        ],
    })
}

// Export logger based on environment
const logger = process.env.NODE_ENV === 'production'
    ? productionLogger()
    : developmentLogger()

// Helper methods for structured logging
export const logError = (message: string, error?: any, metadata?: any) => {
    logger.error(message, {
        error: error?.message || error,
        stack: error?.stack,
        ...metadata,
    })
}

export const logInfo = (message: string, metadata?: any) => {
    logger.info(message, metadata)
}

export const logWarning = (message: string, metadata?: any) => {
    logger.warn(message, metadata)
}

export const logDebug = (message: string, metadata?: any) => {
    logger.debug(message, metadata)
}

export const logHttp = (message: string, metadata?: any) => {
    logger.http(message, metadata)
}

export default logger

