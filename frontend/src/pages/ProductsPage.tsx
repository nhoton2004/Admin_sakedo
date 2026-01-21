import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../app/admin/AdminLayout';
import { Product, ProductService, CategoryService, Category, CreateProductDto } from '../services';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { ChevronRight, Plus, Edit2, Trash2, Star, Search } from 'lucide-react';

const ProductsPage: React.FC = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [filters, setFilters] = useState({ search: '', categoryId: '', isActive: undefined as boolean | undefined });
    const [formData, setFormData] = useState({
        categoryId: '',
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        isFeatured: false,
    });

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories');
        }
    };

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAll(filters);
            setProducts(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await ProductService.update(editingProduct.id, formData);
            } else {
                await ProductService.create(formData as CreateProductDto);
            }
            setShowModal(false);
            resetForm();
            loadProducts();
        } catch (error: any) {
            alert(error.response?.data?.message || t('common.error'));
        }
    };

    const resetForm = () => {
        setFormData({ categoryId: '', name: '', description: '', price: 0, imageUrl: '', isFeatured: false });
        setEditingProduct(null);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            categoryId: product.categoryId,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl || '',
            isFeatured: product.isFeatured,
        });
        setShowModal(true);
    };

    const handleToggleFeatured = async (id: string) => {
        await ProductService.toggleFeatured(id);
        loadProducts();
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('common.confirm'))) {
            await ProductService.delete(id);
            loadProducts();
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
                <span className="text-neutral-900 font-medium">{t('products.title')}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">{t('products.title')}</h1>
                <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                    <Plus className="w-4 h-4" />
                    {t('products.addProduct')}
                </Button>
            </div>

            {/* Filters */}
            <Card padding="md" className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="text"
                        placeholder={t('common.search')}
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        icon={<Search className="w-4 h-4" />}
                    />
                    <select
                        value={filters.categoryId}
                        onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                        className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    >
                        <option value="">{t('products.category')}</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <select
                        value={filters.isActive === undefined ? '' : String(filters.isActive)}
                        onChange={(e) => setFilters({ ...filters, isActive: e.target.value === '' ? undefined : e.target.value === 'true' })}
                        className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary"
                    >
                        <option value="">{t('common.status')}</option>
                        <option value="true">{t('common.active')}</option>
                        <option value="false">{t('common.inactive')}</option>
                    </select>
                </div>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Card key={product.id} padding="md" hover className="group">
                        <div className="flex flex-col h-full">
                            {/* Image */}
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-4">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                        <span className="text-5xl">🍽️</span>
                                    </div>
                                )}
                                {product.isFeatured && (
                                    <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        {t('products.featured')}
                                    </div>
                                )}
                                <div className="absolute top-2 left-2">
                                    <Badge variant={product.isActive ? 'success' : 'neutral'} size="sm">
                                        {product.isActive ? t('common.active') : t('common.inactive')}
                                    </Badge>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <Badge variant="neutral" size="sm" className="mb-2">{product.category?.name}</Badge>
                                <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{product.description}</p>
                                <p className="text-lg font-bold text-primary mb-4">{product.price.toLocaleString('vi-VN')} ₫</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t('common.edit')}
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(product.id)}
                                    className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                                >
                                    <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {products.length === 0 && (
                <Card padding="lg">
                    <div className="text-center py-12 text-neutral-500">
                        No products found. Try adjusting your filters or add a new product.
                    </div>
                </Card>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <Card padding="lg" className="w-full max-w-2xl my-8">
                        <h2 className="text-xl font-bold text-neutral-900 mb-6">
                            {editingProduct ? t('products.editProduct') : t('products.addProduct')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('products.name')}</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('products.category')}</label>
                                    <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200">
                                        <option value="">{t('products.selectCategory')}</option>
                                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">{t('products.description')}</label>
                                <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('products.price')} (VND)</label>
                                    <input type="number" step="1000" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">{t('products.image')}</label>
                                    <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-200" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-neutral-700">{t('products.featured')}</span>
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">{t('common.save')}</Button>
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">{t('common.cancel')}</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductsPage;
