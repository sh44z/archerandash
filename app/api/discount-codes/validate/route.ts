import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DiscountCode from '@/models/DiscountCode';

export async function POST(req: Request) {
    try {
        const { code } = await req.json();
        
        if (!code) {
            return NextResponse.json({ error: 'Discount code is required' }, { status: 400 });
        }

        await dbConnect();
        
        const discountCode = await DiscountCode.findOne({ 
            code: code.toUpperCase().trim(),
            isActive: true 
        });

        if (!discountCode) {
            return NextResponse.json({ error: 'Invalid or inactive discount code' }, { status: 404 });
        }

        return NextResponse.json({ 
            valid: true, 
            discountType: discountCode.discountType,
            discountValue: discountCode.discountValue
        });

    } catch (error) {
        console.error('Error validating discount code:', error);
        return NextResponse.json({ error: 'Failed to validate discount code' }, { status: 500 });
    }
}
