import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outline' | 'elevated'
    hoverEffect?: boolean
    padding?: string // Legacy prop support (ignored or mapped)
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hoverEffect = false, padding, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl transition-all duration-300 overflow-hidden',

                    // Variants
                    variant === 'default' && 'bg-midnight-800 border border-midnight-700 shadow-md',
                    variant === 'glass' && 'bg-midnight-900/60 backdrop-blur-sm border border-white/5 shadow-lg',
                    variant === 'outline' && 'bg-transparent border border-midnight-700',
                    variant === 'elevated' && 'bg-midnight-800 border border-midnight-700 shadow-xl',

                    // Hover Effects
                    hoverEffect && 'hover:translate-y-[-4px] hover:shadow-xl hover:border-magenta-500/30',

                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('font-display font-semibold leading-none tracking-tight text-white mb-2', className)}
            {...props}
        />
    )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-gray-400 leading-relaxed', className)}
            {...props}
        />
    )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
    )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center p-6 pt-0', className)}
            {...props}
        />
    )
)
CardFooter.displayName = 'CardFooter'
