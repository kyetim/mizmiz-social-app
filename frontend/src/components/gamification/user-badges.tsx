'use client'

import React from 'react'
import { Badge } from '@/interfaces/category.interface'

interface UserBadgesProps {
  badges: Badge[]
  compact?: boolean
}

export function UserBadges({ badges, compact = false }: UserBadgesProps) {
  const earnedBadges = badges.filter((b) => b.earned)

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {earnedBadges.slice(0, 3).map((badge) => (
          <span
            key={badge.id}
            title={`${badge.name} - ${badge.description}`}
            className="text-xl"
          >
            {badge.icon}
          </span>
        ))}
        {earnedBadges.length > 3 && (
          <span className="text-xs text-gray-500">+{earnedBadges.length - 3}</span>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`p-4 rounded-xl border-2 transition-all ${
            badge.earned
              ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
              : 'border-gray-200 dark:border-gray-700 opacity-50 grayscale'
          }`}
        >
          <div className="text-4xl text-center mb-2">{badge.icon}</div>
          <h3 className="font-semibold text-sm text-center text-gray-900 dark:text-white mb-1">
            {badge.name}
          </h3>
          <p className="text-xs text-center text-gray-600 dark:text-gray-400">
            {badge.description}
          </p>
          {badge.earned && badge.earnedAt && (
            <div className="text-xs text-center text-yellow-600 dark:text-yellow-400 mt-2">
              ✓ Kazanıldı
            </div>
          )}
          {!badge.earned && (
            <div className="text-xs text-center text-gray-500 mt-2">
              {badge.requirement}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

