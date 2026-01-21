import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import { Dropdown } from '../ui/Dropdown';

interface SalesData {
    day: string;
    beverage: number;
    food: number;
}

interface SalesStatisticChartProps {
    data: SalesData[];
}

const timeframeOptions = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
];

export const SalesStatisticChart: React.FC<SalesStatisticChartProps> = ({ data }) => {
    const [timeframe, setTimeframe] = useState('weekly');

    return (
        <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900">Sales Statistic</h3>
                <Dropdown
                    options={timeframeOptions}
                    value={timeframe}
                    onChange={setTimeframe}
                />
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                        dataKey="day"
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
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                        iconSize={8}
                    />
                    <Bar
                        dataKey="beverage"
                        fill="#7C5CFF"
                        radius={[8, 8, 0, 0]}
                        name="Beverage"
                    />
                    <Bar
                        dataKey="food"
                        fill="#FF6A3D"
                        radius={[8, 8, 0, 0]}
                        name="Food"
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
