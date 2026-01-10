import { NextResponse } from 'next/server';
import { client } from '@/lib/paypal';
// @ts-ignore
import * as paypal from '@paypal/checkout-server-sdk';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cartItems, total } = body;

        // Validate required data
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (!total || typeof total !== 'number' || total <= 0) {
            return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
        }

        // Create order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "GBP",
                        value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: "GBP",
                                value: total.toFixed(2)
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

        const order = await client.execute(request);

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