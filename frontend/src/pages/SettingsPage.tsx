import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ChevronRight, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.settings')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('settings.general')}</span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">{t('nav.settings')}</h1>

            <div className="max-w-4xl">
                <Card padding="lg">
                    <h2 className="text-lg font-bold text-neutral-900 mb-6">{t('settings.storeInfo')}</h2>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('settings.storeName')}
                                </label>
                                <Input placeholder="Sakedo Sushi" defaultValue="Sakedo Sushi" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('settings.email')}
                                </label>
                                <Input placeholder="contact@sakedo.com" defaultValue="contact@sakedo.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('settings.phone')}
                                </label>
                                <Input placeholder="+84 123 456 789" defaultValue="+84 123 456 789" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    {t('settings.address')}
                                </label>
                                <Input placeholder="123 Street, District 1, HCMC" defaultValue="123 Street, District 1, HCMC" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                {t('settings.description')}
                            </label>
                            <textarea
                                className="w-full rounded-xl border border-neutral-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                                placeholder="Restaurant description..."
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-neutral-100">
                            <Button variant="primary">
                                <Save className="w-4 h-4 mr-2" />
                                {t('common.save')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;
