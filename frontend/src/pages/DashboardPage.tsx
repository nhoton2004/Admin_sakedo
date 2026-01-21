import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../app/admin/AdminLayout';
import { StatsService } from '../services';
import { KpiCard } from '../components/analytics/KpiCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, TrendingUp, Users, ShoppingBag, Calendar, RefreshCw } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        categories: 0,
        products: 0,
        orders: 0,
        reservations: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadStats();
        // Optional: Auto-refresh every 60 seconds
        const interval = setInterval(loadStats, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch real-time stats from API
            const data = await StatsService.getDashboardStats();

            setStats({
                categories: data.totalCategories,
                products: data.totalProducts,
                orders: data.totalOrders,
                reservations: data.totalReservations,
            });
        } catch (error: any) {
            console.error('Failed to load stats:', error);
            setError(error.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const kpis = [
        {
            id: 1,
            title: t('dashboard.kpi.totalCategories'),
            value: stats.categories,
            percentage: 75,
            change: '+12%',
            color: '#FF6A3D',
        },
        {
            id: 2,
            title: t('dashboard.kpi.totalProducts'),
            value: stats.products,
            percentage: 82,
            change: '+18%',
            color: '#10B981',
        },
        {
            id: 3,
            title: t('dashboard.kpi.totalOrders'),
            value: stats.orders,
            percentage: 65,
            change: '+25%',
            color: '#7C5CFF',
        },
        {
            id: 4,
            title: t('dashboard.kpi.reservations'),
            value: stats.reservations,
            percentage: 90,
            change: '+8%',
            color: '#F59E0B',
        },
    ];

    const quickActions = [
        {
            id: 1,
            icon: <ShoppingBag className="w-6 h-6" />,
            title: t('dashboard.quickActions.addProduct'),
            description: t('dashboard.quickActions.addProductDesc'),
            color: 'from-green-400 to-green-600',
            path: '/admin/products',
        },
        {
            id: 2,
            icon: <Calendar className="w-6 h-6" />,
            title: t('dashboard.quickActions.manageOrders'),
            description: t('dashboard.quickActions.manageOrdersDesc'),
            color: 'from-blue-400 to-blue-600',
            path: '/admin/orders',
        },
        {
            id: 3,
            icon: <Users className="w-6 h-6" />,
            title: t('dashboard.quickActions.viewCustomers'),
            description: t('dashboard.quickActions.viewCustomersDesc'),
            color: 'from-purple-400 to-purple-600',
            path: '/admin/customers',
        },
    ];

    // Error state
    if (error) {
        return (
            <AdminLayout>
                <Card padding="lg" className="max-w-md mx-auto mt-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('common.error')}</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button variant="primary" onClick={loadStats}>
                            <RefreshCw className="w-4 h-4" />
                            {t('common.retry')}
                        </Button>
                    </div>
                </Card>
            </AdminLayout>
        );
    }

    // Loading state
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-neutral-500">{t('common.loading')}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.dashboard')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('dashboard.title')}</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('dashboard.title')}</h1>

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

            {/* Welcome Banner */}
            <Card padding="lg" className="mb-6 bg-gradient-to-br from-primary-500 to-primary-600 border-0">
                <div className="flex items-center justify-between text-white">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">{t('dashboard.welcome')}</h2>
                        </div>
                        <p className="text-white/90 text-lg max-w-2xl">
                            {t('dashboard.subtitle')}
                        </p>
                    </div>
                    <div className="hidden lg:flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm">
                        <span className="text-5xl">👋</span>
                    </div>
                </div>
            </Card>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('dashboard.quickActions.title')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action) => (
                        <Link to={action.path} key={action.id}>
                            <Card padding="md" hover className="cursor-pointer group h-full">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-neutral-900 group-hover:text-primary transition-colors">
                                            {action.title}
                                        </h4>
                                        <p className="text-sm text-neutral-500">{action.description}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardPage;
