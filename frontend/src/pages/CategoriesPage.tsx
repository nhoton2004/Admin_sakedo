import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Category, CategoryService } from '../services/categoryService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChevronRight, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const CategoriesPage: React.FC = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            alert(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await CategoryService.update(editingCategory.id, formData);
            } else {
                await CategoryService.create(formData);
            }
            setShowModal(false);
            setFormData({ name: '' });
            setEditingCategory(null);
            loadCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || t('common.error'));
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setShowModal(true);
    };

    const handleToggleActive = async (id: string) => {
        try {
            await CategoryService.toggleActive(id);
            loadCategories();
        } catch (error) {
            alert(t('common.error'));
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('common.confirm'))) {
            try {
                await CategoryService.delete(id);
                loadCategories();
            } catch (error) {
                alert(t('common.error'));
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-neutral-500">{t('common.loading')}</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-500 mb-4">
                <span>{t('nav.menus')}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium">{t('categories.title')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{t('categories.title')}</h1>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '' });
                        setShowModal(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    {t('categories.addTitle')}
                </Button>
            </div>

            {/* Table Card */}
            <Card padding="lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="text-left py-4 px-4 text-sm font-bold text-neutral-600 uppercase">{t('categories.name')}</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-neutral-600 uppercase">{t('common.status')}</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-neutral-600 uppercase">{t('auth.createdAt')}</th>
                                <th className="text-left py-4 px-4 text-sm font-bold text-neutral-600 uppercase">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-neutral-900">{cat.name}</td>
                                    <td className="py-4 px-4">
                                        <Badge variant={cat.isActive ? 'success' : 'neutral'}>
                                            {cat.isActive ? t('common.active') : t('common.inactive')}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-neutral-500">
                                        {new Date(cat.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                                title={t('common.edit')}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(cat.id)}
                                                className="p-2 hover:bg-purple-50 rounded-lg transition-colors text-purple-600"
                                                title={t('common.status')}
                                            >
                                                {cat.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {categories.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No categories found. Click "Add Category" to create one.
                        </div>
                    )}
                </div>
            </Card>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card padding="lg" className="w-full max-w-md">
                        <h2 className="text-xl font-bold text-neutral-900 mb-6">
                            {editingCategory ? t('categories.editTitle') : t('categories.addTitle')}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    {t('categories.name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary transition-all"
                                    placeholder={t('categories.name')}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" variant="primary" className="flex-1">
                                    {t('common.save')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1"
                                >
                                    {t('common.cancel')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </AdminLayout>
    );
};

export default CategoriesPage;
