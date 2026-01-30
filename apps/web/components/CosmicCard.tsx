'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface CosmicCardProps {
    name?: string
    isRevealed: boolean
    className?: string
    index?: number
    onClick?: () => void
}

export function CosmicCard({ name, isRevealed, className = '', index = 0, onClick }: CosmicCardProps) {
    return (
        <div className={`relative w-48 h-80 perspective-1000 ${className}`} onClick={onClick}>
            <motion.div
                className="relative w-full h-full preserve-3d"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Card Back (Sacred Pattern) */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                    <div className="w-full h-full rounded-xl bg-midnight-950 border-2 border-gold-500/30 overflow-hidden relative shadow-2xl shadow-gold-500/10 group hover:scale-[1.02] transition-transform duration-300">
                        {/* Padrão Geométrico (CSS) */}
                        <div className="absolute inset-2 border border-gold-500/20 rounded-lg opacity-50" />
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent" />

                        {/* Detalhe Central */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 border border-gold-500/30 rounded-full flex items-center justify-center transform group-hover:rotate-45 transition-transform duration-700">
                                <div className="w-16 h-16 border border-gold-500/30 rotate-45" />
                            </div>
                        </div>

                        {/* Efeito de Brilho */}
                        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 transform translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                    </div>
                </div>

                {/* Card Front (Revealed) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-midnight-900 to-black border-2 border-gold-400 overflow-hidden relative shadow-[0_0_30px_rgba(251,191,36,0.3)] flex flex-col">
                        {/* Header da Carta */}
                        <div className="h-12 border-b border-gold-500/20 bg-gold-900/10 flex items-center justify-center">
                            <span className="text-gold-200 font-mono text-xs uppercase tracking-[0.2em]">Arcano Principal</span>
                        </div>

                        {/* Corpo/Arte Abstrata */}
                        <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
                            <div className="absolute inset-0 opacity-30 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-gold-900 via-purple-900 to-gold-900 animate-spin-slow" />

                            {/* Placeholder Artístico se não tiver imagem */}
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-display text-transparent bg-clip-text bg-gradient-to-b from-gold-200 to-gold-500 drop-shadow-lg">
                                    {name}
                                </h3>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="h-8 border-t border-gold-500/20 bg-gold-900/10 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
