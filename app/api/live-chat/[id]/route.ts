import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import LiveChatThread from '@/models/LiveChatThread';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const thread = await LiveChatThread.findById(id);

        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, thread });
    } catch (error) {
        console.error('Failed to fetch live chat thread:', error);
        return NextResponse.json({ error: 'Failed to fetch live chat thread' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const thread = await LiveChatThread.findById(id);
        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
        }

        if (body.status) {
            thread.status = body.status;
        }

        if (body.message) {
            thread.messages.push({
                sender: 'agent',
                text: body.message,
                createdAt: new Date(),
                isRead: true,
            });
            thread.lastAgentReplyAt = new Date();
            thread.updatedAt = new Date();
            thread.status = 'open';
        }

        if (body.markAsRead) {
            thread.messages = thread.messages.map((message: any) => ({ ...message, isRead: true }));
        }

        await thread.save();
        return NextResponse.json({ success: true, thread });
    } catch (error) {
        console.error('Failed to update live chat thread:', error);
        return NextResponse.json({ error: 'Failed to update live chat thread' }, { status: 500 });
    }
}
