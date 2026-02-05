import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Users,
    BarChart3,
    ChevronDown,
    Settings,
    Calendar,
    Truck,
} from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    submenu?: SubMenuItem[];
}

interface SubMenuItem {
    id: string;
    label: string;
    path: string;
}

export const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            label: t('nav.dashboard'),
            icon: <LayoutDashboard className="w-5 h-5" />,
            path: '/admin/dashboard',
        },
        {
            id: 'orders',
            label: t('nav.orders'),
            icon: <ShoppingBag className="w-5 h-5" />,
            path: '/admin/orders',
        },
        {
            id: 'menus',
            label: t('nav.menus'),
            icon: <UtensilsCrossed className="w-5 h-5" />,
            path: '/admin/products',
            submenu: [
                { id: 'menu-list', label: t('nav.menus'), path: '/admin/products' },
                { id: 'categories', label: t('categories.title'), path: '/admin/categories' },
            ],
        },
        {
            id: 'customers',
            label: t('nav.customers'),
            icon: <Users className="w-5 h-5" />,
            path: '/admin/customers',
        },
        {
            id: 'reservations',
            label: t('dashboard.kpi.reservations'),
            icon: <Calendar className="w-5 h-5" />,
            path: '/admin/reservations',
        },
        {
            id: 'drivers',
            label: 'Tài xế', // Or use t('nav.drivers') if key exists
            icon: <Truck className="w-5 h-5" />,
            path: '/admin/drivers',
        },
        {
            id: 'analytics',
            label: t('nav.analytics'),
            icon: <BarChart3 className="w-5 h-5" />,
            path: '/admin/analytics',
        },
        {
            id: 'settings',
            label: t('nav.settings'),
            icon: <Settings className="w-5 h-5" />,
            path: '/admin/settings',
        },
        {
            id: 'profile',
            label: t('nav.profile'),
            icon: <Users className="w-5 h-5" />, // User icon reused or imported new
            path: '/admin/profile',
        },
    ];

    const toggleSubmenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const isActive = (path: string) => location.pathname === path;
    const isMenuActive = (item: MenuItem) => {
        if (isActive(item.path)) return true;
        return item.submenu?.some(sub => isActive(sub.path)) || false;
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-100">
                <h1 className="text-xl font-bold text-neutral-800">
                    SAKEDO Restaurant
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <div>
                                <Link
                                    to={item.path}
                                    onClick={(e) => {
                                        if (item.submenu) {
                                            e.preventDefault();
                                            toggleSubmenu(item.id);
                                        }
                                    }}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl
                                        transition-all duration-200 group
                                        ${isMenuActive(item)
                                            ? 'bg-primary-50 text-primary'
                                            : 'text-neutral-600 hover:bg-neutral-50'
                                        }
                                    `}
                                >
                                    <span className={isMenuActive(item) ? 'text-primary' : 'text-neutral-500'}>
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    {item.submenu && (
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''
                                                }`}
                                        />
                                    )}
                                </Link>

                                {/* Submenu */}
                                {item.submenu && expandedMenus.includes(item.id) && (
                                    <ul className="mt-1 ml-12 space-y-1">
                                        {item.submenu.map(subItem => (
                                            <li key={subItem.id}>
                                                <Link
                                                    to={subItem.path}
                                                    className={`
                                                        block px-4 py-2 rounded-lg text-sm
                                                        transition-colors
                                                        ${isActive(subItem.path)
                                                            ? 'text-primary font-medium'
                                                            : 'text-neutral-500 hover:text-neutral-700'
                                                        }
                                                    `}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 text-center">
                    SAKEDO Restaurant Admin
                </p>
            </div>
        </aside>
    );
};
