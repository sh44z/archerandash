'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    _id: string;
    title: string;
    price?: number;
    variants?: { size: string; price: number }[];
}

interface Order {
    _id: string;
    paypalOrderId: string;
    customer: {
        name: string;
        email: string;
        address: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postal_code: string;
            country_code: string;
        };
    };
    total: number;
    currency: string;
    products: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
    status: 'paid' | 'shipped' | 'completed' | 'cancelled';
    orderDate: string;
    createdAt: string;
}

type TabType = 'products' | 'categories' | 'orders' | 'subscriptions';

export default function HubPage() {
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [activeTab]);

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

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Update local state
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));

            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Failed to update order status');
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            // Remove from local state
            setOrders(orders.filter(order => order._id !== orderId));
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order');
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'paid': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">The Hub Dashboard</h1>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                        <Link href="/shop" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 whitespace-nowrap">Go to Shop</Link>
                        <Link href="/hub/products/new" className="text-sm sm:text-base bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap">
                            + Add Product
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {[
                            { id: 'products', label: 'Products' },
                            { id: 'categories', label: 'Categories', href: '/hub/categories' },
                            { id: 'orders', label: 'Orders' },
                            { id: 'subscriptions', label: 'Subscriptions', href: '/hub/subscriptions' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (tab.href) {
                                        window.location.href = tab.href;
                                    } else {
                                        setActiveTab(tab.id as TabType);
                                    }
                                }}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'products' && (
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
                                        <li key={product._id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">{product.title}</h3>
                                                <p className="text-sm text-gray-500">{priceDisplay}</p>
                                            </div>
                                            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                                                <Link
                                                    href={`/hub/products/${product._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium whitespace-nowrap"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id, product.title)}
                                                    className="text-red-600 hover:text-red-900 text-sm font-medium whitespace-nowrap"
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
                )}

                {activeTab === 'orders' && (
                    <div>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                                <button
                                    onClick={() => setError('')}
                                    className="float-right ml-4 font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Orders List */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm border">
                                    <div className="p-6 border-b">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Orders ({orders.length})
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                        {orders.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500">
                                                No orders found
                                            </div>
                                        ) : (
                                            orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                        selectedOrder?._id === order._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                    }`}
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {order.customer.name}
                                                                </span>
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                                    {order.status.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <p>Order #{order.paypalOrderId.slice(-8)}</p>
                                                                <p>{formatDate(order.orderDate)}</p>
                                                                <p>{order.products.length} item{order.products.length !== 1 ? 's' : ''}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                £{order.total.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="lg:col-span-1">
                                {selectedOrder ? (
                                    <div className="bg-white rounded-lg shadow-sm border">
                                        <div className="p-6 border-b">
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Order Details
                                            </h2>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {/* Order Info */}
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="font-medium">Order ID:</span> {selectedOrder.paypalOrderId}</p>
                                                    <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.orderDate)}</p>
                                                    <p><span className="font-medium">Total:</span> £{selectedOrder.total.toFixed(2)}</p>
                                                    <p><span className="font-medium">Status:</span>
                                                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                                            {selectedOrder.status.toUpperCase()}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-2">Customer</h3>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                                                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                                                    <div className="mt-2">
                                                        <p className="font-medium">Address:</p>
                                                        <p className="text-gray-600">
                                                            {selectedOrder.customer.address.line1}<br />
                                                            {selectedOrder.customer.address.line2 && <>{selectedOrder.customer.address.line2}<br /></>}
                                                            {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state}<br />
                                                            {selectedOrder.customer.address.postal_code}<br />
                                                            {selectedOrder.customer.address.country_code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-2">Products</h3>
                                                <div className="space-y-3">
                                                    {selectedOrder.products.map((product, index) => (
                                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                                                            {product.image && (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">{product.name}</p>
                                                                <p className="text-xs text-gray-600">
                                                                    Qty: {product.quantity} × £{product.price.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <p className="font-medium text-sm">
                                                                £{(product.price * product.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div>
                                                <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
                                                <div className="space-y-2">
                                                    {selectedOrder.status === 'paid' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(selectedOrder._id, 'shipped')}
                                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                        >
                                                            Mark as Shipped
                                                        </button>
                                                    )}
                                                    {selectedOrder.status === 'shipped' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(selectedOrder._id, 'completed')}
                                                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                        >
                                                            Mark as Completed
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteOrder(selectedOrder._id)}
                                                        className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                    >
                                                        Delete Order
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
                                        Select an order to view details
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
