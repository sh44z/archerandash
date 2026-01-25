import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * Migration endpoint to convert existing products with single category (string)
 * to the new multi-category format (array of ObjectIds)
 * 
 * GET /api/migrations/categories - Check status
 * POST /api/migrations/categories - Run migration
 * 
 * Protected endpoint - requires authentication
 */

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Check how many products need migration
        const productsNeedingMigration = await Product.countDocuments({ 
            category: { $exists: true, $ne: null },
            $or: [
                { categories: { $exists: false } },
                { categories: { $eq: [] } }
            ]
        });

        const totalProducts = await Product.countDocuments({});

        return NextResponse.json({
            status: 'ok',
            totalProducts,
            productsNeedingMigration,
            message: `${productsNeedingMigration} of ${totalProducts} products need migration`
        });
    } catch (error) {
        console.error('Check failed:', error);
        return NextResponse.json(
            { error: 'Check failed', details: String(error) },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token && await verifyToken(token);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Find all products that have a category (string) but empty/missing categories (array)
        const products = await Product.find({ 
            category: { $exists: true, $ne: null },
            $or: [
                { categories: { $exists: false } },
                { categories: { $eq: [] } }
            ]
        });

        console.log(`[Migration] Found ${products.length} products to migrate.`);

        if (products.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No products need migration',
                productsUpdated: 0,
                results: []
            });
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;
        
        for (const product of products) {
            try {
                console.log(`[Migration] Migrating product: ${product.title} (${product._id})`);
                
                // Convert single category to categories array
                const newCategories = product.category ? [product.category] : [];
                
                const updated = await Product.findByIdAndUpdate(
                    product._id,
                    { categories: newCategories },
                    { new: true }
                );
                
                if (updated) {
                    results.push({
                        productId: product._id.toString(),
                        title: product.title,
                        oldCategory: product.category ? product.category.toString() : 'none',
                        newCategories: (updated.categories || []).map((cat: any) => cat.toString()),
                        status: 'success'
                    });
                    
                    successCount++;
                    console.log(`[Migration] ✓ Migrated ${product.title}`);
                } else {
                    throw new Error('Product update returned null');
                }
            } catch (err) {
                errorCount++;
                results.push({
                    productId: product._id.toString(),
                    title: product.title,
                    status: 'error',
                    error: String(err)
                });
                console.error(`[Migration] ✗ Failed to migrate ${product.title}:`, err);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Migration complete! ${successCount} products updated, ${errorCount} errors.`,
            productsUpdated: successCount,
            productsErrored: errorCount,
            results
        });
    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json(
            { error: 'Migration failed', details: String(error) },
            { status: 500 }
        );
    }
}

