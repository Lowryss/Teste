"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useHaptics } from "@/hooks/use-haptics";
import { useAudio } from "@/hooks/use-audio";

interface TarotCardProps {
    reveal: boolean;
    title?: string;
    description?: string;
    onClick?: () => void;
    className?: string;
}

export default function TarotCard({ reveal, title, description, onClick, className = "" }: TarotCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { triggerHaptic } = useHaptics();
    const { play: playFlip } = useAudio('/sounds/flip.mp3', { volume: 0.6 });
    const { play: playReveal } = useAudio('/sounds/reveal.mp3', { volume: 0.4 });

    // Typewriter effect for description
    const typewriterVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.5, // Wait for card flip
                staggerChildren: 0.02, // Fast reveal per letter
            },
        },
    };

    const letterVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const handleClick = () => {
        if (!reveal) {
            playFlip();
            setTimeout(() => playReveal(), 400); // Play reveal sound as card faces user
            triggerHaptic(20);
        }
        if (onClick) onClick();
    }

    return (
        <div
            className={`relative w-64 h-96 cursor-pointer perspective-1000 ${className}`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-transform duration-700"
                animate={{
                    rotateY: reveal ? 180 : 0,
                    y: reveal ? 0 : [0, -10, 0] // Breathing/Floating effect when not revealed
                }}
                transition={{
                    rotateY: { duration: 0.7 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Card Back (Mystical Pattern) */}
                <div className="absolute inset-0 backface-hidden rounded-xl bg-midnight-900 border border-magenta-50/20 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-magenta-900 via-transparent to-transparent" />
                    {/* Geometric Pattern Placeholder */}
                    <div className="w-48 h-72 border border-magenta-50/10 rounded-lg flex items-center justify-center relative">
                        <div className="w-32 h-32 border border-magenta-50/10 rounded-full flex items-center justify-center">
                            <div className="w-24 h-24 border border-magenta-50/10 rotate-45" />
                        </div>
                    </div>
                </div>

                {/* Card Front (Revelation) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl bg-paper-100 p-6 flex flex-col items-center justify-between text-center border border-magenta-50/10 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: 'linear-gradient(135deg, hsl(320, 20%, 97%) 0%, hsl(320, 10%, 92%) 100%)'
                    }}
                >

                    {/* Title & Meaning */}
                    <div className="text-center mb-6">
                        <h3 className="font-display text-2xl font-bold tracking-tight text-midnight-900 mb-2 uppercase">{title || "O Desconhecido"}</h3>

                        {/* Typewriter Description */}
                        <motion.div
                            className="font-body text-xs leading-relaxed text-midnight-600 min-h-[4rem]"
                            variants={typewriterVariants}
                            initial="hidden"
                            animate={reveal ? "visible" : "hidden"}
                        >
                            {(description || "As cartas são silenciosas para que você encontre suas próprias respostas no silêncio.").split("").map((char, i) => (
                                <motion.span key={i} variants={letterVariants}>
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
