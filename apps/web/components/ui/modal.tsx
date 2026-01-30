'use client'

import { HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    showCloseButton?: boolean
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    showCloseButton = true,
    children,
    className,
    ...props
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'unset'
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    if (typeof window === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[1400] bg-midnight-900/80 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            // @ts-ignore - Framer motion type conflict with latest React types
                            className={cn(
                                'pointer-events-auto relative w-full max-w-lg rounded-xl',
                                'bg-midnight-800 border border-midnight-700 shadow-2xl shadow-magenta-900/20',
                                'p-6 sm:p-8 overflow-y-auto max-h-[90vh]',
                                className
                            )}
                            {...props}
                        >
                            {(title || description || showCloseButton) && (
                                <div className="flex flex-col space-y-1.5 mb-6 text-center sm:text-left">
                                    {title && (
                                        <h3 className="text-2xl font-display font-semibold text-white">
                                            {title}
                                        </h3>
                                    )}
                                    {description && (
                                        <p className="text-sm text-gray-400">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {showCloseButton && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className="absolute right-4 top-4 h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            )}

                            <div className="text-gray-200">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
