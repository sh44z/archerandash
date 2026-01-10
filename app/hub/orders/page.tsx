'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <button
                        onClick={() => router.push('/hub')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Back to Hub
                    </button>
                </div>

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
        </div>
    );
}