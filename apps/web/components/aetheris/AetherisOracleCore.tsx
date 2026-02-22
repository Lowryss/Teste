'use client'

import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'

interface AetherisOracleCoreProps {
  theme: AetherisTheme
  statusText?: string
  size?: 'sm' | 'md'
}

export function AetherisOracleCore({
  theme,
  statusText,
  size = 'md',
}: AetherisOracleCoreProps) {
  const dimensions = size === 'md' ? 'w-52 h-52' : 'w-36 h-36'
  const ringOuter = size === 'md' ? 'w-64 h-64' : 'w-44 h-44'
  const ringDashed = size === 'md' ? 'w-72 h-72' : 'w-52 h-52'

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating ring */}
      <div
        className={`absolute ${ringDashed} rounded-full animate-aetheris-rotate`}
        style={{
          border: `1px dashed ${theme.accentColor}25`,
          animationDuration: '20s',
        }}
      />

      {/* Inner rotating ring */}
      <div
        className={`absolute ${ringOuter} rounded-full animate-aetheris-rotate-reverse`}
        style={{
          border: `1px solid ${theme.accentColor}30`,
          animationDuration: '15s',
        }}
      />

      {/* Core orb */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`relative ${dimensions} rounded-full flex items-center justify-center`}
        style={{
          background: `radial-gradient(circle, white 0%, ${theme.accentColor} 25%, transparent 70%)`,
          boxShadow: `0 0 60px ${theme.accentColor}60, 0 0 120px ${theme.accentColor}30`,
        }}
      >
        {/* Inner circle with backdrop */}
        <div
          className="w-[80%] h-[80%] rounded-full flex flex-col items-center justify-center gap-2"
          style={{
            background: 'rgba(3,3,8,0.7)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.accentColor}30`,
          }}
        >
          <span
            className="text-[0.6rem] tracking-[0.4em] uppercase"
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              color: theme.accentColor,
            }}
          >
            {theme.oracleLabel}
          </span>

          <span className="text-2xl" style={{ color: theme.accentColor }}>
            {theme.symbol}
          </span>

          <span
            className="text-[0.45rem] tracking-[0.2em] uppercase opacity-50"
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              color: theme.accentColorLight,
            }}
          >
            {statusText || theme.oracleStatus}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
