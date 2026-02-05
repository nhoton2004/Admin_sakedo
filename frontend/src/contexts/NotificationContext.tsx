import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrderService } from '../services/orderService';

interface NotificationContextType {
    pendingCount: number;
    refreshCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    pendingCount: 0,
    refreshCount: async () => { },
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pendingCount, setPendingCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);

    const refreshCount = async () => {
        try {
            const count = await OrderService.getPendingCount();
            setPendingCount(count);

            // Show notification if count increased (new order arrived)
            if (count > previousCount && previousCount > 0) {
                const newOrders = count - previousCount;
                showNotification(`${newOrders} đơn hàng mới!`);
            }

            setPreviousCount(count);
        } catch (error) {
            console.error('Failed to fetch pending count:', error);
        }
    };

    const showNotification = (message: string) => {
        // Browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('SAKEDO Restaurant', {
                body: message,
                icon: '/logo.png',
            });
        }

        // TODO: Can also show toast notification in UI
        console.log('📢 Notification:', message);
    };

    useEffect(() => {
        // Initial load
        refreshCount();

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Poll every 5 seconds
        const interval = setInterval(refreshCount, 5000);

        return () => clearInterval(interval);
    }, [previousCount]);

    return (
        <NotificationContext.Provider value={{ pendingCount, refreshCount }}>
            {children}
        </NotificationContext.Provider>
    );
};
