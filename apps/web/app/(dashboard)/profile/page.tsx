'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Clock,
    Target,
    Sparkles,
    Save,
    Edit3,
    Shield,
    Crown,
    Gift
} from 'lucide-react'

export default function ProfilePage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        birthDate: user?.profile?.birthDate || '',
        birthTime: user?.profile?.birthTime || '',
        birthPlace: user?.profile?.birthPlace || '',
        context: user?.profile?.context || '',
        goal: user?.profile?.goal || ''
    })

    const handleSave = async () => {
        if (!user) return
        setSaving(true)

        try {
            // Update Firebase Auth display name
            if (auth.currentUser && formData.name !== user.displayName) {
                await updateProfile(auth.currentUser, { displayName: formData.name })
            }

            // Update Firestore profile
            const userRef = doc(db, 'users', user.uid)
            await updateDoc(userRef, {
                profile: {
                    name: formData.name,
                    birthDate: formData.birthDate,
                    birthTime: formData.birthTime,
                    birthPlace: formData.birthPlace,
                    context: formData.context,
                    goal: formData.goal
                }
            })

            addToast({
                type: 'success',
                title: 'Perfil Atualizado',
                message: 'Suas informações foram salvas com sucesso.'
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating profile:', error)
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível salvar as alterações.'
            })
        } finally {
            setSaving(false)
        }
    }

    const stats = [
        {
            label: 'Pontos Cósmicos',
            value: user?.cosmicPoints || 0,
            icon: Sparkles,
            color: 'text-magenta-400'
        },
        {
            label: 'Pontos Comprados',
            value: user?.totalPointsPurchased || 0,
            icon: Gift,
            color: 'text-emerald-400'
        },
        {
            label: 'Pontos Usados',
            value: user?.totalPointsSpent || 0,
            icon: Crown,
            color: 'text-amber-400'
        }
    ]

    return (
        <div className="max-w-3xl mx-auto pb-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-magenta-500 to-purple-600 flex items-center justify-center text-4xl font-display text-white shadow-2xl shadow-magenta-500/30">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-midnight-950">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-display font-light text-magenta-50 mb-2">
                    {user?.displayName || 'Viajante Cósmico'}
                </h1>
                <p className="text-magenta-200/60 text-sm flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-10"
            >
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-midnight-900/40 border-white/5 text-center">
                        <CardContent className="p-6">
                            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
                            <div className="text-2xl font-display text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] uppercase tracking-wider text-magenta-200/50">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Profile Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-midnight-900/40 border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-display text-magenta-50">
                            Informações do Perfil
                        </CardTitle>
                        {!isEditing ? (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="border-white/10 hover:bg-white/5"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-magenta-500 hover:bg-magenta-600"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-magenta-200/50 flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Nome
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-midnight-950 border-white/10 focus:border-magenta-500"
                                />
                            ) : (
                                <p className="text-magenta-50">{formData.name || 'Não informado'}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Birth Date */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-magenta-200/50 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Data de Nascimento
                                </label>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                                        className="bg-midnight-950 border-white/10 focus:border-magenta-500"
                                    />
                                ) : (
                                    <p className="text-magenta-50">
                                        {formData.birthDate
                                            ? new Date(formData.birthDate).toLocaleDateString('pt-BR')
                                            : 'Não informado'}
                                    </p>
                                )}
                            </div>

                            {/* Birth Time */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-magenta-200/50 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Hora de Nascimento
                                </label>
                                {isEditing ? (
                                    <Input
                                        type="time"
                                        value={formData.birthTime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                                        className="bg-midnight-950 border-white/10 focus:border-magenta-500"
                                    />
                                ) : (
                                    <p className="text-magenta-50">{formData.birthTime || 'Não informado'}</p>
                                )}
                            </div>
                        </div>

                        {/* Birth Place */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-magenta-200/50 flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                Local de Nascimento
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.birthPlace}
                                    onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                                    placeholder="Cidade, Estado, País"
                                    className="bg-midnight-950 border-white/10 focus:border-magenta-500"
                                />
                            ) : (
                                <p className="text-magenta-50">{formData.birthPlace || 'Não informado'}</p>
                            )}
                        </div>

                        {/* Goal */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-magenta-200/50 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                Objetivo
                            </label>
                            {isEditing ? (
                                <Input
                                    value={formData.goal}
                                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                                    placeholder="O que você busca na sua jornada espiritual?"
                                    className="bg-midnight-950 border-white/10 focus:border-magenta-500"
                                />
                            ) : (
                                <p className="text-magenta-50">{formData.goal || 'Não informado'}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Account Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
            >
                <Card className="bg-midnight-900/40 border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-display text-magenta-50">
                            Informações da Conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-white/5">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-magenta-200/50 mb-1">Email</div>
                                <div className="text-magenta-50">{user?.email}</div>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                Verificado
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-magenta-200/50 mb-1">Membro desde</div>
                                <div className="text-magenta-50">
                                    {user?.metadata?.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                        : 'Recentemente'}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
