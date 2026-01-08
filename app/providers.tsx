'use client';

import { CartProvider } from '@/context/CartContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CartDrawer from './components/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PayPalScriptProvider options={{ "clientId": "Aax7kTuGMzb7kK_X_D_zc3miLsr-_6O_2nvUfPgtH-rsAFrr8RIlRGpzaI0tMRAQ5NDul8ZJeQ2N4dBw", currency: "GBP" }}>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </PayPalScriptProvider>
    );
}
