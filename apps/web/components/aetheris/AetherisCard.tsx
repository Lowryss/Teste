'use client'

import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'

interface AetherisCardProps {
  name?: string
  position?: string
  symbol?: string
  isRevealed: boolean
  theme: AetherisTheme
  size?: 'sm' | 'md' | 'lg'
  index?: number
  onClick?: () => void
  className?: string
}

const sizes = {
  sm: { w: 'w-28 md:w-32', h: 'h-44 md:h-48', text: 'text-sm', label: 'text-[8px]' },
  md: { w: 'w-36 md:w-44', h: 'h-56 md:h-68', text: 'text-lg', label: 'text-[9px]' },
  lg: { w: 'w-48 md:w-56', h: 'h-72 md:h-88', text: 'text-2xl', label: 'text-[10px]' },
}

export function AetherisCard({
  name,
  position,
  symbol,
  isRevealed,
  theme,
  size = 'md',
  index = 0,
  onClick,
  className = '',
}: AetherisCardProps) {
  const s = sizes[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: isRevealed ? 90 : 0 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        delay: index * 0.2 + 0.3,
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      }}
      onClick={onClick}
      className={`${s.w} ${s.h} cursor-default ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div
            className="w-full h-full rounded-xl flex items-center justify-center relative"
            style={{
              background: `linear-gradient(145deg, rgba(10,8,30,0.9), rgba(3,3,8,0.95))`,
              border: `1px solid ${theme.accentColor}25`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px ${theme.accentColor}08`,
            }}
          >
            {/* Geometric pattern */}
            <div
              className="absolute inset-3 rounded-lg"
              style={{ border: `1px solid ${theme.accentColor}15` }}
            />
            <div
              className="absolute w-16 h-16 rounded-full"
              style={{ border: `1px solid ${theme.accentColor}20` }}
            />
            <div
              className="absolute w-10 h-10 rotate-45"
              style={{ border: `1px solid ${theme.accentColor}15` }}
            />
            {/* Center symbol */}
            <span
              className="text-2xl opacity-30 animate-aetheris-pulse"
              style={{ color: theme.accentColor }}
            >
              {theme.symbol}
            </span>
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `linear-gradient(105deg, transparent 40%, ${theme.accentColor}10 50%, transparent 60%)`,
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            />
          </div>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div
            className="w-full h-full rounded-xl flex flex-col items-center justify-center p-4 relative"
            style={{
              background: `linear-gradient(160deg, ${theme.accentColorDark}15, rgba(3,3,8,0.95) 50%, ${theme.accentColor}08)`,
              border: `1px solid ${theme.accentColor}40`,
              boxShadow: `0 0 40px ${theme.accentColor}20, 0 12px 40px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}60, transparent)` }}
            />

            {/* Symbol */}
            {symbol && (
              <span className="text-2xl mb-2" style={{ color: theme.accentColor }}>
                {symbol}
              </span>
            )}

            {/* Position label */}
            {position && (
              <span
                className={`${s.label} uppercase tracking-[0.25em] mb-2 opacity-50`}
                style={{ fontFamily: 'var(--font-space-mono), monospace', color: theme.accentColorLight }}
              >
                {position}
              </span>
            )}

            {/* Card name */}
            {name && (
              <h3
                className={`${s.text} font-bold text-center text-white`}
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                {name}
              </h3>
            )}

            {/* Bottom accent line */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 h-px w-1/3"
              style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}40, transparent)` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
