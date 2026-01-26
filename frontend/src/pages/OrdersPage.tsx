import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Order, OrderService, UserService, User } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, User as UserIcon, Phone, DollarSign, Calendar, Truck } from 'lucide-react';

const OrdersPage: React.FC = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [drivers, setDrivers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '' });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedDriver, setSelectedDriver] = useState('');

    useEffect(() => {
        loadOrders();
        loadDrivers();
    }, [filters]);

    const loadOrders = async () => {
        try {
            const data = await OrderService.getAll(filters);
            setOrders(data);
        } finally {
            setLoading(false);
        }
    };

    const loadDrivers = async () => {
        const data = await UserService.getAll({ role: 'DRIVER' });
        setDrivers(data.filter((d) => d.isActive));
    };

    const handleConfirm = async (id: string) => {
        await OrderService.confirm(id);
        loadOrders();
    };

    const handlePreparing = async (id: string) => {
        await OrderService.preparing(id);
        loadOrders();
    };

    const handleReady = async (id: string) => {
        await OrderService.ready(id);
        loadOrders();
    };

    const handleAssignDriver = async () => {
        if (!selectedOrder || !selectedDriver) return;
        await OrderService.assignDriver(selectedOrder.id, { driverId: selectedDriver });
        setSelectedOrder(null);
        setSelectedDriver('');
        loadOrders();
    };

    const handleCancel = async (id: string) => {
        if (confirm(t('common.confirm'))) {
            await OrderService.cancel(id);
            loadOrders();
        }
    };

    const getStatusVariant = (status: string) => {
        const map: any = {
            PENDING: 'warning',
            CONFIRMED: 'primary',
            PREPARING: 'warning',
            READY: 'primary',
            DELIVERING: 'primary',
            COMPLETED: 'success',
            CANCELED: 'danger',
        };
        return map[status] || 'neutral';
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

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.orders')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('orders.title')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{t('orders.title')}</h1>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                    className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                >
                    <option value="">{t('common.status')}</option>
                    <option value="PENDING">{t('orders.status.PENDING')}</option>
                    <option value="CONFIRMED">{t('orders.status.CONFIRMED')}</option>
                    <option value="PREPARING">{t('orders.status.PREPARING')}</option>
                    <option value="READY">{t('orders.status.READY')}</option>
                    <option value="DELIVERING">{t('orders.status.DELIVERING')}</option>
                    <option value="COMPLETED">{t('orders.status.COMPLETED')}</option>
                    <option value="CANCELED">{t('orders.status.CANCELLED')}</option>
                </select>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <Card key={order.id} padding="md" hover>
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserIcon className="w-4 h-4 text-neutral-500" />
                                        <span className="font-semibold text-neutral-900">{order.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                        <Phone className="w-4 h-4" />
                                        <span>{order.phone}</span>
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(order.status)}>{t(`orders.status.${order.status}`)}</Badge>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        {t('orders.amount')}
                                    </span>
                                    <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        {t('orders.driver')}
                                    </span>
                                    <span className="font-medium text-neutral-700">{order.assignedDriver?.name || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {t('orders.date')}
                                    </span>
                                    <span className="text-neutral-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap mt-auto pt-4 border-t border-neutral-100">
                                {order.status === 'PENDING' && (
                                    <Button size="sm" variant="primary" onClick={() => handleConfirm(order.id)} className="flex-1">
                                        {t('common.confirm')}
                                    </Button>
                                )}
                                {order.status === 'CONFIRMED' && (
                                    <Button size="sm" variant="primary" onClick={() => handlePreparing(order.id)} className="flex-1">
                                        {t('orders.status.PREPARING')}
                                    </Button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <Button size="sm" variant="primary" onClick={() => handleReady(order.id)} className="flex-1">
                                        {t('orders.status.READY')}
                                    </Button>
                                )}
                                {order.status === 'READY' && (
                                    <Button size="sm" variant="primary" onClick={() => setSelectedOrder(order)} className="flex-1">
                                        {t('orders.assignDriver')}
                                    </Button>
                                )}
                                {!['COMPLETED', 'CANCELED'].includes(order.status) && (
                                    <Button size="sm" variant="secondary" onClick={() => handleCancel(order.id)}>
                                        {t('common.cancel')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {orders.length === 0 && !loading && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500">
                        No orders found
                    </div>
                </Card>
            )}

            {/* Assign Driver Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="w-full max-w-md">
                        <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('orders.assignDriver')}</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('orders.selectDriver')}</label>
                            <select
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                            >
                                <option value="">{t('orders.selectDriver')}</option>
                                {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} ({driver.email})</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleAssignDriver} disabled={!selectedDriver} variant="primary" className="flex-1">
                                {t('common.confirm')}
                            </Button>
                            <Button onClick={() => setSelectedOrder(null)} variant="secondary" className="flex-1">
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrdersPage;
