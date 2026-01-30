import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean
    label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-magenta-200 mb-1.5 ml-1"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={id}
                    className={cn(
                        'flex w-full rounded-md border border-midnight-700 bg-midnight-800/50',
                        'px-3 py-2 text-base text-gray-100 placeholder:text-gray-500',
                        'transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 focus-visible:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'hover:border-magenta-500/30',

                        error && 'border-red-500 focus-visible:ring-red-500',

                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)

Input.displayName = 'Input'
