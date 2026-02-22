'use client'

import { motion } from 'framer-motion'
import type { AetherisTheme } from './types'

interface AetherisCardSelectionProps {
  theme: AetherisTheme
  totalCards: number
  requiredCount: number
  selectedIndices: number[]
  labels: string[]
  onSelect: (index: number) => void
}

export function AetherisCardSelection({
  theme,
  totalCards,
  requiredCount,
  selectedIndices,
  labels,
  onSelect,
}: AetherisCardSelectionProps) {
  return (
    <div className="py-8 md:py-16">
      {/* Title */}
      <div className="text-center mb-8 md:mb-12 space-y-2">
        <h2
          className="text-2xl md:text-3xl font-bold text-white"
          style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
          Escolha {requiredCount} Cartas
        </h2>
        <p
          className="uppercase opacity-40"
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: theme.accentColorLight,
          }}
        >
          Concentre-se na sua semana
        </p>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 max-w-4xl mx-auto px-4">
        {Array.from({ length: totalCards }, (_, i) => {
          const isSelected = selectedIndices.includes(i)
          return (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                onClick={() => onSelect(i)}
                className="aspect-[2/3] rounded-xl relative overflow-hidden cursor-pointer transition-all group"
                style={{
                  background: isSelected
                    ? `linear-gradient(145deg, ${theme.accentColorDark}30, rgba(3,3,8,0.8))`
                    : 'rgba(255,255,255,0.03)',
                  border: isSelected
                    ? `2px solid ${theme.accentColor}60`
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isSelected
                    ? `0 0 30px ${theme.accentColor}20`
                    : 'none',
                }}
              >
                {/* Center indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isSelected ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-lg"
                      style={{ color: theme.accentColor }}
                    >
                      {theme.symbol}
                    </motion.span>
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full transition-transform group-hover:scale-125"
                      style={{ border: `1px solid rgba(255,255,255,0.1)` }}
                    />
                  )}
                </div>

                {/* Day label */}
                <div className="absolute bottom-2.5 inset-x-0 text-center">
                  <span
                    style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.5rem',
                      fontWeight: 'bold',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: isSelected ? theme.accentColorLight : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    {labels[i]}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Counter */}
      <div className="mt-10 text-center">
        <span
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            color: selectedIndices.length === requiredCount
              ? theme.accentColor
              : 'rgba(255,255,255,0.25)',
          }}
        >
          {selectedIndices.length} / {requiredCount} SELECIONADAS
        </span>
      </div>
    </div>
  )
}
