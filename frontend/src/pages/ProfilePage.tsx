import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ChevronRight, Save, User, Lock, Camera } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <AdminLayout>
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.account')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('nav.profile')}</span>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('nav.profile')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <Card padding="lg">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold border-4 border-white shadow-lg">
                                    A
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md text-neutral-600 hover:text-primary transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900">Admin User</h2>
                            <p className="text-neutral-500">admin@akedo.local</p>
                            <div className="mt-4 py-1 px-3 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                                Administrator
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-neutral-900">
                            <User className="w-5 h-5" />
                            <h3 className="font-bold">{t('profile.personalInfo')}</h3>
                        </div>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        {t('common.name')}
                                    </label>
                                    <Input defaultValue="Admin User" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        {t('common.email')}
                                    </label>
                                    <Input defaultValue="admin@akedo.local" disabled />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        {t('common.phone')}
                                    </label>
                                    <Input placeholder="+84 ..." />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="primary">
                                    <Save className="w-4 h-4 mr-2" />
                                    {t('common.save')}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card padding="lg">
                        <div className="flex items-center gap-2 mb-6 text-neutral-900">
                            <Lock className="w-5 h-5" />
                            <h3 className="font-bold">{t('profile.security')}</h3>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('profile.currentPassword')}
                                </label>
                                <Input type="password" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        {t('profile.newPassword')}
                                    </label>
                                    <Input type="password" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        {t('profile.confirmPassword')}
                                    </label>
                                    <Input type="password" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="secondary" className="text-neutral-500 hover:text-primary">
                                    {t('profile.updatePassword')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ProfilePage;
