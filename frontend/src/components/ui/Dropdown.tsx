import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    px-4 py-2 bg-white border border-neutral-200 rounded-lg
                    flex items-center gap-2 hover:bg-neutral-50 transition-colors
                    text-neutral-700 font-medium
                "
            >
                <span>{selectedOption?.label || placeholder}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="
                    absolute top-full mt-2 w-full bg-white border border-neutral-200
                    rounded-lg shadow-card z-50 overflow-hidden
                ">
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange?.(option.value);
                                setIsOpen(false);
                            }}
                            className="
                                w-full px-4 py-2 text-left hover:bg-neutral-50
                                transition-colors text-neutral-700
                                ${option.value === value ? 'bg-primary-50 text-primary' : ''}
                            "
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
