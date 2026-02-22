'use client'

import React, { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

import MagneticWrapper from '@/components/MagneticWrapper'

function OnboardingContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, router])

  const handleStart = async () => {
    if (!user) {
      router.replace('/login')
      return
    }
    setLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
        cosmicPoints: 10,
        totalPointsPurchased: 0,
        email: user.email,
        displayName: user.displayName
      }, { merge: true })
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Onboarding Error:', error);
      window.location.href = '/dashboard';
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-midnight-950 bg-noise relative overflow-hidden flex items-center justify-center p-4">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-magenta-900/10 rounded-full blur-[100px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-20"
      >
        <div className="bg-midnight-900/50 backdrop-blur-xl border border-magenta-50/10 rounded-sm shadow-2xl overflow-hidden p-10 text-center space-y-8">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto w-24 h-24 rounded-full bg-midnight-950 flex items-center justify-center border border-magenta-50/20"
          >
            <Sparkles className="w-10 h-10 text-magenta-200" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-display font-light text-magenta-50 tracking-tight leading-none">
              Bem-vindo(a), <span className="block italic text-magenta-200 opacity-80 mt-2">{user?.displayName?.split(' ')[0] || 'Viajante'}</span>
            </h1>
            <p className="text-magenta-200/60 font-mono text-sm leading-relaxed max-w-sm mx-auto">
              O universo estava esperando.<br /> Seu mapa está pronto para ser interpretado.
            </p>
          </div>

          <div className="pt-4">
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full h-16 bg-magenta-50 hover:bg-white text-midnight-950 font-display uppercase tracking-widest text-sm rounded-none transition-all shadow-none hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                disabled={loading}
                onClick={() => {
                  console.log("Button clicked!");
                  handleStart();
                }}
              >
                {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Entrar no Portal <ArrowRight className="w-4 h-4" /></span>}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function OnboardingWelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050508]" />}>
      <OnboardingContent />
    </Suspense>
  )
}
