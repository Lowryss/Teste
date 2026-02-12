import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean
    label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, id, children, ...props }, ref) => {
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
                <select
                    id={id}
                    className={cn(
                        'flex w-full rounded-md border border-midnight-700 bg-midnight-800/50',
                        'px-3 py-2 text-base text-gray-100',
                        'transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 focus-visible:border-transparent',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'hover:border-magenta-500/30',
                        'cursor-pointer',

                        error && 'border-red-500 focus-visible:ring-red-500',

                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
            </div>
        )
    }
)

Select.displayName = 'Select'

// Componentes compatíveis com shadcn/ui pattern (mas simplificados)
export const SelectTrigger = forwardRef<HTMLSelectElement, SelectProps>(
    ({ children, ...props }, ref) => <Select ref={ref} {...props}>{children}</Select>
)
SelectTrigger.displayName = 'SelectTrigger'

export const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <option value="" disabled>{placeholder}</option>
)

export const SelectContent = ({ children }: { children: ReactNode }) => <>{children}</>

export const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => (
    <option value={value}>{children}</option>
)
