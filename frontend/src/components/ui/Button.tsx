import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-pill transition-all duration-200 inline-flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary-600 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50',
        ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-50',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
