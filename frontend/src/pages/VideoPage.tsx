import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { HomeService } from '../services/homeService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronRight, Youtube, Video, ExternalLink } from 'lucide-react';

const VideoPage: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        loadVideo();
    }, []);

    const loadVideo = async () => {
        try {
            const data = await HomeService.getVideo();
            setVideoUrl(data.videoUrl || '');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await HomeService.updateVideo({ videoUrl });
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
                <span className="text-neutral-900 font-medium">{t('nav.video')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">{t('video.title')}</h1>
                    <p className="text-sm text-neutral-500 mt-1">{t('video.subtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Card */}
                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-neutral-900 mb-2">
                                {t('video.videoUrl')}
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                                    <Youtube className="w-5 h-5" />
                                </div>
                                <input
                                    type="url"
                                    required
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 ml-1">
                                {t('video.hint')}
                            </p>
                        </div>

                        {videoUrl && (
                            <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-neutral-900 mb-1">{t('video.currentVideo')}</p>
                                    <a
                                        href={videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline truncate block text-sm flex items-center gap-1"
                                    >
                                        {videoUrl}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-neutral-100">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={saving}
                                className="w-full justify-center py-3 text-base"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        {t('common.saving')}
                                    </>
                                ) : (
                                    t('common.save')
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Info / Preview Card */}
                <Card padding="lg" className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-white border-none">
                    <div className="h-full flex flex-col justify-center items-center text-center p-6">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Video className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{t('video.displayTitle')}</h3>
                        <p className="text-white/70 mb-8 max-w-sm">
                            {t('video.displayDesc')}
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Recommended</p>
                                <p className="font-semibold">YouTube / Vimeo</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Quality</p>
                                <p className="font-semibold">HD (1080p)</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default VideoPage;
