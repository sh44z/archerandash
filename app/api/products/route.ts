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
    
    // Transform products to ensure categories is always an array
    const transformedProducts = products.map(product => {
        const productObj = product.toObject ? product.toObject() : product;
        
        // If categories is empty but category exists, populate categories array
        if ((!productObj.categories || productObj.categories.length === 0) && productObj.category) {
            productObj.categories = [productObj.category];
        }
        
        return productObj;
    });
    
    return NextResponse.json(transformedProducts);
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
        
        // Don't save single category field if categories array exists
        if (body.categories && body.categories.length > 0) {
            delete body.category;
        }

        const product = await Product.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
