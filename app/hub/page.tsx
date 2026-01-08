'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    _id: string;
    title: string;
    price?: number;
    variants?: { size: string; price: number }[];
}

export default function HubPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = () => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string, productTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Remove product from local state
                setProducts(products.filter(p => p._id !== productId));
            } else {
                const error = await res.json();
                alert(`Failed to delete product: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete product. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">The Hub Dashboard</h1>
                    <div className="space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">Go to Shop</Link>
                        <Link href="/hub/categories" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                            Manage Categories
                        </Link>
                        <Link href="/hub/subscriptions" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                            View Subscriptions
                        </Link>
                        <Link href="/hub/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                            + Add Product
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Products</h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {loading ? (
                            <li className="px-6 py-4 text-center">Loading...</li>
                        ) : products.length === 0 ? (
                            <li className="px-6 py-4 text-center text-gray-500">No products found. Create one!</li>
                        ) : (
                            products.map((product) => {
                                // Calculate price display
                                let priceDisplay = '';
                                if (product.variants && product.variants.length > 0) {
                                    const prices = product.variants.map(v => v.price);
                                    const minPrice = Math.min(...prices);
                                    const maxPrice = Math.max(...prices);
                                    priceDisplay = minPrice === maxPrice 
                                        ? `£${minPrice.toFixed(2)}` 
                                        : `£${minPrice.toFixed(2)} - £${maxPrice.toFixed(2)}`;
                                } else if (product.price) {
                                    priceDisplay = `£${product.price.toFixed(2)}`;
                                } else {
                                    priceDisplay = 'Price TBD';
                                }

                                return (
                                    <li key={product._id} className="px-6 py-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                                            <p className="text-sm text-gray-500">{priceDisplay}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Link 
                                                href={`/hub/products/${product._id}`}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id, product.title)}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
