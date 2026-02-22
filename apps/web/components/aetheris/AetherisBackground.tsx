'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'

function StarField({ accentColor }: { accentColor: string }) {
  const [stars, setStars] = useState<Array<{
    id: number; x: number; y: number; size: number; delay: number; isAccent: boolean
  }>>([])

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 20 : 60

    setStars(Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      isAccent: Math.random() > 0.85,
    })))
  }, [])

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          animate={{
            opacity: [0.1, 0.9, 0.1],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: star.delay,
          }}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.isAccent ? accentColor : 'white',
            boxShadow: star.isAccent
              ? `0 0 ${star.size * 4}px ${star.size * 2}px ${accentColor}40`
              : `0 0 ${star.size * 3}px ${star.size}px rgba(255,255,255,0.3)`,
          }}
        />
      ))}
    </div>
  )
}

export function AetherisBackground({ theme }: { theme: AetherisTheme }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${theme.accentColorDark}15 0%, #030308 70%)`,
        }}
      />

      {/* Nebula 1 - large drifting */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          top: '-15%',
          right: '-10%',
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${theme.accentColor}30, transparent 70%)`,
          filter: 'blur(100px)',
        }}
      />

      {/* Nebula 2 - secondary drift */}
      <motion.div
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 50, -70, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          bottom: '-20%',
          left: '-15%',
          width: 550,
          height: 550,
          background: `radial-gradient(circle, ${theme.accentColorLight}15, transparent 70%)`,
          filter: 'blur(120px)',
        }}
      />

      {/* Star field */}
      <StarField accentColor={theme.accentColor} />

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute rounded-full animate-aetheris-rotate"
          style={{
            width: 500,
            height: 500,
            border: `1px solid ${theme.accentColor}15`,
          }}
        />
        <div
          className="absolute rounded-full animate-aetheris-rotate-reverse"
          style={{
            width: 600,
            height: 600,
            border: `1px dashed ${theme.accentColor}10`,
          }}
        />
        <div
          className="absolute rounded-full animate-aetheris-rotate opacity-30"
          style={{
            width: 900,
            height: 900,
            border: `1px solid ${theme.accentColor}08`,
            animationDuration: '80s',
          }}
        />
      </div>
    </div>
  )
}
