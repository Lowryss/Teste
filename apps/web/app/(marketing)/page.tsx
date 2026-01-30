"use client";

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Moon, Star } from 'lucide-react'
import TarotCard from '@/components/TarotCard'
import MagneticWrapper from '@/components/MagneticWrapper'
import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function LandingPage() {
    const [cardRevealed, setCardRevealed] = useState(false);

    // Scroll Effects
    const { scrollY } = useScroll();
    const fogOpacity = useTransform(scrollY, [0, 500], [0, 0.8]);

    // Staggered Text Animation
    const sentence = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.2,
                staggerChildren: 0.1, // Stagger letter reveal
            },
        },
    };

    const letter = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] as const }, // Custom ease cast as const
        },
    };

    const titleWords = ["Revele", "Seu", "Destino"];

    return (
        <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 container mx-auto pt-20 lg:pt-10 gap-12 lg:gap-0">

                {/* Left Column: Typography */}
                <div className="flex-1 z-10 text-center lg:text-left w-full">
                    <motion.h1
                        className="font-display font-light leading-[0.9] tracking-tighter"
                        variants={sentence}
                        initial="hidden"
                        animate="visible"
                    >
                        {titleWords.map((word, i) => (
                            <span key={i} className={`block text-[15vw] lg:text-[10rem] ${i === 1 ? 'text-magenta-200/80 italic ml-0 lg:ml-24' : 'text-magenta-50 mix-blend-exclusion'}`}>
                                {word.split("").map((char, charIndex) => (
                                    <motion.span key={`${word}-${charIndex}`} variants={letter} className="inline-block">
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="mt-8 max-w-md mx-auto lg:mx-0 text-sm md:text-base text-magenta-200/60 font-mono tracking-wide leading-relaxed"
                    >
                        Sabedoria ancestral encontra inteligência artificial. <br />
                        As estrelas escreveram uma história. <br />
                        É hora de lê-la.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-10 flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center"
                    >
                        <Link href="/register">
                            <MagneticWrapper strength={0.3}>
                                <Button size="lg" className="rounded-none bg-magenta-50 text-midnight-950 hover:bg-white font-medium uppercase tracking-[0.2em] text-xs h-12 px-8 transition-all hover:pr-10 group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center">
                                        Iniciar Jornada
                                        <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </span>
                                </Button>
                            </MagneticWrapper>
                        </Link>
                    </motion.div>
                </div>

                {/* Right Column: Interaction */}
                <div className="flex-1 flex justify-center items-center relative perspective-1000 w-full mb-12 lg:mb-0">
                    <MagneticWrapper strength={0.2} className="cursor-pointer">
                        <div className="relative z-20">
                            <TarotCard
                                reveal={cardRevealed}
                                title="O Mago"
                                description="VOCÊ TEM O PODER DE MANIFESTAR SEUS DESEJOS. O universo aguarda seu comando."
                                onClick={() => setCardRevealed(!cardRevealed)}
                                className="transform scale-90 md:scale-110 lg:scale-125 hover:rotate-1 transition-transform duration-500"
                            />

                            {/* Instructional Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: cardRevealed ? 0 : 1 }}
                                transition={{ delay: 1.5 }}
                                className="absolute -bottom-12 left-0 right-0 text-center pointer-events-none"
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-magenta-200/30 animate-pulse">
                                    Toque para revelar
                                </p>
                            </motion.div>
                        </div>
                    </MagneticWrapper>

                    {/* Decorative Elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                        className="absolute inset-0 bg-radial-gradient from-magenta-500/10 to-transparent blur-3xl pointer-events-none"
                    />
                </div>
            </section>

            {/* Scroll-driven Atmospheric Fog */}
            <motion.div
                style={{ opacity: fogOpacity }}
                className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent mix-blend-multiply"
            />

            {/* Editorial Grid Section */}
            <section className="w-full py-20 lg:py-32 px-6 border-t border-magenta-50/5 bg-midnight-950 relative z-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-magenta-50/10 border border-magenta-50/10 overflow-hidden rounded-lg md:rounded-none">

                        {/* Feature 1 */}
                        <div className="bg-midnight-950 p-8 lg:p-12 hover:bg-midnight-900 transition-colors duration-500 group cursor-pointer border-b border-magenta-50/10 md:border-b-0 relative">
                            <span className="absolute top-6 left-6 text-xs font-mono text-magenta-200/30">01</span>
                            <Moon className="w-8 h-8 text-magenta-200 mb-6 stroke-1 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                            <h3 className="font-display text-2xl lg:text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">Horóscopo IA</h3>
                            <p className="font-sans text-sm text-magenta-200/50 leading-relaxed">
                                Previsões diárias calculadas para o seu mapa astral exato. Brutalmente honesto.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-midnight-950 p-8 lg:p-12 hover:bg-midnight-900 transition-colors duration-500 group cursor-pointer border-b border-magenta-50/10 md:border-b-0 md:border-l border-r relative">
                            <span className="absolute top-6 left-6 text-xs font-mono text-magenta-200/30">02</span>
                            <div className="w-8 h-8 border border-magenta-200 rotate-45 mb-6 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                                <div className="w-1 h-1 bg-magenta-200 rounded-full" />
                            </div>
                            <h3 className="font-display text-2xl lg:text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">Tarot Digital</h3>
                            <p className="font-sans text-sm text-magenta-200/50 leading-relaxed">
                                Tire cartas do éter. Interprete os sinais. A compreensão vem de dentro.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-midnight-950 p-8 lg:p-12 hover:bg-midnight-900 transition-colors duration-500 group cursor-pointer relative">
                            <span className="absolute top-6 left-6 text-xs font-mono text-magenta-200/30">03</span>
                            <Star className="w-8 h-8 text-magenta-200 mb-6 stroke-1 group-hover:scale-110 transition-transform" />
                            <h3 className="font-display text-2xl lg:text-3xl mb-4 group-hover:translate-x-2 transition-transform duration-300">Sinastria</h3>
                            <p className="font-sans text-sm text-magenta-200/50 leading-relaxed">
                                Verifique a compatibilidade com alinhamentos planetários precisos. Suas luas estão em sincronia?
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
