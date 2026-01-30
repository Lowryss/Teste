'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
    id: string
    type: ToastType
    title?: string
    message: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => void
    removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const addToast = useCallback(({ duration = 5000, ...props }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, duration, ...props }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [removeToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <Toaster toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

// Hook
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

// Visual Component (Internal)
function Toaster({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-0 right-0 z-[1700] p-4 sm:p-6 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={cn(
                            'pointer-events-auto relative w-full overflow-hidden rounded-lg p-4 shadow-lg border',
                            'flex items-start gap-3',
                            // Styles by type
                            toast.type === 'success' && 'bg-midnight-800 border-teal-500/50 text-teal-50',
                            toast.type === 'error' && 'bg-midnight-800 border-red-500/50 text-red-50',
                            toast.type === 'info' && 'bg-midnight-800 border-magenta-500/50 text-magenta-50',
                            toast.type === 'warning' && 'bg-midnight-800 border-gold-500/50 text-gold-50'
                        )}
                    >
                        {/* Icon */}
                        <div className="shrink-0 pt-0.5">
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-teal-400" />}
                            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
                            {toast.type === 'info' && <Info className="h-5 w-5 text-magenta-400" />}
                            {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-gold-400" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {toast.title && <h4 className="text-sm font-semibold mb-1">{toast.title}</h4>}
                            <p className="text-sm opacity-90 leading-relaxed">{toast.message}</p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 rounded-full p-1 opacity-50 hover:opacity-100 hover:bg-white/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Progress Bar (Optional - for visual flair) */}
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: toast.duration ? toast.duration / 1000 : 5, ease: 'linear' }}
                            className={cn(
                                'absolute bottom-0 left-0 h-0.5',
                                toast.type === 'success' && 'bg-teal-500',
                                toast.type === 'error' && 'bg-red-500',
                                toast.type === 'info' && 'bg-magenta-500',
                                toast.type === 'warning' && 'bg-gold-500'
                            )}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
