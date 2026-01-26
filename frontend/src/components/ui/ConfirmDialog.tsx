import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    const iconColors = {
        danger: 'text-red-500 bg-red-50',
        warning: 'text-yellow-500 bg-yellow-50',
        info: 'text-blue-500 bg-blue-50',
    };

    const buttonColors = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        info: 'bg-blue-500 hover:bg-blue-600 text-white',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
                    <p className="text-neutral-600 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {cancelText}
                        </Button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-5 py-2.5 rounded-full font-medium transition-colors ${buttonColors[variant]} disabled:opacity-50`}
                        >
                            {isLoading ? 'Loading...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
