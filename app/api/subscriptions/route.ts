import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET - Protected (get all subscriptions for hub)
export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const subscriptions = await Subscription.find({})
            .sort({ createdAt: -1 })
            .lean();
        
        return NextResponse.json(subscriptions.map(sub => ({
            ...sub,
            _id: sub._id.toString(),
            createdAt: sub.createdAt?.toISOString()
        })));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }
}

// POST - Public (subscribe email)
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { email } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        // Check if email already exists
        const existing = await Subscription.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ 
                success: true, 
                message: 'You are already subscribed!',
                alreadySubscribed: true 
            });
        }

        const subscription = await Subscription.create({
            email: email.toLowerCase()
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully subscribed!',
            subscription: {
                ...subscription.toObject(),
                _id: subscription._id.toString(),
                createdAt: subscription.createdAt?.toISOString()
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        if (error.code === 11000) {
            // Duplicate key error
            return NextResponse.json({ 
                success: true, 
                message: 'You are already subscribed!',
                alreadySubscribed: true 
            });
        }
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

