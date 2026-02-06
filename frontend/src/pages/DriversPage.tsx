import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { DriverService, DriverStats } from '../services/driverService';
import { User } from '../services/authService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
    Users,
    Truck,
    Star,
    DollarSign,
    MapPin,
    Phone,
    Plus,
    ToggleLeft,
    ToggleRight,
    Trash2
} from 'lucide-react';

export const DriversPage: React.FC = () => {
    const { t } = useTranslation();
    const [drivers, setDrivers] = useState<User[]>([]);
    const [stats, setStats] = useState<DriverStats>({ totalDrivers: 0, activeDrivers: 0, totalEarnings: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Driver Form State
    const [newDriver, setNewDriver] = useState({
        name: '',
        email: '',
        phone: '',
        vehiclePlate: '',
        area: '',
        password: '123456'
    });

    useEffect(() => {
        loadData();

        // Auto-refresh every 10 seconds to sync with MongoDB changes
        const refreshInterval = setInterval(() => {
            loadData();
        }, 10000); // 10 seconds

        // Cleanup interval on unmount
        return () => clearInterval(refreshInterval);
    }, []);

    const loadData = async () => {
        try {
            const [driversData, statsData] = await Promise.all([
                DriverService.getAll(),
                DriverService.getStats()
            ]);
            setDrivers(driversData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load drivers data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await DriverService.create(newDriver);
            setShowModal(false);
            setNewDriver({ name: '', email: '', phone: '', vehiclePlate: '', area: '', password: '123456' });
            loadData();
        } catch (error) {
            alert('Failed to create driver');
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await DriverService.toggleActive(id);
            loadData();
        } catch (error) {
            alert('Không thể cập nhật trạng thái tài xế');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn có chắc muốn xóa tài xế "${name}"?`)) {
            try {
                await DriverService.delete(id);
                loadData();
            } catch (error) {
                alert('Không thể xóa tài xế');
            }
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'AVAILABLE': return 'success';
            case 'BUSY': return 'warning';
            case 'OFFLINE': return 'neutral';
            default: return 'neutral';
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{t('nav.drivers') || 'Quản lý Tài xế'}</h1>
                    <p className="text-neutral-500">Quản lý đội ngũ giao hàng và theo dõi hiệu suất</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="w-4 h-4" />
                    Thêm tài xế
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Tổng tài xế</p>
                        <h3 className="text-2xl font-bold text-neutral-900">{stats.totalDrivers}</h3>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Đang hoạt động</p>
                        <h3 className="text-2xl font-bold text-neutral-900">{stats.activeDrivers}</h3>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-neutral-500">Tổng doanh thu</p>
                        <h3 className="text-2xl font-bold text-neutral-900">
                            {stats.totalEarnings.toLocaleString('vi-VN')} ₫
                        </h3>
                    </div>
                </Card>
            </div>

            {/* Drivers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <Card key={driver.id} hover className={`group ${!driver.isActive ? 'opacity-60' : ''}`}>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={driver.avatar || `https://ui-avatars.com/api/?name=${driver.name}&background=random`}
                                            alt={driver.name}
                                            className="w-12 h-12 rounded-full object-cover border border-neutral-100"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                                            ${driver.driverStatus === 'AVAILABLE' ? 'bg-green-500' :
                                                driver.driverStatus === 'BUSY' ? 'bg-yellow-500' : 'bg-neutral-400'}`}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900">{driver.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span className="font-medium">{driver.rating || 5.0}</span>
                                            </div>
                                            {!driver.isActive && <Badge variant="neutral">Tạm dừng</Badge>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleToggleActive(driver.id)}
                                        className={`p-2 rounded-lg transition-colors ${driver.isActive
                                            ? 'text-orange-600 hover:bg-orange-50'
                                            : 'text-green-600 hover:bg-green-50'
                                            }`}
                                        title={driver.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                    >
                                        {driver.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(driver.id, driver.name)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa tài xế"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Phone className="w-4 h-4 text-neutral-400" />
                                    <span>{driver.phone || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <Truck className="w-4 h-4 text-neutral-400" />
                                    <span>{driver.vehiclePlate || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-neutral-600">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <span>{driver.area || 'Chưa cập nhật'}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-neutral-500 text-center">Đơn hàng</p>
                                    <p className="font-bold text-neutral-900 text-center">{driver.totalOrders || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 text-center">Thu nhập</p>
                                    <p className="font-bold text-primary text-center">
                                        {(driver.totalEarnings || 0).toLocaleString('vi-VN')} ₫
                                    </p>
                                </div>
                                <div>
                                    <Badge variant={getStatusColor(driver.driverStatus)}>
                                        {driver.driverStatus || 'OFFLINE'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-neutral-100">
                            <h2 className="text-xl font-bold">Thêm tài xế mới</h2>
                        </div>
                        <form onSubmit={handleCreateDriver} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">Họ tên</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={newDriver.name}
                                    onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                    <input
                                        required type="email"
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={newDriver.email}
                                        onChange={e => setNewDriver({ ...newDriver, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Số điện thoại</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={newDriver.phone}
                                        onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Biển số xe</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={newDriver.vehiclePlate}
                                        onChange={e => setNewDriver({ ...newDriver, vehiclePlate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">Khu vực</label>
                                    <input
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        value={newDriver.area}
                                        onChange={e => setNewDriver({ ...newDriver, area: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Hủy</Button>
                                <Button variant="primary" type="submit">Thêm tài xế</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
