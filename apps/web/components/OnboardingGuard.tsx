'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Spinner } from '@/components/ui/spinner'

interface OnboardingGuardProps {
    children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [checking, setChecking] = useState(true)
    const [onboardingComplete, setOnboardingComplete] = useState(false)

    // Rotas públicas que não precisam de check
    const publicRoutes = ['/', '/login', '/register', '/forgot-password']

    // Rotas de onboarding
    const onboardingRoutes = ['/onboarding/welcome', '/onboarding/profile', '/onboarding/success']

    const isPublicRoute = publicRoutes.includes(pathname)
    const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route))

    useEffect(() => {
        async function checkOnboarding() {
            if (!user) {
                setChecking(false)
                return
            }

            if (isPublicRoute || isOnboardingRoute) {
                setChecking(false)
                setOnboardingComplete(true)
                return
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid))

                if (userDoc.exists()) {
                    const userData = userDoc.data()
                    const completed = userData.onboardingCompleted === true

                    setOnboardingComplete(completed)

                    if (!completed) {
                        router.push('/onboarding/welcome')
                    }
                } else {
                    // User doc doesn't exist yet - redirect to onboarding
                    router.push('/onboarding/welcome')
                }
            } catch (error) {
                console.error('Guard Check Error:', error)
                setOnboardingComplete(true) // Fail-safe
            } finally {
                setChecking(false)
            }
        }

        if (!authLoading) {
            checkOnboarding()
        }
    }, [user, authLoading, pathname, isPublicRoute, isOnboardingRoute, router])

    if (authLoading || checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-midnight-900">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" className="text-magenta-500" />
                    <p className="text-magenta-200 font-medium animate-pulse">
                        Sincronizando energias...
                    </p>
                </div>
            </div>
        )
    }

    // Se logado e incompleto (e não está no fluxo de onboarding/public), retornar null esperando redirect
    if (user && !onboardingComplete && !isPublicRoute && !isOnboardingRoute) {
        return null
    }

    return <>{children}</>
}
