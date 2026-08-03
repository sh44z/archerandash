import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import LiveChatThread from '@/models/LiveChatThread';

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const threads = await LiveChatThread.find({}).sort({ updatedAt: -1 });
        return NextResponse.json({ success: true, threads });
    } catch (error) {
        console.error('Failed to fetch live chat threads:', error);
        return NextResponse.json({ error: 'Failed to fetch live chat threads' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.visitorName || !body.visitorEmail || !body.message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const visitorPhone = body.visitorPhone || '';

        const existingThread = await LiveChatThread.findOne({
            visitorEmail: body.visitorEmail,
            status: { $in: ['new', 'open'] },
        }).sort({ updatedAt: -1 });

        const messagePayload = {
            sender: 'visitor',
            text: body.message,
            createdAt: new Date(),
            isRead: false,
        };

        let thread;
        if (existingThread) {
            existingThread.messages.push(messagePayload);
            existingThread.lastVisitorMessageAt = new Date();
            existingThread.updatedAt = new Date();
            existingThread.status = 'open';
            thread = await existingThread.save();
        } else {
            thread = await LiveChatThread.create({
                visitorName: body.visitorName,
                visitorEmail: body.visitorEmail,
                visitorPhone,
                status: 'new',
                messages: [messagePayload],
                lastVisitorMessageAt: new Date(),
            });
        }

        return NextResponse.json({ success: true, thread });
    } catch (error) {
        console.error('Failed to create live chat message:', error);
        return NextResponse.json({ error: 'Failed to send live chat message' }, { status: 500 });
    }
}
