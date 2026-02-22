'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'
import { AetherisBackground } from './AetherisBackground'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AetherisLayoutProps {
  theme: AetherisTheme
  children: React.ReactNode
}

export function AetherisLayout({ theme, children }: AetherisLayoutProps) {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stageRef.current) return
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005
      stageRef.current.style.transform = `perspective(1500px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden -mx-6 -mt-12 px-4 pb-12"
      style={{
        background: '#030308',
        fontFamily: 'var(--font-syne), sans-serif',
      }}
    >
      <AetherisBackground theme={theme} />

      {/* UI Overlay - Top */}
      <div className="relative z-20 pt-6 px-2 md:px-8 flex justify-between items-start">
        {/* Back + Brand */}
        <div className="flex items-start gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors"
            style={{ fontFamily: 'var(--font-space-mono), monospace', fontSize: '0.65rem', letterSpacing: '0.15em' }}
          >
            <ArrowLeft className="w-3 h-3" /> VOLTAR
          </Link>
        </div>

        {/* Data Stream */}
        <div
          className="text-right hidden md:block"
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.25)',
            lineHeight: 1.8,
          }}
        >
          <div>ENGINE: <span style={{ color: theme.accentColor + '80' }}>{theme.oracleLabel}</span></div>
          <div>QUANTUM_STATE: ALIGNED</div>
          <div>NEURAL_SYNC: ACTIVE</div>
        </div>
      </div>

      {/* Main Content Stage with parallax */}
      <div
        ref={stageRef}
        className="relative z-10 transition-transform duration-100 ease-out"
        style={{ transformOrigin: 'center center' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto pt-4 md:pt-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
