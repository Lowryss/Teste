import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'default'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', isLoading, fullWidth, className, children, ...props }, ref) => {
        // Map legacy 'default' to 'primary'
        if (variant === 'default') variant = 'primary'

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-medium select-none',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500',
                    'disabled:opacity-50 disabled:pointer-events-none',

                    // Variants
                    variant === 'primary' && 'bg-magenta-500 text-white hover:bg-magenta-600 shadow-md hover:shadow-lg border border-transparent',
                    variant === 'secondary' && 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm hover:shadow-md border border-transparent',
                    variant === 'ghost' && 'bg-transparent text-magenta-100 hover:bg-magenta-500/10 hover:text-magenta-50',
                    variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 shadow-md border border-transparent',
                    variant === 'outline' && 'bg-transparent border border-midnight-600 text-gray-300 hover:bg-midnight-800 hover:text-white',

                    // Sizes
                    size === 'sm' && 'h-8 px-3 text-sm rounded-sm',
                    size === 'md' && 'h-10 px-4 text-base rounded-md',
                    size === 'lg' && 'h-12 px-6 text-lg rounded-md',

                    // Layout
                    fullWidth && 'w-full',

                    // Micro-interactions
                    !props.disabled && !isLoading && 'hover:scale-[1.02] active:scale-[0.98]',

                    className
                )}
                disabled={props.disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
