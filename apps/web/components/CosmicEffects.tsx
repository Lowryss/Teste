'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Animated Gradient Orbs Background
export function CosmicBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-midnight-950 via-purple-950/50 to-midnight-950" />

            {/* Animated nebula orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-magenta-600/20 via-purple-600/10 to-transparent blur-[100px]"
            />

            <motion.div
                animate={{
                    x: [0, -80, 40, 0],
                    y: [0, 60, -80, 0],
                    scale: [1, 0.9, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-[-30%] left-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-purple-700/20 via-indigo-600/10 to-transparent blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -40, 60, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-600/10 via-rose-500/5 to-transparent blur-[80px]"
            />

            {/* Star field */}
            <StarField />
        </div>
    )
}

// Floating Stars Effect
function StarField() {
    const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

    useEffect(() => {
        const newStars = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 5
        }))
        setStars(newStars)
    }, [])

    return (
        <div className="absolute inset-0">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: star.delay,
                    }}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255,255,255,0.3)`
                    }}
                />
            ))}
        </div>
    )
}

// Animated Gradient Border Card
export function GlowCard({
    children,
    className = '',
    glowColor = 'magenta'
}: {
    children: React.ReactNode
    className?: string
    glowColor?: 'magenta' | 'purple' | 'cyan' | 'gold' | 'rose'
}) {
    const glowColors = {
        magenta: 'from-magenta-500 via-pink-500 to-purple-500',
        purple: 'from-purple-500 via-violet-500 to-indigo-500',
        cyan: 'from-cyan-500 via-teal-500 to-emerald-500',
        gold: 'from-amber-500 via-yellow-500 to-orange-500',
        rose: 'from-rose-500 via-pink-500 to-red-500'
    }

    return (
        <motion.div
            className={`relative group ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {/* Animated gradient border */}
            <motion.div
                className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${glowColors[glowColor]} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
            />
            <div className="relative bg-midnight-900/90 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                {children}
            </div>
        </motion.div>
    )
}

// Animated Gradient Button
export function GradientButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false
}: {
    children: React.ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'gold' | 'cosmic'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    disabled?: boolean
}) {
    const variants = {
        primary: 'from-magenta-600 via-pink-600 to-purple-600 hover:from-magenta-500 hover:via-pink-500 hover:to-purple-500',
        secondary: 'from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500',
        gold: 'from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400',
        cosmic: 'from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400'
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    }

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`
                relative overflow-hidden rounded-lg font-semibold text-white
                bg-gradient-to-r ${variants[variant]}
                shadow-lg shadow-magenta-500/25
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizes[size]}
                ${className}
            `}
        >
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    )
}

// Floating Particles Effect
export function FloatingParticles({ count = 30, color = 'magenta' }: { count?: number, color?: string }) {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; duration: number; delay: number; size: number }>>([])

    useEffect(() => {
        setParticles(Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            duration: 10 + Math.random() * 20,
            delay: Math.random() * 10,
            size: 2 + Math.random() * 4
        })))
    }, [count])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        bottom: '-10%',
                        width: p.size,
                        height: p.size,
                        background: color.startsWith('#') ? color : `var(--color-${color}-400, rgba(255,255,255,0.3))`,
                        boxShadow: `0 0 ${p.size * 2}px ${color.startsWith('#') ? color : 'rgba(255,255,255,0.3)'}`
                    }}
                    animate={{
                        y: [0, -window.innerHeight * 1.2],
                        opacity: [0, 0.8, 0],
                        x: [0, Math.random() * 100 - 50],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    )
}

// Pulsing Glow Ring
export function GlowRing({
    children,
    color = 'magenta',
    size = 'md'
}: {
    children: React.ReactNode
    color?: 'magenta' | 'purple' | 'gold' | 'cyan' | 'rose'
    size?: 'sm' | 'md' | 'lg'
}) {
    const colors = {
        magenta: 'shadow-magenta-500/50',
        purple: 'shadow-purple-500/50',
        gold: 'shadow-amber-500/50',
        cyan: 'shadow-cyan-500/50',
        rose: 'shadow-rose-500/50'
    }

    const sizes = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-24 h-24'
    }

    return (
        <div className="relative">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full ${colors[color]} blur-xl`}
            />
            <div className={`relative ${sizes[size]} rounded-full bg-gradient-to-br from-midnight-800 to-midnight-900 border border-white/10 flex items-center justify-center`}>
                {children}
            </div>
        </div>
    )
}

// Animated Text with Gradient
export function GradientText({
    children,
    className = '',
    animate = true
}: {
    children: React.ReactNode
    className?: string
    animate?: boolean
}) {
    return (
        <motion.span
            className={`bg-gradient-to-r from-magenta-300 via-pink-300 to-purple-300 bg-clip-text text-transparent ${className}`}
            style={animate ? { backgroundSize: '200% 200%' } : {}}
            animate={animate ? {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            } : {}}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            {children}
        </motion.span>
    )
}

// Mystical Loading Spinner
export function CosmicSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    }

    return (
        <div className={`relative ${sizes[size]}`}>
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-magenta-500 border-r-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-pink-500 border-l-cyan-500"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-4 rounded-full bg-gradient-to-r from-magenta-500/20 to-purple-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
        </div>
    )
}
