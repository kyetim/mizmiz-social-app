'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type AmbientBackgroundProps = {
    className?: string
    blur?: number
    intensity?: 'subtle' | 'bold'
}

const blurMap: Record<NonNullable<AmbientBackgroundProps['intensity']>, { light: string; dark: string }> = {
    subtle: { light: 'opacity-20', dark: 'opacity-40' },
    bold: { light: 'opacity-40', dark: 'opacity-80' },
}

export function AmbientBackground({
    className,
    blur = 80,
    intensity = 'bold',
}: AmbientBackgroundProps) {
    return (
        <div className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}>
            <motion.div
                aria-hidden
                initial={{ opacity: 0.75 }}
                animate={{ opacity: [0.7, 0.9, 0.7], rotate: [0, 4, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 18, repeat: Infinity }}
                style={{ filter: `blur(${blur}px)` }}
                className={cn(
                    'radial-gradient-mesh h-full w-full',
                    blurMap[intensity].light,
                    'dark:' + blurMap[intensity].dark,
                    'mix-blend-multiply dark:mix-blend-lighten',
                )}
            />
            <motion.div
                aria-hidden
                initial={{ opacity: 0.35 }}
                animate={{ opacity: [0.3, 0.6, 0.3], rotate: [-3, 2, -3] }}
                transition={{ duration: 22, repeat: Infinity, delay: 4 }}
                style={{ filter: `blur(${blur + 20}px)` }}
                className={cn(
                    'aurora-trace absolute inset-0',
                    blurMap[intensity].light,
                    'dark:' + blurMap[intensity].dark,
                )}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-transparent to-cyan-50/20 dark:from-emerald-500/20 dark:via-transparent dark:to-emerald-900/40" />
        </div>
    )
}


