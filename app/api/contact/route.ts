import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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
