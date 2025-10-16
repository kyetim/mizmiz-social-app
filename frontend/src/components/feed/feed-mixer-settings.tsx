'use client'

import React, { useState, useEffect } from 'react'
import { Sliders, X, Lock } from 'lucide-react'
import { categoriesApi } from '@/lib/api/categories'
import { preferencesApi } from '@/lib/api/preferences'
import { Category, UserCategoryPreference } from '@/interfaces/category.interface'

export function FeedMixerSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [preferences, setPreferences] = useState<
    Map<string, { weight: number; isBlocked: boolean }>
  >(new Map())
  const [mode, setMode] = useState<'normal' | 'soft' | 'focus'>('normal')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cats, prefs] = await Promise.all([
        categoriesApi.getCategories({ isActive: true }),
        preferencesApi.getCategoryPreferences(),
      ])

      setCategories(cats)

      const prefMap = new Map<string, { weight: number; isBlocked: boolean }>()
      prefs.forEach((pref) => {
        prefMap.set(pref.categoryId, {
          weight: pref.weight,
          isBlocked: pref.isBlocked,
        })
      })
      setPreferences(prefMap)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateWeight = (categoryId: string, weight: number) => {
    const current = preferences.get(categoryId) || { weight: 0, isBlocked: false }
    setPreferences(
      new Map(preferences.set(categoryId, { ...current, weight }))
    )
  }

  const toggleBlock = (categoryId: string) => {
    const current = preferences.get(categoryId) || { weight: 0, isBlocked: false }
    setPreferences(
      new Map(preferences.set(categoryId, { ...current, isBlocked: !current.isBlocked }))
    )
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const prefsArray = Array.from(preferences.entries())
        .filter(([_, pref]) => pref.weight > 0 || pref.isBlocked)
        .map(([categoryId, pref]) => ({
          categoryId,
          weight: pref.weight,
          isBlocked: pref.isBlocked,
        }))

      await preferencesApi.setBulkCategoryPreferences(prefsArray)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
      >
        <Sliders className="w-5 h-5" />
        Feed Ayarları
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl m-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎛️ Feed Karışımım
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Görmek istediğin içeriklerin yüzdesini ayarla
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Mode Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Mod Seçimi
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: 'normal',
                      label: 'Normal',
                      desc: 'Tüm içerikler',
                      icon: '🌐',
                    },
                    {
                      value: 'soft',
                      label: 'Yumuşak',
                      desc: 'Sadece pozitif',
                      icon: '😊',
                    },
                    {
                      value: 'focus',
                      label: 'Odaklanma',
                      desc: 'Eğitici içerik',
                      icon: '📚',
                    },
                  ].map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMode(m.value as any)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        mode === m.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{m.icon}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {m.label}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {m.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Weights */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Kategori Ağırlıkları
                </h3>
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const pref = preferences.get(cat.id) || {
                      weight: 0,
                      isBlocked: false,
                    }
                    const isBlocked = pref.isBlocked

                    return (
                      <div
                        key={cat.id}
                        className={`p-4 rounded-xl border ${
                          isBlocked
                            ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {cat.name}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleBlock(cat.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              isBlocked
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-red-600'
                            }`}
                            title={isBlocked ? 'Engeli Kaldır' : 'Engelle'}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        </div>

                        {!isBlocked && (
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={pref.weight}
                              onChange={(e) =>
                                updateWeight(cat.id, parseInt(e.target.value))
                              }
                              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                              {pref.weight}%
                            </span>
                          </div>
                        )}

                        {isBlocked && (
                          <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                            ❌ Bu kategori engellenmiş
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            💡 Engellenmiş kategoriler feed'de görünmez
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

