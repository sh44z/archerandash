import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

        // Here you can:
        // 1. Save to database (create Order model)
        // 2. Send email notification
        // 3. Update inventory
        // 4. etc.

        // For now, we'll just log it and return success
        // You can extend this to save to MongoDB or send email

        return NextResponse.json({ 
            success: true, 
            message: 'Order received successfully' 
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

    // Return empty for now - you can implement order history later
    return NextResponse.json({ orders: [] });
}

