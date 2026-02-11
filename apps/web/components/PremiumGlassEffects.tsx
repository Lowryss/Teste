'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

// Premium Glass Card with Advanced Effects
export function PremiumGlassCard({
    children,
    className = '',
    glowColor = 'magenta',
    intensity = 'medium'
}: {
    children: React.ReactNode
    className?: string
    glowColor?: 'magenta' | 'purple' | 'cyan' | 'gold' | 'rose' | 'emerald'
    intensity?: 'low' | 'medium' | 'high'
}) {
    const glowColors = {
        magenta: 'from-magenta-500/20 via-pink-500/10 to-purple-500/20',
        purple: 'from-purple-500/20 via-violet-500/10 to-indigo-500/20',
        cyan: 'from-cyan-500/20 via-teal-500/10 to-emerald-500/20',
        gold: 'from-amber-500/20 via-yellow-500/10 to-orange-500/20',
        rose: 'from-rose-500/20 via-pink-500/10 to-red-500/20',
        emerald: 'from-emerald-500/20 via-green-500/10 to-teal-500/20'
    }

    const intensityClasses = {
        low: 'backdrop-blur-sm bg-white/5',
        medium: 'backdrop-blur-md bg-white/10',
        high: 'backdrop-blur-xl bg-white/15'
    }

    return (
        <motion.div
            className={`relative group ${className}`}
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Animated glow border */}
            <motion.div
                className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-br ${glowColors[glowColor]} opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500`}
                animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Glass effect with shimmer */}
            <div className={`relative ${intensityClasses[intensity]} rounded-2xl border border-white/20 shadow-2xl shadow-black/50 overflow-hidden`}>
                {/* Shimmer effect */}
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${glowColors[glowColor]} opacity-20`}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                />

                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30" />

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

// Holographic Card Effect
export function HolographicCard({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
    }

    return (
        <motion.div
            className={`relative group ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Holographic gradient that follows mouse */}
            {isHovered && (
                <motion.div
                    className="absolute -inset-[2px] rounded-2xl opacity-60 blur-xl"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,0,255,0.4), rgba(0,255,255,0.3), transparent 60%)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                />
            )}

            {/* Glass card */}
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Rainbow reflection */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: `linear-gradient(135deg,
                            rgba(255,0,255,0.15) 0%,
                            rgba(0,255,255,0.15) 25%,
                            rgba(255,255,0,0.15) 50%,
                            rgba(255,0,255,0.15) 75%,
                            rgba(0,255,255,0.15) 100%)`,
                        backgroundSize: '400% 400%'
                    }}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

// Floating Crystal Effect
export function FloatingCrystal({
    size = 'md',
    color = 'magenta'
}: {
    size?: 'sm' | 'md' | 'lg'
    color?: 'magenta' | 'cyan' | 'gold' | 'purple'
}) {
    const sizes = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    }

    const colors = {
        magenta: 'from-magenta-500 via-pink-500 to-purple-500',
        cyan: 'from-cyan-500 via-teal-500 to-blue-500',
        gold: 'from-amber-500 via-yellow-500 to-orange-500',
        purple: 'from-purple-500 via-violet-500 to-indigo-500'
    }

    return (
        <motion.div
            className={`relative ${sizes[size]}`}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <motion.div
                className={`w-full h-full bg-gradient-to-br ${colors[color]} opacity-60 blur-2xl absolute`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <div
                className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-80`}
                style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
            />
        </motion.div>
    )
}

// Animated Border Beam
export function BorderBeam({
    children,
    className = '',
    color = 'magenta',
    duration = 3
}: {
    children: React.ReactNode
    className?: string
    color?: 'magenta' | 'cyan' | 'gold' | 'purple'
    duration?: number
}) {
    const colors = {
        magenta: ['#FF00FF', '#FF69B4', '#FF00FF'],
        cyan: ['#00FFFF', '#40E0D0', '#00FFFF'],
        gold: ['#FFD700', '#FFA500', '#FFD700'],
        purple: ['#9333EA', '#C084FC', '#9333EA']
    }

    return (
        <div className={`relative ${className}`}>
            {/* Animated border */}
            <motion.div
                className="absolute -inset-[2px] rounded-2xl"
                style={{
                    background: `linear-gradient(90deg, ${colors[color].join(', ')})`,
                    backgroundSize: '200% 100%'
                }}
                animate={{
                    backgroundPosition: ['0% 50%', '200% 50%'],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <div className="relative backdrop-blur-md bg-midnight-900/80 rounded-2xl border border-white/10 overflow-hidden">
                {children}
            </div>
        </div>
    )
}

// Frosted Glass Panel
export function FrostedGlass({
    children,
    className = '',
    blur = 'medium'
}: {
    children: React.ReactNode
    className?: string
    blur?: 'light' | 'medium' | 'heavy'
}) {
    const blurLevels = {
        light: 'backdrop-blur-sm',
        medium: 'backdrop-blur-md',
        heavy: 'backdrop-blur-xl'
    }

    return (
        <div className={`relative ${className}`}>
            <div className={`${blurLevels[blur]} bg-white/5 rounded-2xl border border-white/10 shadow-xl`}>
                {/* Frost texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl" />

                {/* Light refraction effect */}
                <motion.div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl"
                    animate={{
                        x: [0, 20, 0],
                        y: [0, 10, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

// Neon Glow Text
export function NeonText({
    children,
    color = 'magenta',
    className = ''
}: {
    children: React.ReactNode
    color?: 'magenta' | 'cyan' | 'gold' | 'purple' | 'green'
    className?: string
}) {
    const colors = {
        magenta: 'text-magenta-400 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]',
        cyan: 'text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]',
        gold: 'text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]',
        purple: 'text-purple-400 drop-shadow-[0_0_15px_rgba(147,51,234,0.8)]',
        green: 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]'
    }

    return (
        <motion.span
            className={`${colors[color]} font-bold ${className}`}
            animate={{
                textShadow: [
                    '0 0 10px currentColor',
                    '0 0 20px currentColor',
                    '0 0 10px currentColor'
                ]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {children}
        </motion.span>
    )
}
