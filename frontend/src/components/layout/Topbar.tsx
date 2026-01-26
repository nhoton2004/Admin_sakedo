import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bell, ChevronDown, Check } from 'lucide-react';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface TopbarProps {
    notificationCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({ notificationCount = 0 }) => {
    const { t, i18n } = useTranslation();
    const [showLangMenu, setShowLangMenu] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setShowLangMenu(false);
    };

    return (
        <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-neutral-100 z-40">
            <div className="h-full px-6 flex items-center justify-between gap-6">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <Input
                        type="text"
                        placeholder={t('common.search')}
                        icon={<Search className="w-4 h-4" />}
                        className="bg-neutral-50"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">

                    {/* Notifications */}
                    <button className="relative p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-neutral-600" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1">
                                <Badge variant="danger" size="sm">
                                    {notificationCount}
                                </Badge>
                            </span>
                        )}
                    </button>

                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 rounded-lg transition-colors"
                        >
                            <span className="text-xl">{i18n.language === 'en' ? '🇬🇧' : '🇻🇳'}</span>
                            <span className="text-sm font-medium text-neutral-700">
                                {i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                        </button>

                        {showLangMenu && (
                            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden py-1 z-50">
                                <button
                                    onClick={() => changeLanguage('vi')}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">🇻🇳</span> Tiếng Việt
                                    </span>
                                    {i18n.language === 'vi' && <Check className="w-4 h-4 text-primary" />}
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">🇬🇧</span> English
                                    </span>
                                    {i18n.language === 'en' && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <button className="flex items-center gap-3 hover:bg-neutral-50 px-2 py-1 rounded-lg transition-colors">
                        <img
                            src="https://ui-avatars.com/api/?name=Admin&background=FF6A3D&color=fff"
                            alt="Admin"
                            className="w-9 h-9 rounded-full"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};
