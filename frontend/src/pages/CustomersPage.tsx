import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { User, UserService } from '../services';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, Users, Mail, Calendar, Phone } from 'lucide-react';

const CustomersPage: React.FC = () => {
    const { t } = useTranslation();
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            // Assuming UserService.getAll can filter by role, or we filter manually if needed
            // Based on DriversPage which used { role: 'DRIVER' }, we use { role: 'CUSTOMER' }
            const data = await UserService.getAll({ role: 'CUSTOMER' });
            setCustomers(data);
        } catch (error) {
            console.error('Failed to load customers:', error);
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

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.management')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('nav.customers')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{t('nav.customers')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('customers.subtitle')} ({customers.length})</p>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {customers.map((customer) => (
                    <Card key={customer.id} padding="md" hover>
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 mb-4 shadow-sm border border-purple-100">
                                {customer.avatar ? (
                                    <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-xl font-bold">{customer.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-neutral-900 mb-1">{customer.name}</h3>

                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[180px]" title={customer.email}>{customer.email}</span>
                            </div>

                            {customer.phone && (
                                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}

                            {/* Status */}
                            <Badge variant={customer.isActive ? 'success' : 'neutral'} className="mb-4">
                                {customer.isActive ? t('common.active') : t('common.inactive')}
                            </Badge>

                            {/* Meta */}
                            <div className="w-full pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{t('auth.createdAt')} {new Date(customer.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {customers.length === 0 && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">{t('customers.noCustomers')}</h3>
                        <p>{t('customers.noCustomersDesc')}</p>
                    </div>
                </Card>
            )}
        </AdminLayout>
    );
};

export default CustomersPage;
