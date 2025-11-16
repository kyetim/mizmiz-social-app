'use client'

import { useMemo } from 'react'

interface PasswordStrengthMeterProps {
    password: string
}

interface StrengthResult {
    score: number // 0-4
    label: string
    color: string
    feedback: string[]
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const strength = useMemo(() => calculatePasswordStrength(password), [password])

    if (!password) {
        return null
    }

    return (
        <div className="space-y-2">
            {/* Strength bar */}
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded transition-all duration-300 ${level <= strength.score
                            ? strength.color
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    />
                ))}
            </div>

            {/* Strength label */}
            <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${strength.color.replace('bg-', 'text-')}`}>
                    {strength.label}
                </span>
            </div>

            {/* Feedback */}
            {strength.feedback.length > 0 && (
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    {strength.feedback.map((item, index) => (
                        <li key={index} className="flex items-start gap-1">
                            <span className="text-red-500">×</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

function calculatePasswordStrength(password: string): StrengthResult {
    if (!password) {
        return {
            score: 0,
            label: '',
            color: '',
            feedback: [],
        }
    }

    let score = 0
    const feedback: string[] = []

    // Length check
    if (password.length >= 8) {
        score++
    } else {
        feedback.push('Minimum 8 karakter olmalı')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++
    } else {
        feedback.push('En az 1 büyük harf ekleyin')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++
    } else {
        feedback.push('En az 1 küçük harf ekleyin')
    }

    // Number check
    if (/\d/.test(password)) {
        score++
    } else {
        feedback.push('En az 1 rakam ekleyin')
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
        score++
    } else {
        feedback.push('En az 1 özel karakter ekleyin (@$!%*?&)')
    }

    // Extra length bonus
    if (password.length >= 12) {
        score++
    }

    // Calculate final score (0-4 scale)
    const finalScore = Math.min(Math.floor(score / 1.5), 4)

    // Determine label and color
    let label = ''
    let color = ''

    switch (finalScore) {
        case 0:
        case 1:
            label = 'Çok Zayıf'
            color = 'bg-red-500'
            break
        case 2:
            label = 'Zayıf'
            color = 'bg-orange-500'
            break
        case 3:
            label = 'İyi'
            color = 'bg-yellow-500'
            break
        case 4:
            label = 'Güçlü'
            color = 'bg-green-500'
            break
    }

    return {
        score: finalScore,
        label,
        color,
        feedback,
    }
}

