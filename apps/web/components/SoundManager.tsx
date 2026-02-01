'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'

type SoundContextType = {
    playHover: () => void
    playClick: () => void
    playSuccess: () => void
}

const SoundContext = createContext<SoundContextType | null>(null)

export function useSound() {
    const context = useContext(SoundContext)
    if (!context) return { playHover: () => { }, playClick: () => { }, playSuccess: () => { } }
    return context
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const audioCtx = useRef<AudioContext | null>(null)

    useEffect(() => {
        // Initialize AudioContext on first user interaction to bypass autoplay policy
        const initAudio = () => {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            }
        }
        window.addEventListener('click', initAudio, { once: true })
        window.addEventListener('keydown', initAudio, { once: true })
        return () => {
            window.removeEventListener('click', initAudio)
            window.removeEventListener('keydown', initAudio)
        }
    }, [])

    const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
        if (!audioCtx.current) return
        if (audioCtx.current.state === 'suspended') audioCtx.current.resume()

        const osc = audioCtx.current.createOscillator()
        const gain = audioCtx.current.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime)
        gain.gain.setValueAtTime(vol, audioCtx.current.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration)

        osc.connect(gain)
        gain.connect(audioCtx.current.destination)

        osc.start()
        osc.stop(audioCtx.current.currentTime + duration)
    }

    const playHover = () => {
        // Subtle high pitch 'shimmer'
        playTone(800, 'sine', 0.1, 0.02)
    }

    const playClick = () => {
        // Defined 'glassy' click
        playTone(600, 'sine', 0.15, 0.05)
        setTimeout(() => playTone(1200, 'triangle', 0.1, 0.02), 50)
    }

    const playSuccess = () => {
        // Mystical major chord
        const now = audioCtx.current?.currentTime || 0
        const chord = [440, 554.37, 659.25] // A Major
        chord.forEach((freq, i) => {
            setTimeout(() => playTone(freq, 'sine', 1.5, 0.05), i * 100)
        })
    }

    return (
        <SoundContext.Provider value={{ playHover, playClick, playSuccess }}>
            <GlobalSoundListener playClick={playClick} playHover={playHover} />
            {children}
        </SoundContext.Provider>
    )
}

function GlobalSoundListener({ playClick, playHover }: { playClick: () => void, playHover: () => void }) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('button') || target.closest('a')) {
                playClick()
            }
        }

        const handleHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('button') || target.closest('a')) {
                playHover()
            }
        }

        window.addEventListener('click', handleClick)
        // window.addEventListener('mouseover', handleHover) // Hover might be too noisy, keeping just clicks + manual hovers for now

        return () => {
            window.removeEventListener('click', handleClick)
            // window.removeEventListener('mouseover', handleHover)
        }
    }, [playClick, playHover])

    return null
}
