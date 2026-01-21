import React from 'react';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Card } from '../components/ui/Card';

const DashboardPageNew: React.FC = () => {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-neutral-900 mb-6">Dashboard</h1>

            <Card padding="lg">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                        Dashboard Overview
                    </h2>
                    <p className="text-neutral-500">
                        Dashboard content will be implemented here
                    </p>
                </div>
            </Card>
        </AdminLayout>
    );
};

export default DashboardPageNew;
