import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { User, UserService } from '../services';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ChevronRight, Users, Mail, Phone, Calendar, Plus, X, Pencil, Trash2, Lock, Unlock } from 'lucide-react';

const CustomersPage: React.FC = () => {
    const { t } = useTranslation();
    const [customers, setCustomers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await UserService.getAll({ role: 'USER' });
            setCustomers(data);
        } catch (error) {
            console.error('Failed to load customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '', password: '123456' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (customer: User) => {
        setEditingCustomer(customer);
        setFormData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            password: '' // Keep empty unless changing
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                // Edit
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password

                await UserService.update(editingCustomer.id, updateData);
                alert('Cập nhật thành công!');
            } else {
                // Create
                await UserService.create({
                    ...formData,
                    password: formData.password || '123456',
                    role: 'USER'
                });
                alert('Tạo khách hàng thành công!');
            }
            setIsModalOpen(false);
            loadCustomers();
        } catch (error: any) {
            console.error('Failed to save customer:', error);
            alert(error.response?.data?.message || 'Failed to save customer');
        }
    };

    const handleDelete = async (customer: User) => {
        if (!window.confirm(`Bạn có chắc muốn xóa khách hàng "${customer.name}"? Hành động này không thể hoàn tác.`)) return;

        try {
            await UserService.delete(customer.id);
            loadCustomers(); // Reload list
        } catch (error: any) {
            console.error('Failed to delete:', error);
            alert('Không thể xóa khách hàng này.');
        }
    };

    const handleToggleActive = async (customer: User) => {
        try {
            await UserService.toggleActive(customer.id);
            // Optimistic update or reload
            loadCustomers();
        } catch (error) {
            console.error('Failed to toggle status:', error);
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
                <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {t('common.add') || 'Thêm mới'}
                </Button>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {customers.map((customer) => (
                    <Card key={customer.id} padding="md" hover className="relative group">
                        {/* Action Buttons (Absolute Top Right) */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleOpenEdit(customer)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Sửa"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleToggleActive(customer)}
                                className={`p-1.5 rounded-full ${customer.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                title={customer.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                            >
                                {customer.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => handleDelete(customer)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full"
                                title="Xóa"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center mt-2">
                            {/* Avatar */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-sm text-xl font-bold
                                ${customer.isActive ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-neutral-400'}`}>
                                {customer.avatar ? (
                                    <img src={customer.avatar} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    customer.name.charAt(0).toUpperCase()
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
                                    <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {customers.length === 0 && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500 flex flex-col items-center">
                        <Users className="w-12 h-12 mb-4 text-neutral-300" />
                        <h3 className="text-lg font-medium text-neutral-900 mb-1">{t('customers.noCustomers')}</h3>
                        <p>{t('customers.noCustomersDesc')}</p>
                    </div>
                </Card>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-neutral-900 mb-6">
                            {editingCustomer ? 'Sửa thông tin khách hàng' : (t('common.add') || 'Thêm Khách Hàng')}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('common.name')}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('common.email')}</label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingCustomer} // Disable email editing if update logic is strict, but service allows it. Let's keep editable. Actually service checks duplicates.
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">{t('common.phone')}</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('auth.password')} {editingCustomer && <span className="text-xs font-normal text-neutral-500">(Để trống nếu không đổi)</span>}
                                </label>
                                <input
                                    type="password"
                                    required={!editingCustomer} // Required only for create
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingCustomer ? "******" : ""}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {editingCustomer ? t('common.saveChanges') : t('common.add')}
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
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

export default CustomersPage;
