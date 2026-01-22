import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import Contact from '@/models/Contact';

// POST - Public (create contact inquiry)
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.phone || !body.email || !body.reason || !body.message) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        // Create contact inquiry
        const contact = await Contact.create({
            name: body.name,
            phone: body.phone,
            email: body.email,
            reason: body.reason,
            message: body.message,
        });

        console.log('Contact inquiry saved to database:', contact._id);

        return NextResponse.json({
            success: true,
            message: 'Your inquiry has been submitted successfully. We will get back to you soon.',
            contactId: contact._id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        if (error instanceof Error && error.message.includes('enum')) {
            return NextResponse.json({
                error: 'Invalid reason selected'
            }, { status: 400 });
        }
        return NextResponse.json({
            error: 'Failed to submit inquiry. Please try again.'
        }, { status: 500 });
    }
}

// GET - Protected (get all contact inquiries for hub)
export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const contacts = await Contact.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            contacts: contacts
        });
    } catch (error) {
        console.error('Failed to fetch contacts:', error);
        return NextResponse.json({
            error: 'Failed to fetch contacts'
        }, { status: 500 });
    }
}
