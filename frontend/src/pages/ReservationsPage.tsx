import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Reservation, ReservationService } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, User, Phone, Calendar, Users, StickyNote } from 'lucide-react';

const ReservationsPage: React.FC = () => {
    const { t } = useTranslation();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ date: '', status: '' });

    useEffect(() => {
        loadReservations();

        // Auto-refresh every 10 seconds to sync with MongoDB changes
        const refreshInterval = setInterval(() => {
            loadReservations();
        }, 10000);

        return () => clearInterval(refreshInterval);
    }, [filters]);

    const loadReservations = async () => {
        try {
            const data = await ReservationService.getAll(filters);
            setReservations(data);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (id: string) => {
        await ReservationService.confirm(id);
        loadReservations();
    };

    const handleCancel = async (id: string) => {
        if (confirm(t('common.confirm'))) {
            await ReservationService.cancel(id);
            loadReservations();
        }
    };

    const handleComplete = async (id: string) => {
        await ReservationService.complete(id);
        loadReservations();
    };

    const getStatusVariant = (status: string) => {
        const map: any = {
            NEW: 'primary',
            CONFIRMED: 'warning',
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
                <span>{t('dashboard.kpi.reservations')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('reservations.title')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{t('reservations.title')}</h1>
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                    >
                        <option value="">{t('common.status')}</option>
                        <option value="NEW">{t('reservations.status.PENDING')}</option>
                        <option value="CONFIRMED">{t('reservations.status.CONFIRMED')}</option>
                        <option value="COMPLETED">{t('reservations.status.COMPLETED')}</option>
                        <option value="CANCELED">{t('reservations.status.CANCELLED')}</option>
                    </select>
                </div>
            </div>

            {/* Reservations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {reservations.map((res) => (
                    <Card key={res.id} padding="md" hover>
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-neutral-500" />
                                        <span className="font-semibold text-neutral-900">{res.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                        <Phone className="w-4 h-4" />
                                        <span>{res.phone}</span>
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(res.status)}>{t(`reservations.status.${res.status === 'NEW' ? 'PENDING' : res.status}`)}</Badge>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {t('reservations.date')}
                                    </span>
                                    <span className="font-medium text-neutral-700">
                                        {new Date(res.datetime).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {t('reservations.guests')}
                                    </span>
                                    <span className="font-medium text-neutral-700">{res.guests} {t('reservations.people')}</span>
                                </div>
                                {res.note && (
                                    <div className="flex items-start gap-2 text-sm mt-3 pt-3 border-t border-neutral-100">
                                        <StickyNote className="w-4 h-4 text-neutral-500 mt-0.5" />
                                        <span className="text-neutral-600 text-xs">{res.note}</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap mt-auto pt-4 border-t border-neutral-100">
                                {res.status === 'NEW' && (
                                    <>
                                        <Button size="sm" variant="primary" onClick={() => handleConfirm(res.id)} className="flex-1">
                                            {t('common.confirm')}
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleCancel(res.id)}>
                                            {t('common.cancel')}
                                        </Button>
                                    </>
                                )}
                                {res.status === 'CONFIRMED' && (
                                    <>
                                        <Button size="sm" variant="primary" onClick={() => handleComplete(res.id)} className="flex-1">
                                            {t('reservations.complete')}
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleCancel(res.id)}>
                                            {t('common.cancel')}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {reservations.length === 0 && !loading && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500">
                        No reservations found
                    </div>
                </Card>
            )}
        </AdminLayout>
    );
};

export default ReservationsPage;
