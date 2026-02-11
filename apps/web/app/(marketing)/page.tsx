"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star, Moon, Sun, Zap, Eye, Heart, TrendingUp } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'

export default function LandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [activeCard, setActiveCard] = useState<number | null>(null)
    const heroRef = useRef(null)
    const featuresRef = useRef(null)
    const isHeroInView = useInView(heroRef, { once: false })
    const isFeaturesInView = useInView(featuresRef, { once: true })

    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 300], [0, -50])
    const y2 = useTransform(scrollY, [0, 300], [0, 50])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])
    const scale = useTransform(scrollY, [0, 300], [1, 0.8])

    const springConfig = { stiffness: 100, damping: 30 }
    const x = useSpring(useTransform(scrollY, [0, 300], [0, -100]), springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const features = [
        {
            icon: Moon,
            title: "Mapa Astral Completo",
            description: "Descubra Sol, Lua, Ascendente e os segredos das estrelas no momento do seu nascimento",
            color: "from-purple-500 to-pink-500",
            delay: 0
        },
        {
            icon: Sparkles,
            title: "Numerologia Mística",
            description: "Decodifique os números sagrados que regem sua alma, destino e personalidade",
            color: "from-cyan-500 to-blue-500",
            delay: 0.1
        },
        {
            icon: Star,
            title: "Tarot Interativo",
            description: "Cartas que falam com sua intuição. Respostas que transformam vidas",
            color: "from-amber-500 to-orange-500",
            delay: 0.2
        },
        {
            icon: Heart,
            title: "Compatibilidade Cósmica",
            description: "Descubra a química astral perfeita entre almas gêmeas",
            color: "from-rose-500 to-red-500",
            delay: 0.3
        },
        {
            icon: Eye,
            title: "Leitura de Sonhos",
            description: "Desvende mensagens ocultas do inconsciente através da IA mística",
            color: "from-indigo-500 to-purple-500",
            delay: 0.4
        },
        {
            icon: Zap,
            title: "Totem Xamânico",
            description: "Conecte-se com seu animal de poder e medicina ancestral",
            color: "from-emerald-500 to-teal-500",
            delay: 0.5
        }
    ]

    const stats = [
        { value: "10K+", label: "Leituras Realizadas", icon: TrendingUp },
        { value: "95%", label: "Precisão Mística", icon: Star },
        { value: "24/7", label: "Acesso Ilimitado", icon: Zap }
    ]

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-midnight-950 via-purple-950/20 to-midnight-950">

            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full blur-3xl"
                        style={{
                            background: `radial-gradient(circle, ${['rgba(255,0,255,0.15)', 'rgba(0,255,255,0.15)', 'rgba(255,215,0,0.15)'][i % 3]}, transparent)`,
                            width: Math.random() * 400 + 200,
                            height: Math.random() * 400 + 200,
                        }}
                        initial={{
                            x: Math.random() * 1920,
                            y: Math.random() * 1080,
                        }}
                        animate={{
                            x: Math.random() * 1920,
                            y: Math.random() * 1080,
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Floating Particles */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: Math.random() * 1920,
                            y: 1180,
                        }}
                        animate={{
                            y: -100,
                            x: Math.random() * 1920,
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Text Content */}
                        <motion.div
                            style={{ opacity, scale }}
                            className="text-center lg:text-left space-y-8 z-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="inline-block"
                            >
                                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-magenta-500/20 via-purple-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm">
                                    <span className="text-xs font-mono text-magenta-200 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        IA Mística + Sabedoria Ancestral
                                    </span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-none"
                            >
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-magenta-200 via-purple-200 to-cyan-200 animate-gradient">
                                    Revele
                                </span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-pink-200 to-magenta-200 animate-gradient-reverse">
                                    Seu Destino
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-xl md:text-2xl text-magenta-100/70 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                            >
                                O universo guarda segredos sobre você. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 font-semibold">
                                    Inteligência Artificial encontra Misticismo
                                </span>{' '}
                                para revelar sua verdadeira essência.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                            >
                                <Link href="/register">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-magenta-600 via-purple-600 to-pink-600 hover:from-magenta-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg rounded-full shadow-2xl shadow-magenta-500/50 border-0">
                                            Começar Jornada Mística
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link href="/login">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm text-white font-semibold text-lg rounded-full">
                                            Já tenho conta
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="grid grid-cols-3 gap-6 pt-8"
                            >
                                {stats.map((stat, idx) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + idx * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <stat.icon className="w-4 h-4 text-amber-400" />
                                            <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                                                {stat.value}
                                            </div>
                                        </div>
                                        <div className="text-xs text-magenta-200/60 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right: 3D Interactive Card */}
                        <motion.div
                            style={{ y: y1 }}
                            className="relative flex items-center justify-center lg:justify-end"
                        >
                            <motion.div
                                className="relative w-full max-w-md aspect-square"
                                animate={{
                                    rotateY: mousePosition.x * 10,
                                    rotateX: -mousePosition.y * 10
                                }}
                                transition={{ type: "spring", stiffness: 50 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Glowing Orb */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{
                                        background: [
                                            "radial-gradient(circle, rgba(255,0,255,0.4), transparent)",
                                            "radial-gradient(circle, rgba(0,255,255,0.4), transparent)",
                                            "radial-gradient(circle, rgba(255,215,0,0.4), transparent)",
                                            "radial-gradient(circle, rgba(255,0,255,0.4), transparent)"
                                        ],
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{ duration: 8, repeat: Infinity }}
                                />

                                {/* Crystal Cards */}
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl"
                                        style={{
                                            transform: `translateZ(${(i - 1) * 50}px) rotateZ(${i * 15}deg)`
                                        }}
                                        animate={{
                                            rotateZ: i * 15 + Math.sin(Date.now() / 1000) * 5
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl" />
                                    </motion.div>
                                ))}

                                {/* Center Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Star className="w-24 h-24 text-amber-300" strokeWidth={1} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section ref={featuresRef} className="relative py-32 px-6">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-200 to-cyan-200 mb-4">
                            Ferramentas Místicas
                        </h2>
                        <p className="text-xl text-magenta-100/60">
                            Tecnologia de ponta para despertar sua consciência
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: feature.delay }}
                                onHoverStart={() => setActiveCard(idx)}
                                onHoverEnd={() => setActiveCard(null)}
                                className="relative group"
                            >
                                <div className={`relative h-full p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden ${activeCard === idx ? 'scale-105' : ''}`}>
                                    {/* Animated gradient on hover */}
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                                    />

                                    {/* Icon */}
                                    <motion.div
                                        className="relative mb-6"
                                        animate={activeCard === idx ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-3 flex items-center justify-center shadow-lg`}>
                                            <feature.icon className="w-full h-full text-white" strokeWidth={1.5} />
                                        </div>
                                    </motion.div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-magenta-300 group-hover:to-cyan-300 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-magenta-100/60 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Hover effect particles */}
                                    <AnimatePresence>
                                        {activeCard === idx && (
                                            <>
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${feature.color}`}
                                                        initial={{ x: "50%", y: "50%", scale: 0 }}
                                                        animate={{
                                                            x: `${Math.random() * 100}%`,
                                                            y: `${Math.random() * 100}%`,
                                                            scale: [0, 1, 0]
                                                        }}
                                                        exit={{ scale: 0 }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-magenta-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/10 to-cyan-500/10 rounded-3xl animate-pulse" />

                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 left-1/2 -translate-x-1/2"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-magenta-200 to-cyan-200 mb-6 mt-8">
                            Pronto para Descobrir Seu Caminho?
                        </h2>
                        <p className="text-xl text-magenta-100/70 mb-8">
                            Milhares já despertaram. É sua vez de revelar os segredos do universo.
                        </p>

                        <Link href="/register">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="h-16 px-12 bg-gradient-to-r from-magenta-600 via-purple-600 to-pink-600 hover:from-magenta-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xl rounded-full shadow-2xl shadow-magenta-500/50">
                                    Iniciar Agora Grátis
                                    <Sparkles className="ml-2 w-6 h-6" />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <style jsx global>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-reverse {
                    0%, 100% { background-position: 100% 50%; }
                    50% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 8s ease infinite;
                }
                .animate-gradient-reverse {
                    background-size: 200% 200%;
                    animation: gradient-reverse 8s ease infinite;
                }
            `}</style>
        </main>
    )
}
