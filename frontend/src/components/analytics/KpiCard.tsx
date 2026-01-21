import React from 'react';
import { Card } from '../ui/Card';
import { DonutProgress } from './DonutProgress';

interface KpiCardProps {
    title: string;
    value: string | number;
    percentage: number;
    change?: string;
    color?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
    title,
    value,
    percentage,
    change,
    color = '#FF6A3D',
}) => {
    return (
        <Card padding="md" hover>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-neutral-500 mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-1">
                        {value}
                    </h3>
                    {change && (
                        <p className="text-sm text-green-600 font-medium">
                            {change}
                        </p>
                    )}
                </div>
                <div className="flex-shrink-0">
                    <DonutProgress
                        percentage={percentage}
                        size={60}
                        strokeWidth={6}
                        color={color}
                    />
                </div>
            </div>
        </Card>
    );
};
