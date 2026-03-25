import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DiscountCode from '@/models/DiscountCode';

export async function GET() {
    try {
        await dbConnect();
        const codes = await DiscountCode.find().sort({ createdAt: -1 });
        return NextResponse.json(codes);
    } catch (error) {
        console.error('Error fetching discount codes:', error);
        return NextResponse.json({ error: 'Failed to fetch discount codes' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { code, discountType, discountValue } = body;

        if (!code || !discountType || !discountValue) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newCode = new DiscountCode({
            code: code.toUpperCase().trim(),
            discountType,
            discountValue: Number(discountValue)
        });

        await newCode.save();
        return NextResponse.json(newCode, { status: 201 });
    } catch (error: any) {
        console.error('Error creating discount code:', error);
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Discount code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create discount code' }, { status: 500 });
    }
}
