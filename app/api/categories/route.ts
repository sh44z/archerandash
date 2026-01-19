import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

// Helper to slugify
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, categories });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const { name, parentId } = body;

        if (!name) {
            return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
        }

        const slug = slugify(name);

        // Basic check for duplicate slug (could be improved)
        const existing = await Category.findOne({ slug });
        if (existing) {
            // Append random string if duplicate (simple collision handling)
            // Or just fail. Let's just fail for now or handle it minimally if needed.
            // For a robust system we might want unique slugs per parent, or globally unique.
            // Let's assume globally unique for simplicity.
            return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
        }


        const category = await Category.create({
            name,
            slug,
            parent: parentId || null,
        });

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json({ success: false, error: 'ID and Name are required' }, { status: 400 });
        }

        const slug = slugify(name);

        // Check for duplicates excluding current category
        const existing = await Category.findOne({ slug, _id: { $ne: id } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Category with this name already exists' }, { status: 400 });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { name, slug },
            { new: true }
        );

        return NextResponse.json({ success: true, category });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        // Optional: Check if products use this category before deleting?
        // For now, let's just delete.

        await Category.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
    }
}
