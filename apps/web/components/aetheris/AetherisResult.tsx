'use client'

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import type { AetherisTheme } from './types'
import { AetherisCard } from './AetherisCard'

interface CardData {
  name: string
  position?: string
  symbol?: string
  keywords?: string[]
}

interface AetherisResultProps {
  theme: AetherisTheme
  cards: CardData[]
  content: string
  contentFormat?: 'html' | 'markdown'
  answer?: string      // for yes/no
  onReset: () => void
  resetLabel?: string
}

function getCardSize(count: number): 'sm' | 'md' | 'lg' {
  if (count <= 1) return 'lg'
  if (count <= 3) return 'md'
  return 'sm'
}

function getAnswerColor(answer: string): string {
  const upper = answer.toUpperCase()
  if (upper === 'SIM') return '#22c55e'
  if (upper === 'NÃO' || upper === 'NAO') return '#ef4444'
  return '#eab308'
}

export function AetherisResult({
  theme,
  cards,
  content,
  contentFormat = 'html',
  answer,
  onReset,
  resetLabel = 'Nova Leitura',
}: AetherisResultProps) {
  const cardSize = getCardSize(cards.length)
  const isWeekly = cards.length === 7
  const isYesNo = !!answer

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-6 md:py-12 space-y-8 md:space-y-12"
    >
      {/* Analysis tag */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3"
      >
        <div
          className="px-3 py-1 text-white"
          style={{
            background: theme.accentColor,
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          NEURAL SYNC COMPLETE
        </div>
        <div
          className="h-px flex-1"
          style={{ background: `linear-gradient(90deg, ${theme.accentColor}40, transparent)` }}
        />
      </motion.div>

      {/* Yes/No special display */}
      {isYesNo && answer && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
          className="text-center py-6"
        >
          <h2
            className="text-7xl md:text-9xl font-bold"
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              color: getAnswerColor(answer),
              textShadow: `0 0 60px ${getAnswerColor(answer)}50, 0 0 120px ${getAnswerColor(answer)}25`,
            }}
          >
            {answer}
          </h2>
        </motion.div>
      )}

      {/* Cards display */}
      {isWeekly ? (
        /* Weekly layout: 2 columns */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cards grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="aetheris-glass rounded-xl p-5 md:p-6"
          >
            <h3
              className="mb-4 opacity-50"
              style={{
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: theme.accentColorLight,
              }}
            >
              Cartas da Semana
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-1.5 relative mb-1"
                    style={{
                      background: `linear-gradient(145deg, ${theme.accentColorDark}20, rgba(3,3,8,0.8))`,
                      border: `1px solid ${theme.accentColor}25`,
                    }}
                  >
                    <span
                      className="absolute top-1 left-1.5"
                      style={{
                        fontFamily: 'var(--font-space-mono), monospace',
                        fontSize: '0.45rem',
                        color: theme.accentColor + '60',
                      }}
                    >
                      {card.position}
                    </span>
                    <span className="text-xs opacity-30" style={{ color: theme.accentColor }}>
                      {theme.symbol}
                    </span>
                  </div>
                  <span
                    className="block truncate"
                    style={{
                      fontFamily: 'var(--font-space-mono), monospace',
                      fontSize: '0.5rem',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {card.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interpretation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="aetheris-glass rounded-xl p-5 md:p-8 max-h-[500px] overflow-y-auto"
          >
            <InterpretationContent
              content={content}
              format={contentFormat}
              accentColor={theme.accentColor}
              accentColorLight={theme.accentColorLight}
            />
          </motion.div>
        </div>
      ) : (
        /* Standard layout: cards row + interpretation below */
        <>
          {/* Cards row */}
          <div className={`flex flex-wrap justify-center gap-4 md:gap-6 ${isYesNo ? '' : 'py-4'}`}>
            {cards.map((card, i) => (
              <AetherisCard
                key={i}
                name={card.name}
                position={card.position}
                symbol={card.symbol}
                isRevealed={true}
                theme={theme}
                size={cardSize}
                index={i}
              />
            ))}
          </div>

          {/* Interpretation panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cards.length * 0.2 + 0.8 }}
            className="aetheris-glass p-6 md:p-10"
            style={{ borderRadius: '0 40px 0 0' }}
          >
            <InterpretationContent
              content={content}
              format={contentFormat}
              accentColor={theme.accentColor}
              accentColorLight={theme.accentColorLight}
            />
          </motion.div>
        </>
      )}

      {/* Reset button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: cards.length * 0.2 + 1.2 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={onReset}
          className="group relative px-8 py-3 rounded-full text-sm uppercase tracking-[0.2em] transition-all hover:scale-105"
          style={{
            fontFamily: 'var(--font-space-mono), monospace',
            fontSize: '0.65rem',
            border: `1px solid ${theme.accentColor}30`,
            color: theme.accentColorLight,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.accentColor + '60'
            e.currentTarget.style.boxShadow = `0 0 30px ${theme.accentColor}20`
            e.currentTarget.style.background = theme.accentColor + '10'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.accentColor + '30'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {resetLabel}
        </button>
      </motion.div>
    </motion.div>
  )
}

function InterpretationContent({
  content,
  format,
  accentColor,
  accentColorLight,
}: {
  content: string
  format: 'html' | 'markdown'
  accentColor: string
  accentColorLight: string
}) {
  return (
    <div>
      <div
        className="inline-block px-2.5 py-1 mb-5"
        style={{
          background: accentColor + '15',
          fontFamily: 'var(--font-space-mono), monospace',
          fontSize: '0.5rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: accentColorLight,
        }}
      >
        Interpretação do Oráculo
      </div>

      {format === 'markdown' ? (
        <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-white/75 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-white/90 prose-a:text-white/60">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <div
          className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-white/75 prose-p:leading-relaxed prose-headings:text-white prose-strong:text-white/90"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  )
}
