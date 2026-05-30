'use client';

import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const { items, cartTotal, appliedDiscount, finalTotal, clearCart } = useCart();
    const router = useRouter();

    const createOrder = async () => {
        try {
            const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: items, total: finalTotal, discountCode: appliedDiscount?.code })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await response.json();
            return orderData.id;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            throw error;
        }
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            const details = await actions.order.capture();

            // Notify backend
            const orderDetails = {
                paypalOrderId: details.id,
                total: cartTotal.toFixed(2),
                products: items.map(item => ({ productId: item.productId, productName: item.title, price: item.price, quantity: item.quantity })),
                orderDate: new Date().toISOString()
            };

            try {
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderDetails)
                });
            } catch (err) {
                console.error('Failed to send order to backend', err);
            }

            clearCart();
            router.push('/thank-you');
        } catch (err) {
            console.error('Payment capture error:', err);
            alert('There was an error processing your payment.');
        }
    };

    const onError = (err: any) => {
        console.error('PayPal error:', err);
        alert('Payment error occurred.');
    };

    const onCancel = (data: any) => {
        console.log('PayPal cancelled:', data);
        // Optionally, redirect back to cart
        router.push('/');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h2 className="font-medium mb-4">Order Summary</h2>
                    {items.length === 0 ? (
                        <p className="text-gray-500">Your cart is empty.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {items.map((item) => (
                                <li key={item.variantId} className="py-4 flex items-center gap-4">
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md border" />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{item.title}</span>
                                            <span>£{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="text-sm text-gray-500">Qty: {item.quantity} • {item.size}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between text-base font-medium">
                            <span>Subtotal</span>
                            <span>£{cartTotal.toFixed(2)}</span>
                        </div>
                        {appliedDiscount && (
                            <div className="flex justify-between mt-2 text-green-700">
                                <span>Discount</span>
                                <span>-{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `£${appliedDiscount.value}`}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold mt-4">
                            <span>Total</span>
                            <span>£{finalTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Shipping and taxes calculated at checkout.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow-sm">
                    <h2 className="font-medium mb-4">Payment</h2>
                    <p className="text-sm text-gray-500 mb-4">Complete your purchase using PayPal or card.</p>

                    <div>
                        <PayPalButtons
                            style={{ layout: 'vertical' }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                            onCancel={onCancel}
                            forceReRender={[finalTotal, items.length]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
