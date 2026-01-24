import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Find all products that don't have a slug
        const products = await Product.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: "" }
            ]
        });

        const results = [];
        let updatedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                // The pre-save hook in the Product model handles slug generation
                // We just need to trigger the save. 
                // However, the hook checks: if (this.title && (this.isNew || this.isModified('title')))
                // So we might need to manually trigger it or temporarily modify the title to force update,
                // or better, just implement the slug generation logic here to be safe and efficient.

                if (!product.title) {
                    results.push({ id: product._id, status: 'skipped', reason: 'No title' });
                    continue;
                }

                let baseSlug = product.title.toString().toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');

                if (!baseSlug) baseSlug = 'product';

                let uniqueSlug = baseSlug;
                let count = 1;

                // Check for uniqueness
                while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })) {
                    uniqueSlug = `${baseSlug}-${count}`;
                    count++;
                }

                product.slug = uniqueSlug;
                await product.save();

                results.push({ id: product._id, title: product.title, slug: uniqueSlug, status: 'updated' });
                updatedCount++;
            } catch (err: any) {
                console.error(`Error updating product ${product._id}:`, err);
                results.push({ id: product._id, status: 'error', error: err.message });
                errorCount++;
            }
        }

        return NextResponse.json({
            message: 'Migration completed',
            summary: {
                totalFound: products.length,
                updated: updatedCount,
                errors: errorCount
            },
            details: results
        });

    } catch (error: any) {
        console.error("Migration error:", error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
