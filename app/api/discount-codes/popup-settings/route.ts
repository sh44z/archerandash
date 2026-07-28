import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PopupSetting from '@/models/PopupSetting';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET - Public (Fetch settings for the live chat widget)
export async function GET() {
    try {
        await dbConnect();
        let settings = await PopupSetting.findOne();
        if (!settings) {
            // Create a default settings entry if none exists
            settings = await PopupSetting.create({
                isEnabled: true,
                chatTitle: 'Olivia from Archer & Ash',
                chatMessage: 'Hey there! Thanks for adding an item to your basket. Enter your email below to get a 15% discount code instantly!',
                discountCode: '',
                successMessage: 'Awesome! Use your code at checkout for 15% off.',
                placeholderText: 'Enter your email...',
                avatarUrl: '/images/logo.jpg'
            });
        }
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching popup settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

// POST - Protected (Update settings from the Hub dashboard)
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const user = token && await verifyToken(token);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        
        let settings = await PopupSetting.findOne();
        if (settings) {
            // Update existing
            settings.isEnabled = body.isEnabled !== undefined ? body.isEnabled : settings.isEnabled;
            settings.chatTitle = body.chatTitle !== undefined ? body.chatTitle : settings.chatTitle;
            settings.chatMessage = body.chatMessage !== undefined ? body.chatMessage : settings.chatMessage;
            settings.discountCode = body.discountCode !== undefined ? body.discountCode : settings.discountCode;
            settings.successMessage = body.successMessage !== undefined ? body.successMessage : settings.successMessage;
            settings.placeholderText = body.placeholderText !== undefined ? body.placeholderText : settings.placeholderText;
            settings.avatarUrl = body.avatarUrl !== undefined ? body.avatarUrl : settings.avatarUrl;
            await settings.save();
        } else {
            // Create new
            settings = await PopupSetting.create(body);
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating popup settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
