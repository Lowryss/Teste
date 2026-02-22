'use client'

import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'
import { AetherisOracleCore } from './AetherisOracleCore'

interface AetherisIntroProps {
  theme: AetherisTheme
  onStart: () => void
  loading?: boolean
  description: string
  showQuestionInput?: boolean
  question?: string
  onQuestionChange?: (val: string) => void
  buttonLabel?: string
  featureCards?: Array<{ icon: React.ReactNode; title: string; description: string }>
}

export function AetherisIntro({
  theme,
  onStart,
  loading = false,
  description,
  showQuestionInput = false,
  question = '',
  onQuestionChange,
  buttonLabel,
  featureCards,
}: AetherisIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center py-8 md:py-16 gap-8 md:gap-10"
    >
      {/* Oracle Core as hero */}
      <AetherisOracleCore theme={theme} />

      {/* Title */}
      <div className="space-y-3">
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          {theme.label}
        </h1>
        {theme.subtitle && (
          <p
            className="text-xs md:text-sm tracking-[0.3em] uppercase opacity-40"
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              color: theme.accentColorLight,
            }}
          >
            {theme.subtitle}
          </p>
        )}
      </div>

      {/* Description */}
      <p
        className="text-sm md:text-base max-w-lg leading-relaxed opacity-60 text-white px-4"
        style={{ fontFamily: 'var(--font-syne), sans-serif' }}
      >
        {description}
      </p>

      {/* Feature cards (optional, for semanal) */}
      {featureCards && featureCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl w-full px-4">
          {featureCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="aetheris-glass rounded-xl p-4 text-left"
            >
              <div className="mb-2" style={{ color: theme.accentColor }}>{card.icon}</div>
              <h3
                className="text-white text-sm font-bold mb-1"
                style={{ fontFamily: 'var(--font-syne), sans-serif' }}
              >
                {card.title}
              </h3>
              <p className="text-white/40 text-xs">{card.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Question input (optional, for main tarot) */}
      {showQuestionInput && (
        <div className="w-full max-w-md px-4">
          <label
            className="block text-left mb-2 opacity-40"
            style={{
              fontFamily: 'var(--font-space-mono), monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.accentColorLight,
            }}
          >
            Sua Pergunta (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: O que esperar do meu relacionamento?"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="w-full h-12 px-4 rounded-lg bg-white/[0.03] text-white placeholder:text-white/20 outline-none transition-all focus:ring-1"
            style={{
              border: `1px solid ${theme.accentColor}20`,
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '0.875rem',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = theme.accentColor + '50'
              e.currentTarget.style.boxShadow = `0 0 20px ${theme.accentColor}10`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = theme.accentColor + '20'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>
      )}

      {/* Cost badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: theme.accentColor + '10',
          border: `1px solid ${theme.accentColor}25`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: theme.accentColor }}
        />
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: theme.accentColorLight,
          }}
        >
          {theme.costLabel}
        </span>
      </div>

      {/* CTA Button - circular inspired */}
      <motion.button
        onClick={onStart}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-44 h-44 md:w-48 md:h-48 rounded-full flex items-center justify-center text-center uppercase font-bold tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
        style={{
          border: `1px solid ${theme.accentColor}50`,
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '0.85rem',
          color: 'white',
        }}
      >
        {/* Hover fill */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor}30, ${theme.accentColor}10)`,
          }}
        />

        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${theme.accentColor}20, inset 0 0 20px ${theme.accentColor}10`,
              `0 0 40px ${theme.accentColor}40, inset 0 0 40px ${theme.accentColor}20`,
              `0 0 20px ${theme.accentColor}20, inset 0 0 20px ${theme.accentColor}10`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <span className="relative z-10 leading-tight">
          {loading ? 'Consultando...' : buttonLabel || 'Iniciar\nLeitura'}
        </span>
      </motion.button>
    </motion.div>
  )
}
