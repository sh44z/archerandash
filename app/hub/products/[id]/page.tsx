'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { normalizeDriveLink } from '@/lib/imageUtils';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Data for selectors
    const [categories, setCategories] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categories: [] as string[],
        images: ['', '', '', '', '', ''],
    });

    // Variants state
    const [variants, setVariants] = useState<{ size: string, price: string }[]>([
        { size: '', price: '' }
    ]);

    // Load product data
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`);
                if (!res.ok) {
                    setError('Failed to load product');
                    setLoading(false);
                    return;
                }
                const product = await res.json();

                // Populate form with existing data
                setFormData({
                    title: product.title || '',
                    description: product.description || '',
                    categories: product.categories || (product.category ? [product.category] : []),
                    images: product.images ? [...product.images, '', '', '', '', ''].slice(0, 6) : ['', '', '', '', '', ''],
                });

                // Populate variants
                if (product.variants && product.variants.length > 0) {
                    setVariants(product.variants.map((v: any) => ({
                        size: v.size || '',
                        price: v.price?.toString() || ''
                    })));
                } else if (product.price && product.sizes && product.sizes.length > 0) {
                    // Fallback for legacy products
                    setVariants(product.sizes.map((size: string) => ({
                        size: size,
                        price: product.price?.toString() || ''
                    })));
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load product');
                setLoading(false);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId]);

    useEffect(() => {
        // Fetch categories on mount
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.categories);
                }
            })
            .catch(console.error);
    }, []);

    const handleCategoryToggle = (categoryId: string) => {
        setFormData(prev => {
            const current = prev.categories || [];
            if (current.includes(categoryId)) {
                return { ...prev, categories: current.filter(id => id !== categoryId) };
            } else {
                return { ...prev, categories: [...current, categoryId] };
            }
        });
    };

    const handleVariantChange = (index: number, field: 'size' | 'price', value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { size: '', price: '' }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length > 1) {
            setVariants(variants.filter((_, i) => i !== index));
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        // Basic validation
        if (variants.some(v => !v.size || !v.price)) {
            setError('Please fill in all size and price fields for variants.');
            setSaving(false);
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            categories: formData.categories,
            variants: variants.map(v => ({
                size: v.size,
                price: parseFloat(v.price)
            })),
            // Legacy fallbacks (optional, taking first variant)
            price: variants.length > 0 ? parseFloat(variants[0].price) : 0,
            sizes: variants.map(v => v.size),

            images: formData.images.map(normalizeDriveLink).filter(img => img.trim() !== ''),
        };

        const res = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            router.push('/hub');
            router.refresh();
        } else {
            const errorData = await res.json();
            setError(errorData.error || 'Failed to update product');
            setSaving(false);
        }
    };

    // Helper to organize categories for checkboxes
    const renderCategoryCheckboxes = () => {
        const topLevel = categories.filter(c => !c.parent);
        return topLevel.map(parent => {
            const children = categories.filter(c => c.parent === parent._id);
            return (
                <div key={parent._id} className="mb-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={(formData.categories || []).includes(parent._id)}
                            onChange={() => handleCategoryToggle(parent._id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 font-medium text-gray-900">{parent.name}</span>
                    </div>
                    {children.length > 0 && (
                        <div className="ml-6 space-y-2">
                            {children.map(child => (
                                <div key={child._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={(formData.categories || []).includes(child._id)}
                                        onChange={() => handleCategoryToggle(child._id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-gray-700">{child.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 text-center">
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}

                    <div className="grid grid-cols-1 gap-6">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                            <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto bg-white">
                                {renderCategoryCheckboxes()}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Select all that apply</p>
                        </div>

                        {/* Variants (Sizes & Prices) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Variants (Sizes & Prices)</label>
                            <div className="space-y-3">
                                {variants.map((variant, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="flex-grow">
                                            <input
                                                type="text"
                                                placeholder="Size (e.g. 30x40cm)"
                                                required
                                                value={variant.size}
                                                onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div className="w-1/3 relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">£</span>
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                required
                                                value={variant.price}
                                                onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                                                className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(idx)}
                                            className="text-red-600 hover:text-red-800 p-2"
                                            disabled={variants.length === 1}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                + Add another size/variant
                            </button>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Images (Google Drive Links)</label>
                            <p className="text-xs text-gray-500 mb-2">Paste 'Share' links (Anyone with the link can view). Ideally direct file links.</p>
                            <div className="grid grid-cols-1 gap-2">
                                {formData.images.map((img, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        placeholder={`Image URL #${idx + 1}`}
                                        value={img}
                                        onChange={(e) => handleImageChange(idx, e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">Cancel</button>
                        <button type="submit" disabled={saving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {saving ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



