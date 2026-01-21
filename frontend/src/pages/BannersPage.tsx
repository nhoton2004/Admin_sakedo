import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Banner, BannerService, CreateBannerDto } from '../services/bannerService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react';

const BannersPage: React.FC = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageUrl: '',
        ctaText: '',
        ctaLink: '',
        order: 0,
    });

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
            const data = await BannerService.getAll();
            setBanners(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await BannerService.update(editingBanner.id, formData);
            } else {
                await BannerService.create(formData as CreateBannerDto);
            }
            setShowModal(false);
            resetForm();
            loadBanners();
        } catch (error: any) {
            alert(error.response?.data?.message || t('common.error'));
        }
    };

    const resetForm = () => {
        setFormData({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '', order: 0 });
        setEditingBanner(null);
    };

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            imageUrl: banner.imageUrl,
            ctaText: banner.ctaText || '',
            ctaLink: banner.ctaLink || '',
            order: banner.order,
        });
        setShowModal(true);
    };

    const handleToggleActive = async (id: string) => {
        await BannerService.toggleActive(id);
        loadBanners();
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('common.confirm'))) {
            await BannerService.delete(id);
            loadBanners();
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
                <span>{t('nav.content')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('nav.banners')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{t('banners.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('banners.subtitle')}</p>
                </div>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus className="w-4 h-4" />
                    {t('banners.addBanner')}
                </Button>
            </div>

            {/* Banners List */}
            <Card padding="lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-100 text-left">
                                <th className="pb-4 font-semibold text-neutral-900 pl-4">{t('banners.banner')}</th>
                                <th className="pb-4 font-semibold text-neutral-900">{t('banners.title')} / {t('banners.subtitle')}</th>
                                <th className="pb-4 font-semibold text-neutral-900 text-center">{t('banners.order')}</th>
                                <th className="pb-4 font-semibold text-neutral-900">{t('common.status')}</th>
                                <th className="pb-4 font-semibold text-neutral-900 text-right pr-4">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((banner) => (
                                <tr key={banner.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="w-32 h-16 rounded-lg bg-neutral-100 overflow-hidden relative border border-neutral-200">
                                            {banner.imageUrl ? (
                                                <img
                                                    src={banner.imageUrl}
                                                    alt={banner.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-neutral-400">
                                                    <ImageIcon className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="font-bold text-neutral-900">{banner.title}</div>
                                        <div className="text-sm text-neutral-500">{banner.subtitle || '-'}</div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 font-bold text-neutral-700 text-sm">
                                            {banner.order}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <Badge variant={banner.isActive ? 'success' : 'neutral'}>
                                            {banner.isActive ? t('common.active') : t('common.inactive')}
                                        </Badge>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(banner)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                                title={t('common.edit')}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(banner.id)}
                                                className={`p-2 rounded-lg transition-colors ${banner.isActive ? 'hover:bg-orange-50 text-orange-600' : 'hover:bg-green-50 text-green-600'}`}
                                                title={t('common.toggleStatus')}
                                            >
                                                {banner.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {banners.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-neutral-500">
                                        {t('common.loading')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-neutral-900">
                                {editingBanner ? t('banners.editBanner') : t('banners.addBanner')}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.title')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                                placeholder={t('banners.titlePlaceholder')}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.subtitle')}</label>
                                            <input
                                                type="text"
                                                value={formData.subtitle}
                                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                                placeholder={t('banners.subtitlePlaceholder')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.imageUrl')}</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all mb-4"
                                            placeholder="https://..."
                                        />

                                        {/* Image Preview */}
                                        <div className="w-full h-32 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center overflow-hidden">
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-neutral-400 text-sm flex flex-col items-center">
                                                    <ImageIcon className="w-8 h-8 mb-2" />
                                                    <span>{t('banners.imagePreview')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.ctaText')}</label>
                                        <input
                                            type="text"
                                            value={formData.ctaText}
                                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                            placeholder="e.g. Order Now"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.ctaLink')}</label>
                                        <input
                                            type="text"
                                            value={formData.ctaLink}
                                            onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                            placeholder="/menu"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('banners.order')}</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">{t('banners.orderHint')}</p>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-neutral-100">
                                    <Button type="submit" variant="primary" className="flex-1">
                                        {t('common.save')}
                                    </Button>
                                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                                        {t('common.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BannersPage;
