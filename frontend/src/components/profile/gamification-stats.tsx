'use client'

import { UserGamification } from '@/interfaces/category.interface'
import { GlassmorphismCard } from '@/components/ui/glassmorphism-card'
import { Trophy, Target, Star, Award, Medal } from 'lucide-react'
import { motion } from 'framer-motion'

interface GamificationStatsProps {
    stats?: UserGamification
}

export function GamificationStats({ stats }: GamificationStatsProps) {
    if (!stats) return null

    const items = [
        {
            label: 'Toplam Oy',
            value: stats.totalVotes,
            icon: Star,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            label: 'İsabetli Oylar',
            value: stats.accurateVotes,
            icon: Target,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'Uzmanlık Skoru',
            value: stats.categoryExpertiseScore,
            icon: Trophy,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Sıralama',
            value: stats.rank ? `#${stats.rank}` : '-',
            icon: Medal,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ]

    return (
        <GlassmorphismCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-500" />
                Topluluk Katkıları
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl ${item.bg} border border-transparent hover:border-white/20 transition-colors`}
                    >
                        <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {item.value}
                        </p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {item.label}
                        </p>
                    </motion.div>
                ))}
            </div>

            {stats.badges && stats.badges.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Rozetler</h4>
                    <div className="flex flex-wrap gap-2">
                        {stats.badges.map((badge) => (
                            <div
                                key={badge.id}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                title={badge.description}
                            >
                                <span className="text-lg">{badge.icon}</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GlassmorphismCard>
    )
}
