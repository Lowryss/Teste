'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'framer-motion'

export function BackgroundAmbience() {
    const [isMuted, setIsMuted] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Tenta iniciar o áudio automaticamente com volume baixo
        if (audioRef.current) {
            audioRef.current.volume = 0.2
            audioRef.current.play().catch(() => {
                // Autoplay bloqueado pelo navegador
                setIsMuted(true)
            })
        }
    }, [])

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.play()
                audioRef.current.muted = false
            } else {
                audioRef.current.muted = true
            }
            setIsMuted(!isMuted)
        }
    }

    return (
        <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <audio
                ref={audioRef}
                loop
                src="https://cdn.pixabay.com/audio/2022/10/05/audio_68629e7695.mp3" // 'Cosmic Drift' placeholder
            />
            <button
                onClick={toggleMute}
                className="bg-midnight-900/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-midnight-800 transition-all"
                title={isMuted ? "Ativar Som Ambiente" : "Mutar Som Ambiente"}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </motion.div>
    )
}
