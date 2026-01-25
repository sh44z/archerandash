
import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Product from '../models/Product';

async function migrateCategories() {
    console.log("Starting categories migration...");
    await dbConnect();
    console.log("Connected to DB.");

    try {
        // Find all products that have a category (string) but no categories (array)
        const products = await Product.find({ 
            category: { $exists: true, $ne: null },
            $or: [
                { categories: { $exists: false } },
                { categories: { $eq: [] } }
            ]
        });

        console.log(`Found ${products.length} products to migrate.`);

        for (const product of products) {
            console.log(`Migrating product: ${product.title} (${product._id})`);
            
            // Convert single category to categories array
            const newCategories = product.category ? [product.category] : [];
            
            await Product.findByIdAndUpdate(
                product._id,
                { categories: newCategories },
                { new: true }
            );
            
            console.log(`✓ Migrated ${product.title}`);
        }

        console.log(`\n✓ Migration complete! ${products.length} products updated.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateCategories();
