'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show loading state
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--background)',
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        margin: '0 auto var(--space-md)',
                        border: '3px solid var(--border-color)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    // Show nothing if not authenticated (will redirect)
    if (!user) {
        return null;
    }

    // Show protected content
    return <>{children}</>;
}
