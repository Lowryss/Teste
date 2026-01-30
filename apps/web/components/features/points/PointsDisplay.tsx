'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PointsDisplayProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
    animateChanges?: boolean
}

export function PointsDisplay({ className, size = 'md', animateChanges = true }: PointsDisplayProps) {
    const { user } = useAuth()
    const points = user?.cosmicPoints || 0
    const [prevPoints, setPrevPoints] = useState(points)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (animateChanges && points !== prevPoints) {
            setIsAnimating(true)
            const timer = setTimeout(() => setIsAnimating(false), 1000)
            setPrevPoints(points)
            return () => clearTimeout(timer)
        }
    }, [points, prevPoints, animateChanges])

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-full font-medium transition-colors',

                // Sizes
                size === 'sm' && 'px-2 py-0.5 text-xs',
                size === 'md' && 'px-3 py-1 text-sm',
                size === 'lg' && 'px-4 py-2 text-base',

                // Styles
                'bg-gold-500/10 border border-gold-500/30 text-gold-400',

                // Animation trigger style
                isAnimating && 'bg-gold-500/30 text-gold-200 border-gold-500',

                className
            )}
        >
            <motion.div
                animate={isAnimating ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Sparkles
                    className={cn(
                        'fill-gold-500/20',
                        size === 'sm' && 'w-3 h-3',
                        size === 'md' && 'w-4 h-4',
                        size === 'lg' && 'w-5 h-5'
                    )}
                />
            </motion.div>

            <motion.span
                key={points}
                initial={animateChanges && isAnimating ? { y: -10, opacity: 0 } : false}
                animate={{ y: 0, opacity: 1 }}
                className="font-bold tabular-nums"
            >
                {points}
            </motion.span>
        </div>
    )
}
