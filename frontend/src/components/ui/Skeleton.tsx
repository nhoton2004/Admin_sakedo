import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
}) => {
    const baseClasses = 'animate-pulse bg-neutral-200';

    const variantClasses = {
        text: 'rounded-md h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
};

/**
 * Skeleton for KPI Card
 */
export const KpiCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <Skeleton variant="text" className="w-24 h-4 mb-3" />
                <Skeleton variant="text" className="w-16 h-8 mb-2" />
                <Skeleton variant="text" className="w-20 h-3" />
            </div>
            <Skeleton variant="circular" width={60} height={60} />
        </div>
    </div>
);

/**
 * Skeleton for table row
 */
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 5 }) => (
    <tr className="border-b border-neutral-100">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="py-4 px-4">
                <Skeleton variant="text" className="h-4" />
            </td>
        ))}
    </tr>
);

/**
 * Skeleton for product card
 */
export const ProductCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl p-4 border border-neutral-100">
        <Skeleton variant="rectangular" className="w-full h-40 mb-4" />
        <Skeleton variant="text" className="w-3/4 h-5 mb-2" />
        <Skeleton variant="text" className="w-1/2 h-4 mb-3" />
        <div className="flex justify-between items-center">
            <Skeleton variant="text" className="w-16 h-6" />
            <Skeleton variant="circular" width={32} height={32} />
        </div>
    </div>
);

/**
 * Skeleton for chart
 */
export const ChartSkeleton: React.FC = () => (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100">
        <Skeleton variant="text" className="w-32 h-6 mb-6" />
        <Skeleton variant="rectangular" className="w-full h-64" />
    </div>
);
