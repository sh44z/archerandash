import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// GET - Public
export async function GET() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
}

// POST - Protected
export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Convert category IDs to ObjectIds if they are strings
        if (body.categories && Array.isArray(body.categories)) {
            body.categories = body.categories.map((id: string | mongoose.Types.ObjectId) => 
                typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
            );
        }
        if (body.category && typeof body.category === 'string') {
            body.category = new mongoose.Types.ObjectId(body.category);
        }

        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
