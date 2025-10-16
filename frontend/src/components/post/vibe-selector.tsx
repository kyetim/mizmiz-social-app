'use client'

import React, { useState, useEffect } from 'react'
import { vibesApi } from '@/lib/api/vibes'
import { Vibe } from '@/interfaces/category.interface'

interface VibeSelectorProps {
  postId?: string
  selectedVibes: string[]
  onChange: (vibes: string[]) => void
  maxSelection?: number
}

export function VibeSelector({
  postId,
  selectedVibes,
  onChange,
  maxSelection = 3,
}: VibeSelectorProps) {
  const [vibes, setVibes] = useState<Vibe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVibes()
  }, [])

  const loadVibes = async () => {
    try {
      const data = await vibesApi.getVibes(true)
      setVibes(data)
    } catch (error) {
      console.error('Failed to load vibes:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleVibe = (vibeId: string) => {
    if (selectedVibes.includes(vibeId)) {
      onChange(selectedVibes.filter((id) => id !== vibeId))
    } else if (selectedVibes.length < maxSelection) {
      onChange([...selectedVibes, vibeId])
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Yükleniyor...</div>
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Vibe Seç (Opsiyonel)
        <span className="text-xs text-gray-500 ml-2">
          En fazla {maxSelection} tane
        </span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {vibes.map((vibe) => {
          const isSelected = selectedVibes.includes(vibe.id)
          return (
            <button
              key={vibe.id}
              type="button"
              onClick={() => toggleVibe(vibe.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
              disabled={!isSelected && selectedVibes.length >= maxSelection}
            >
              <span className="text-3xl">{vibe.icon}</span>
              <span className="text-xs font-medium text-center text-gray-900 dark:text-white">
                {vibe.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

