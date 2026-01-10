import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Order from '@/models/Order';

// POST - Public (create order notification)
// Note: In production, you should add webhook verification from PayPal
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Log order details (you can save to database or send email)
        console.log('=== ORDER RECEIVED ===');
        console.log('PayPal Order ID:', body.paypalOrderId);
        console.log('Customer:', body.customer);
        console.log('Total Amount:', body.total);
        console.log('Products:', body.products);
        console.log('Order Date:', new Date().toISOString());
        console.log('====================');

        // Save order to database
        const order = await Order.create({
            paypalOrderId: body.paypalOrderId,
            customer: body.customer,
            total: parseFloat(body.total),
            currency: body.currency || 'GBP',
            products: body.products,
            status: 'paid', // Payment was successful
            orderDate: new Date(body.orderDate || Date.now())
        });

        console.log('Order saved to database:', order._id);

        return NextResponse.json({
            success: true,
            message: 'Order received and saved successfully',
            orderId: order._id
        });
    } catch (error) {
        console.error('Order processing error:', error);
        return NextResponse.json({
            error: 'Failed to process order'
        }, { status: 500 });
    }
}

// GET - Protected (get orders for hub)
export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const orders = await Order.find({}).sort({ orderDate: -1 }); // Most recent first
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

