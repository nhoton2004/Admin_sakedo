import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = 'md',
    hover = false,
}) => {
    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
                bg-white rounded-card shadow-card border border-neutral-100
                ${paddingClasses[padding]}
                ${hover ? 'hover:shadow-hover transition-shadow duration-200' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};
