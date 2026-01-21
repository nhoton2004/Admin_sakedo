import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { User, UserService, CreateUserDto } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, Plus, Truck, Mail, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

const DriversPage: React.FC = () => {
    const { t } = useTranslation();
    const [drivers, setDrivers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            const data = await UserService.getAll({ role: 'DRIVER' });
            setDrivers(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await UserService.create({ ...formData, role: 'DRIVER' } as CreateUserDto);
            setShowModal(false);
            setFormData({ name: '', email: '', password: '' });
            loadDrivers();
        } catch (error: any) {
            alert(error.response?.data?.message || t('common.error'));
        }
    };

    const handleToggleActive = async (id: string) => {
        await UserService.toggleActive(id);
        loadDrivers();
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
                <span>{t('nav.settings')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('drivers.title')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{t('drivers.title')}</h1>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    {t('drivers.addDriver')}
                </Button>
            </div>

            {/* Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drivers.map((driver) => (
                    <Card key={driver.id} padding="md" hover>
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-4 shadow-lg">
                                <Truck className="w-10 h-10" />
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-neutral-900 mb-1">{driver.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{driver.email}</span>
                            </div>

                            {/* Status */}
                            <Badge variant={driver.isActive ? 'success' : 'neutral'} className="mb-4">
                                {driver.isActive ? t('common.active') : t('common.inactive')}
                            </Badge>

                            {/* Created Date */}
                            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-4">
                                <Calendar className="w-3 h-3" />
                                <span>{t('auth.createdAt')} {new Date(driver.createdAt).toLocaleDateString()}</span>
                            </div>

                            {/* Action */}
                            <Button
                                size="sm"
                                variant={driver.isActive ? 'secondary' : 'primary'}
                                onClick={() => handleToggleActive(driver.id)}
                                className="w-full"
                            >
                                {driver.isActive ? (
                                    <>
                                        <ToggleRight className="w-4 h-4" />
                                        {t('common.inactive')}
                                    </>
                                ) : (
                                    <>
                                        <ToggleLeft className="w-4 h-4" />
                                        {t('common.active')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {drivers.length === 0 && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500">
                        {t('common.loading')}
                    </div>
                </Card>
            )}

            {/* Add Driver Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="w-full max-w-md">
                        <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('drivers.addDriver')}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('drivers.name')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                                    placeholder={t('drivers.name')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('auth.email')}</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                                    placeholder="driver@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('auth.password')}</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200"
                                    placeholder="Minimum 6 characters"
                                />
                                <p className="text-xs text-neutral-500 mt-1">Minimum 6 characters</p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {t('common.save')}
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </AdminLayout>
    );
};

export default DriversPage;
