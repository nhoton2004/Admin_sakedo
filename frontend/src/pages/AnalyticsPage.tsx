import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { KpiCard } from '../components/analytics/KpiCard';
import { SalesStatisticChart } from '../components/analytics/SalesStatisticChart';
import { CustomerMapChart } from '../components/analytics/CustomerMapChart';
import { BestSellerList } from '../components/analytics/BestSellerList';
import { FloatingActions } from '../components/ui/FloatingActions';
import { ChevronRight } from 'lucide-react';

import { AnalyticsService } from '../services'; // Ensure AnalyticsService is exported from services index

const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [kpis, setKpis] = React.useState<any[]>([]);
    const [weeklySales, setWeeklySales] = React.useState<any[]>([]);
    const [bestSellers, setBestSellers] = React.useState<any[]>([]);

    React.useEffect(() => {
        loadAnalytics();

        // Auto-refresh analytics every 30 seconds
        const interval = setInterval(loadAnalytics, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadAnalytics = async () => {
        try {
            // Don't set loading on background refresh
            if (kpis.length === 0) setLoading(true);
            setError(null);

            const data = await AnalyticsService.getAnalytics(30);

            // Map Backend KPIs to UI KPIs
            const realKpis = [
                {
                    id: 1,
                    title: t('dashboard.kpi.totalCategories'),
                    value: data.kpis?.totalCategories || 0,
                    percentage: 0,
                    change: '0%',
                    color: '#FF6A3D',
                },
                {
                    id: 2,
                    title: t('dashboard.kpi.totalProducts'),
                    value: data.kpis?.totalProducts || 0,
                    percentage: 0,
                    change: '0%',
                    color: '#10B981',
                },
                {
                    id: 3,
                    title: t('dashboard.kpi.totalOrders'),
                    value: data.kpis?.totalOrders || 0,
                    percentage: 0,
                    change: '0%',
                    color: '#7C5CFF',
                },
                {
                    id: 4,
                    title: t('dashboard.kpi.reservations'),
                    value: data.kpis?.totalReservations || 0,
                    percentage: 0,
                    change: '0%',
                    color: '#F59E0B',
                },
            ];

            setKpis(realKpis);
            setWeeklySales(data.dailyRevenue || []);
            setBestSellers(data.topProducts || []);

        } catch (err: any) {
            console.error('Failed to load analytics:', err);
            // Don't show error UI if we already have data (silent fail for background refresh)
            if (kpis.length === 0) {
                setError(err.message || 'Failed to load analytics data');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={loadAnalytics}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                        >
                            {t('common.retry') || 'Retry'}
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const customerMap: any[] = [];

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
