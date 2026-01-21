import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'sm',
    className = '',
}) => {
    const variantClasses = {
        primary: 'bg-primary-50 text-primary-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-amber-50 text-amber-700',
        danger: 'bg-red-50 text-red-700',
        neutral: 'bg-neutral-100 text-neutral-700',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={`
                inline-flex items-center justify-center font-medium rounded-full
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${className}
            `}
        >
            {children}
        </span>
    );
};
