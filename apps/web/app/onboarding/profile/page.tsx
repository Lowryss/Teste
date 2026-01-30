'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PROFILE_OPTIONS, PROFILE_CONTEXT_MAX_LENGTH } from '@/lib/shared/constants';
import type { UserProfile } from '@/lib/shared/types';
import { Loader2, Sparkles, User, Heart, Star, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Partial<UserProfile>>({ readingPreferences: [] });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile.gender || !profile.ageRange || !profile.relationshipStatus || !profile.goal) {
            setError('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (!profile.readingPreferences || profile.readingPreferences.length === 0) {
            setError('Selecione pelo menos uma preferência de leitura');
            return;
        }

        try {
            setError('');
            setLoading(true);

            if (!user) throw new Error('Usuário não autenticado');

            const response = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, profile }),
            });

            if (!response.ok) throw new Error('Erro ao salvar perfil');
            router.push('/onboarding/success');
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar perfil. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = (pref: string) => {
        const current = profile.readingPreferences || [];
        const updated = current.includes(pref as any) ? current.filter(p => p !== pref) : [...current, pref as any];
        setProfile({ ...profile, readingPreferences: updated });
    };

    if (authLoading) return <div className="min-h-screen bg-midnight-950 flex items-center justify-center"><Loader2 className="animate-spin text-magenta-50" /></div>;

    return (
        <div className="min-h-screen w-full bg-midnight-950 bg-noise relative overflow-x-hidden p-6 flex flex-col items-center">
            <div className="absolute inset-0 bg-radial-gradient from-midnight-900 to-midnight-950 opacity-80 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10 space-y-8"
            >
                <div className="text-center space-y-2">
                    <span className="text-xs font-mono text-magenta-200/50 tracking-widest uppercase">Passo 1 de 2</span>
                    <h1 className="text-3xl md:text-4xl font-display font-light text-magenta-50">Conte-nos sobre você</h1>
                    <p className="text-magenta-200/60 font-light max-w-md mx-auto">
                        Essas informações ajudam a alinhar as estrelas ao seu perfil único.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-midnight-900/40 backdrop-blur-sm border border-magenta-50/10 p-8 shadow-2xl">
                    {error && <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}

                    {/* Gender */}
                    <div className="space-y-3">
                        <label className="text-sm uppercase tracking-widest text-magenta-200/50 font-mono">Gênero</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {PROFILE_OPTIONS.gender.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setProfile({ ...profile, gender: opt.value as any })}
                                    className={`h-12 border transition-all text-sm font-medium ${profile.gender === opt.value ? 'bg-magenta-50 text-midnight-950 border-magenta-50' : 'bg-transparent text-magenta-200/60 border-magenta-50/10 hover:border-magenta-50/30'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Age & Relationship */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm uppercase tracking-widest text-magenta-200/50 font-mono">Faixa Etária</label>
                            <div className="grid grid-cols-1 gap-2">
                                {PROFILE_OPTIONS.ageRange.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setProfile({ ...profile, ageRange: opt.value as any })}
                                        className={`h-10 text-left px-4 border transition-all text-sm ${profile.ageRange === opt.value ? 'bg-magenta-50/10 border-magenta-50 text-magenta-50' : 'bg-transparent border-magenta-50/10 text-magenta-200/60 hover:bg-magenta-50/5'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm uppercase tracking-widest text-magenta-200/50 font-mono">Status Relacionamento</label>
                            <div className="grid grid-cols-1 gap-2">
                                {PROFILE_OPTIONS.relationshipStatus.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setProfile({ ...profile, relationshipStatus: opt.value as any })}
                                        className={`h-10 text-left px-4 border transition-all text-sm ${profile.relationshipStatus === opt.value ? 'bg-magenta-50/10 border-magenta-50 text-magenta-50' : 'bg-transparent border-magenta-50/10 text-magenta-200/60 hover:bg-magenta-50/5'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-3">
                        <label className="text-sm uppercase tracking-widest text-magenta-200/50 font-mono">O que você busca?</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PROFILE_OPTIONS.goal.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setProfile({ ...profile, goal: opt.value as any })}
                                    className={`p-4 border text-left transition-all flex items-center gap-3 ${profile.goal === opt.value ? 'bg-magenta-50/10 border-magenta-50 text-magenta-50' : 'bg-transparent border-magenta-50/10 text-magenta-200/60 hover:border-magenta-50/30'}`}
                                >
                                    <span className="text-xl">{opt.icon}</span>
                                    <span className="text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Context */}
                    <div className="space-y-3">
                        <label className="text-sm uppercase tracking-widest text-magenta-200/50 font-mono">Como você se sente hoje?</label>
                        <textarea
                            value={profile.context || ''}
                            onChange={(e) => setProfile({ ...profile, context: e.target.value })}
                            maxLength={PROFILE_CONTEXT_MAX_LENGTH}
                            className="w-full bg-midnight-950/50 border border-magenta-50/10 p-4 text-magenta-50 placeholder:text-magenta-200/20 focus:border-magenta-50/50 focus:outline-none min-h-[100px] text-sm"
                            placeholder="Descreva brevemente seu momento..."
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-magenta-50 hover:bg-white text-midnight-950 font-display uppercase tracking-widest text-xs rounded-none transition-all"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Finalizar Perfil"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
