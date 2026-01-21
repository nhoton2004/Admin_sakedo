import React from 'react';
import { Search, Maximize2 } from 'lucide-react';

interface FloatingActionsProps {
    className?: string;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ className = '' }) => {
    return (
        <div className={`fixed bottom-6 right-6 flex flex-col gap-3 ${className}`}>
            {/* Expand/Fullscreen Button */}
            <button className="w-12 h-12 bg-neutral-700 hover:bg-neutral-800 text-white rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-105">
                <Maximize2 className="w-5 h-5" />
            </button>

            {/* Search Button */}
            <button className="w-12 h-12 bg-neutral-700 hover:bg-neutral-800 text-white rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-105">
                <Search className="w-5 h-5" />
            </button>
        </div>
    );
};
