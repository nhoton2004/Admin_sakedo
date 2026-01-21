import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language, setLanguage } = useLanguage();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: t('dashboard'), icon: '📊' },
        { path: '/admin/banners', label: t('banners'), icon: '🖼️' },
        { path: '/admin/video', label: t('video'), icon: '🎥' },
        { path: '/admin/about', label: t('aboutUs'), icon: 'ℹ️' },
        { path: '/admin/categories', label: t('categories'), icon: '📁' },
        { path: '/admin/products', label: t('products'), icon: '🍔' },
        { path: '/admin/reservations', label: t('reservations'), icon: '📅' },
        { path: '/admin/orders', label: t('orders'), icon: '🛒' },
        { path: '/admin/drivers', label: t('drivers'), icon: '🚗' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-blue-600 to-blue-800 shadow-2xl">
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="mb-8 px-4 py-3 border-b border-blue-500/30">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span>🍽️</span>
                            {t('restaurantAdmin')}
                        </h2>
                        <p className="text-sm text-blue-200 mt-1">{t('adminPanel')}</p>
                    </div>

                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-xl transition-all duration-200 ${location.pathname === item.path
                                        ? 'bg-white text-blue-600 shadow-lg font-semibold'
                                        : 'text-white hover:bg-white/10 hover:translate-x-1'
                                        }`}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="flex-1">{item.label}</span>
                                    {location.pathname === item.path && (
                                        <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm backdrop-blur-sm bg-white/80">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {menuItems.find((item) => item.path === location.pathname)?.label || t('adminPanel')}
                        </h1>

                        <div className="flex items-center gap-4">
                            {/* Language Switcher */}
                            <button
                                onClick={toggleLanguage}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                                title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
                            >
                                <span className="text-lg">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                            </button>

                            <div className="text-right bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
                                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
