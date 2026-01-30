'use client'

import * as React from 'react'
import { useFormContext, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Input, InputProps } from './input'

/**
 * Form Field Wrapper
 * Handles labels, errors, and registration automatically
 */
interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
    name: Path<T>
    label?: string
    rules?: RegisterOptions<T, Path<T>>
    description?: string
    component?: React.ComponentType<any>
}

export function FormField<T extends FieldValues>({
    name,
    label,
    rules,
    description,
    className,
    component: Component = Input,
    ...props
}: FormFieldProps<T>) {
    const { control, formState: { errors } } = useFormContext<T>()

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field, fieldState }) => (
                <div className={cn('space-y-2', className)}>
                    <Component
                        id={name}
                        label={label}
                        error={!!fieldState.error}
                        {...field}
                        {...props}
                    />

                    {description && !fieldState.error && (
                        <p className="text-xs text-gray-400 ml-1">{description}</p>
                    )}

                    {fieldState.error && (
                        <p className="text-xs text-red-400 ml-1 animate-slide-up">
                            {fieldState.error.message?.toString()}
                        </p>
                    )}
                </div>
            )}
        />
    )
}
