import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';

interface CustomerData {
    region: string;
    customers: number;
}

interface CustomerMapChartProps {
    data: CustomerData[];
}

export const CustomerMapChart: React.FC<CustomerMapChartProps> = ({ data }) => {
    return (
        <Card padding="lg">
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Customer Map</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="region"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            padding: '8px 12px',
                        }}
                    />
                    <Bar
                        dataKey="customers"
                        fill="#FF6A3D"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
