import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { AboutService, UpdateAboutDto } from '../services/aboutService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, ImageIcon, AlignLeft, Info } from 'lucide-react';

const AboutPage: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        heading: '',
        content: '',
        imageUrl: '',
    });

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            const data = await AboutService.get();
            setFormData({
                heading: data.heading || '',
                content: data.content || '',
                imageUrl: data.imageUrl || '',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await AboutService.update(formData as UpdateAboutDto);
            alert(t('common.saveSuccess'));
        } catch (error: any) {
            alert(error.response?.data?.message || t('common.error'));
        } finally {
            setSaving(false);
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
                <span className="text-neutral-900 font-medium">{t('nav.about')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{t('about.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('about.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card padding="lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    {t('about.heading')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.heading}
                                    onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none transition-all font-medium"
                                    placeholder={t('about.headingPlaceholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4 text-primary" />
                                    {t('about.content')}
                                </label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none transition-all min-h-[200px]"
                                    placeholder={t('about.contentPlaceholder')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-primary" />
                                    {t('about.imageUrl')} (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="pt-4 border-t border-neutral-100 flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={saving}
                                    className="w-32 justify-center"
                                >
                                    {saving ? t('common.saving') : t('common.save')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-1">
                    <Card padding="lg" className="sticky top-6">
                        <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('about.preview')}</h3>

                        <div className="space-y-4">
                            {/* Image Preview */}
                            <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 aspect-video relative">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                            e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-red-500">Image load failed</span>';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-sm">{t('about.noImage')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Text Preview */}
                            <div>
                                <h4 className="font-bold text-xl text-neutral-900 mb-2">
                                    {formData.heading || <span className="text-neutral-300 italic">Heading</span>}
                                </h4>
                                <div className="text-neutral-600 text-sm line-clamp-6 whitespace-pre-line">
                                    {formData.content || <span className="text-neutral-300 italic">Content preview...</span>}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AboutPage;
