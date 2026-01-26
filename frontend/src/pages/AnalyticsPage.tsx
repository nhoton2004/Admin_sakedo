import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { KpiCard } from '../components/analytics/KpiCard';
import { SalesStatisticChart } from '../components/analytics/SalesStatisticChart';
import { CustomerMapChart } from '../components/analytics/CustomerMapChart';
import { BestSellerList } from '../components/analytics/BestSellerList';
import { FloatingActions } from '../components/ui/FloatingActions';
import { ChevronRight } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation();

    // Empty data for clean state
    const kpis = [
        {
            id: 1,
            title: t('dashboard.kpi.totalCategories'),
            value: 0,
            percentage: 0,
            change: '0%',
            color: '#FF6A3D',
        },
        {
            id: 2,
            title: t('dashboard.kpi.totalProducts'),
            value: 0,
            percentage: 0,
            change: '0%',
            color: '#10B981',
        },
        {
            id: 3,
            title: t('dashboard.kpi.totalOrders'),
            value: 0,
            percentage: 0,
            change: '0%',
            color: '#7C5CFF',
        },
        {
            id: 4,
            title: t('dashboard.kpi.reservations'),
            value: 0,
            percentage: 0,
            change: '0%',
            color: '#F59E0B',
        },
    ];

    const weeklySales: any[] = [];
    const customerMap: any[] = [];
    const bestSellers: any[] = [];

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.menu')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('nav.analytics')}</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('nav.analytics')}</h1>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {kpis.map((kpi) => (
                    <KpiCard
                        key={kpi.id}
                        title={kpi.title}
                        value={kpi.value}
                        percentage={kpi.percentage}
                        change={kpi.change}
                        color={kpi.color}
                    />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Statistic - Takes 5 columns */}
                <div className="lg:col-span-5">
                    <SalesStatisticChart data={weeklySales} />
                </div>

                {/* Customer Map - Takes 4 columns */}
                <div className="lg:col-span-4">
                    <CustomerMapChart data={customerMap} />
                </div>

                {/* Best Seller - Takes 3 columns */}
                <div className="lg:col-span-3">
                    <BestSellerList items={bestSellers} />
                </div>
            </div>

            {/* Floating Action Buttons */}
            <FloatingActions />
        </AdminLayout>
    );
};

export default AnalyticsPage;
