'use client'

import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'
import { AetherisOracleCore } from './AetherisOracleCore'

interface AetherisShuffleAnimationProps {
  theme: AetherisTheme
  statusText?: string
}

export function AetherisShuffleAnimation({
  theme,
  statusText = 'Alinhando energias cósmicas...',
}: AetherisShuffleAnimationProps) {
  const cardCount = Math.min(theme.cardCount, 5) // max 5 cards in animation
  const cards = Array.from({ length: cardCount }, (_, i) => i)

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-12">
      {/* Orbital cards around core */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* Cards orbiting */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {cards.map((i) => {
            const angle = (360 / cardCount) * i
            return (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-16 h-24 md:w-20 md:h-28 rounded-lg -mt-12 -ml-8 md:-mt-14 md:-ml-10"
                style={{
                  transform: `rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)`,
                  background: `linear-gradient(145deg, rgba(10,8,30,0.9), rgba(3,3,8,0.95))`,
                  border: `1px solid ${theme.accentColor}30`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 20px ${theme.accentColor}15`,
                }}
                animate={{
                  boxShadow: [
                    `0 4px 20px rgba(0,0,0,0.4), 0 0 20px ${theme.accentColor}15`,
                    `0 4px 20px rgba(0,0,0,0.4), 0 0 40px ${theme.accentColor}30`,
                    `0 4px 20px rgba(0,0,0,0.4), 0 0 20px ${theme.accentColor}15`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {/* Card inner pattern */}
                <div
                  className="absolute inset-1.5 rounded-md flex items-center justify-center"
                  style={{ border: `1px solid ${theme.accentColor}15` }}
                >
                  <span className="text-xs opacity-30" style={{ color: theme.accentColor }}>
                    {theme.symbol}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Central oracle core */}
        <AetherisOracleCore theme={theme} statusText="PROCESSING..." size="sm" />
      </div>

      {/* Status text */}
      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center"
        style={{
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          color: theme.accentColor + '80',
          textTransform: 'uppercase',
        }}
      >
        {statusText}
      </motion.p>
    </div>
  )
}
