import React from 'react';

interface DonutProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
}

export const DonutProgress: React.FC<DonutProgressProps> = ({
    percentage,
    size = 60,
    strokeWidth = 6,
    color = '#FF6A3D',
    backgroundColor = '#F3F4F6',
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={backgroundColor}
                strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
            />
        </svg>
    );
};
