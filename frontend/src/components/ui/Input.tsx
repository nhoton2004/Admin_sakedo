import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    className?: string;
}

export const Input: React.FC<InputProps> = ({ icon, className = '', ...props }) => {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    {icon}
                </div>
            )}
            <input
                className={`
                    w-full rounded-pill bg-neutral-50 border border-neutral-200
                    px-4 py-2.5 text-neutral-700 placeholder:text-neutral-400
                    focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary
                    transition-all duration-200
                    ${icon ? 'pl-11' : ''}
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};
