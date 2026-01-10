'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useCart } from '@/context/CartContext';
import { PayPalButtons } from '@paypal/react-paypal-js';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    // PayPal handling
    const createOrder = async () => {
        try {
            console.log('Creating PayPal order with items:', items, 'total:', cartTotal);
            const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartItems: items,
                    total: cartTotal
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('PayPal order creation failed:', errorData);
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await response.json();
            console.log('PayPal order created successfully:', orderData.id);
            return orderData.id;
        } catch (error) {
            console.error('Error creating PayPal order:', error);
            throw error;
        }
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            // Capture the order
            const details = await actions.order.capture();

            // Prepare order details with product information
            const orderDetails = {
                paypalOrderId: details.id,
                customer: {
                    name: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                    email: details.payer.email_address,
                },
                total: cartTotal.toFixed(2),
                currency: details.purchase_units[0]?.amount?.currency_code || 'GBP',
                products: items.map(item => ({
                    productId: item.productId,
                    productName: item.title,
                    size: item.size,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: (item.price * item.quantity).toFixed(2)
                })),
                orderDate: new Date().toISOString()
            };

            // Send order details to backend
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderDetails)
                });

                if (!response.ok) {
                    console.error('Failed to send order details to backend');
                }
            } catch (error) {
                console.error('Failed to send order details:', error);
                // Don't fail the transaction if notification fails
            }

            alert(`Transaction completed by ${details.payer.name.given_name}! Thank you for your purchase. Order details have been sent.`);
            clearCart();
            setIsCartOpen(false);
        } catch (error: any) {
            console.error('Payment capture error:', error);

            // Handle specific PayPal errors
            if (error.details && error.details[0]) {
                alert(`Payment failed: ${error.details[0].description}`);
            } else {
                alert('Payment completed but there was an error processing the order. Please contact support.');
            }
        }
    };

    const onError = (error: any) => {
        console.error('PayPal checkout error:', error);

        // Handle different types of errors
        if (error === 'INSTRUMENT_DECLINED') {
            alert('Your payment method was declined. Please try a different payment method.');
        } else if (error === 'SHIPPING_ADDRESS_INVALID') {
            alert('There was an issue with the shipping address. Please check your PayPal account settings.');
        } else {
            alert('There was an error processing your payment. Please try again or contact support.');
        }
    };

    const onCancel = (data: any) => {
        console.log('PayPal checkout cancelled:', data);
        // Optional: Track cancellation for analytics
    };

    return (
        <Transition.Root show={isCartOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setIsCartOpen(false)}
                                                    >
                                                        <span className="absolute -inset-0.5" />
                                                        <span className="sr-only">Close panel</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                <div className="flow-root">
                                                    {items.length === 0 ? (
                                                        <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
                                                    ) : (
                                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                            {items.map((item) => (
                                                                <li key={item.variantId} className="flex py-6">
                                                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.title}
                                                                            className="h-full w-full object-cover object-center"
                                                                        />
                                                                    </div>

                                                                    <div className="ml-4 flex flex-1 flex-col">
                                                                        <div>
                                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                                <h3>
                                                                                    <a href={`/product/${item.productId}`}>{item.title}</a>
                                                                                </h3>
                                                                                <p className="ml-4">£{item.price * item.quantity}</p>
                                                                            </div>
                                                                            <p className="mt-1 text-sm text-gray-500">{item.size}</p>
                                                                        </div>
                                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="text-gray-500">Qty:</span>
                                                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                                                                                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                                                                        aria-label="Decrease quantity"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <span className="px-3 py-1 min-w-[2rem] text-center text-gray-900 font-medium">{item.quantity}</span>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                                                                        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                                                                        aria-label="Increase quantity"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                                        </svg>
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeFromCart(item.productId, item.size)}
                                                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {items.length > 0 && (
                                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <p>Subtotal</p>
                                                    <p>£{cartTotal.toFixed(2)}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>

                                                <div className="mt-6">
                                                    <PayPalButtons
                                                        style={{ layout: "vertical" }}
                                                        createOrder={createOrder}
                                                        onApprove={onApprove}
                                                        onError={onError}
                                                        onCancel={onCancel}
                                                        forceReRender={[cartTotal, items.length]}
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        or{' '}
                                                        <button
                                                            type="button"
                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                                            onClick={() => setIsCartOpen(false)}
                                                        >
                                                            Continue Shopping
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
