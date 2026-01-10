'use client';

import { CartProvider } from '@/context/CartContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import CartDrawer from './components/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "Aax7kTuGMzb7kK_X_D_zc3miLsr-_6O_2nvUfPgtH-rsAFrr8RIlRGpzaI0tMRAQ5NDul8ZJeQ2N4dBw";

    return (
        <PayPalScriptProvider options={{
            "clientId": paypalClientId,
            currency: "GBP",
            components: "buttons",
            "enable-funding": "card",
            "disable-funding": ""
        }}>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </PayPalScriptProvider>
    );
}
