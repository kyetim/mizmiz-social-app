'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🔴 React Error Boundary caught an error:')
            console.error('Error:', error)
            console.error('Error Info:', errorInfo)
        }

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo)

        this.setState({
            error,
            errorInfo,
        })
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="max-w-md w-full">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
                                Bir Şeyler Ters Gitti
                            </h1>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
                            </p>

                            {/* Error Details (Development only) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-xs font-mono text-red-800 dark:text-red-300 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="text-xs text-red-700 dark:text-red-400 cursor-pointer">
                                                Stack Trace
                                            </summary>
                                            <pre className="mt-2 text-xs text-red-700 dark:text-red-400 overflow-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Tekrar Dene
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Ana Sayfaya Dön
                                </Button>
                            </div>

                            {/* Support Message */}
                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-6">
                                Sorun devam ederse lütfen destek ekibimizle iletişime geçin.
                            </p>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

/**
 * Simple Error Fallback Component
 */
export function SimpleErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bir Hata Oluştu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                {error.message || 'Beklenmeyen bir hata oluştu'}
            </p>
            <Button onClick={reset} variant="outline">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Tekrar Dene
            </Button>
        </div>
    )
}

export default ErrorBoundary

