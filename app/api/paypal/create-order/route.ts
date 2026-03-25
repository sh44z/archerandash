import { NextResponse } from 'next/server';
import { client } from '@/lib/paypal';
// @ts-ignore
import * as paypal from '@paypal/checkout-server-sdk';
import dbConnect from '@/lib/db';
import DiscountCode from '@/models/DiscountCode';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cartItems, total, discountCode } = body;

        console.log('PayPal create order request:', { cartItems, total, discountCode });

        // Validate required data
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        const cartSubtotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        let discountAmount = 0;

        if (discountCode) {
            await dbConnect();
            const discount = await DiscountCode.findOne({ code: String(discountCode).toUpperCase().trim(), isActive: true });
            if (discount) {
                if (discount.discountType === 'percentage') {
                    discountAmount = cartSubtotal * (discount.discountValue / 100);
                } else {
                    discountAmount = discount.discountValue;
                }
                if (discountAmount > cartSubtotal) {
                    discountAmount = cartSubtotal;
                }
            }
        }

        const secureTotal = cartSubtotal - discountAmount;

        // Create order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "GBP",
                        value: secureTotal.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "GBP",
                                value: cartSubtotal.toFixed(2)
                            },
                            discount: {
                                currency_code: "GBP",
                                value: discountAmount.toFixed(2)
                            }
                        }
                    },
                    items: cartItems.map((item: any) => ({
                        name: item.title.substring(0, 127), // PayPal limit
                        quantity: item.quantity.toString(),
                        unit_amount: {
                            currency_code: "GBP",
                            value: item.price.toFixed(2)
                        }
                    }))
                }
            ]
        });

        console.log('Sending request to PayPal API...');
        const order = await client.execute(request);
        console.log('PayPal order created:', order.result.id);

        return NextResponse.json({
            id: order.result.id
        });

    } catch (error: any) {
        console.error('PayPal order creation error:', error);

        // Handle specific PayPal errors
        if (error.statusCode) {
            return NextResponse.json({
                error: 'PayPal order creation failed',
                details: error.message
            }, { status: error.statusCode });
        }

        return NextResponse.json({
            error: 'Internal server error during order creation'
        }, { status: 500 });
    }
}