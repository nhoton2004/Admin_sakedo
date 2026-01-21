import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/authService';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await AuthService.login(formData);

            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('user', JSON.stringify(response.user));

            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Language Switcher */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <span className="text-lg">{i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                            <span>{i18n.language === 'vi' ? 'VI' : 'EN'}</span>
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                            <span className="text-3xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.title')}</h1>
                        <p className="text-gray-600">{t('auth.subtitle')}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input"
                                placeholder="admin@akedo.local"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.password')}
                            </label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('auth.signingIn') : t('auth.signIn')}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 text-center mb-2">{t('auth.defaultCredentials')}</p>
                        <p className="text-xs text-gray-800 font-mono text-center">
                            admin@akedo.local / Admin@123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
