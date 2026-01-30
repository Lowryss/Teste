'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { INITIAL_COSMIC_POINTS } from '@/lib/shared/constants';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MagneticWrapper from '@/components/MagneticWrapper';

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Auto-redirect após 5 segundos
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen w-full bg-midnight-950 bg-noise relative overflow-hidden flex items-center justify-center p-6 text-magenta-50">
            <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md text-center relative z-10 space-y-8"
            >
                <div className="w-24 h-24 mx-auto bg-midnight-800 border border-magenta-50/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(235,0,255,0.2)] animate-pulse">
                    <Sparkles className="w-10 h-10 text-magenta-200" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-display font-light">Perfil Alinhado</h1>
                    <p className="text-magenta-200/60 font-mono text-sm max-w-xs mx-auto">
                        Seu mapa astral foi sincronizado com sucesso.
                    </p>
                </div>

                <div className="bg-midnight-900/40 border border-magenta-50/10 p-8 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-magenta-200/40 font-mono">Recompensa Recebida</div>
                    <div className="text-5xl font-display text-magenta-50">+{INITIAL_COSMIC_POINTS}</div>
                    <div className="text-sm text-magenta-200/60">Pontos Cósmicos</div>
                </div>

                <div className="space-y-4">
                    <MagneticWrapper strength={0.3}>
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="w-full h-14 bg-magenta-50 hover:bg-white text-midnight-950 font-display uppercase tracking-widest text-xs rounded-none transition-all"
                        >
                            Entrar no Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </MagneticWrapper>
                    <p className="text-xs text-magenta-200/30 animate-pulse">
                        Redirecionando em 5 segundos...
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
