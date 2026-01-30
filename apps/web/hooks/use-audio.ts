"use client";

import { useCallback, useRef, useEffect } from "react";

interface AudioOptions {
    volume?: number;
    loop?: boolean;
}

export function useAudio(src: string, options: AudioOptions = {}) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.volume = options.volume || 1;
        audioRef.current.loop = options.loop || false;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src, options.volume, options.loop]);

    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    const fadeOut = useCallback((duration = 1000) => {
        if (!audioRef.current) return;

        const step = 0.1;
        const intervalTime = duration * step;
        let vol = audioRef.current.volume;

        const interval = setInterval(() => {
            if (!audioRef.current) {
                clearInterval(interval);
                return;
            }
            vol -= step;
            if (vol <= 0) {
                vol = 0;
                audioRef.current.pause();
                clearInterval(interval);
            }
            audioRef.current.volume = vol;
        }, intervalTime);
    }, []);

    return { play, stop, fadeOut };
}
