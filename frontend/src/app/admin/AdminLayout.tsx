import React from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Topbar } from '../../components/layout/Topbar';
import { analyticsData } from '../../mock/analyticsData';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Sidebar />
            <Topbar notificationCount={analyticsData.notificationCount} />

            <main className="ml-64 pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};
