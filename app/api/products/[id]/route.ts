import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// GET - Public (get single product)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id).lean();
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json({
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            category: product.category ? product.category.toString() : undefined,
            categories: (product.categories || []).map((cat: any) => 
                cat._id ? cat._id.toString() : cat.toString()
            )
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT/PATCH - Protected (update product)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
        
        const product = await Product.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        ).lean();
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json({
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            category: product.category ? product.category.toString() : undefined,
            categories: (product.categories || []).map((cat: any) => 
                cat._id ? cat._id.toString() : cat.toString()
            )
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Protected (delete product)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}



