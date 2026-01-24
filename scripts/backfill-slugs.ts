
import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Product from '../models/Product';
import path from 'path';

// Load env vars if needed, but dbConnect has a fallback

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

async function migrate() {
    console.log("Starting migration...");
    await dbConnect();
    console.log("Connected to DB.");

    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without slug.`);

    for (const product of products) {
        let slug = slugify(product.title);

        // Ensure uniqueness
        let existing = await Product.findOne({ slug });
        if (existing && existing._id.toString() !== product._id.toString()) {
            let counter = 1;
            while (await Product.findOne({ slug: `${slug}-${counter}` })) {
                counter++;
            }
            slug = `${slug}-${counter}`;
        }

        product.slug = slug;
        await product.save();
        console.log(`Updated product: ${product.title} -> ${slug}`);
    }

    console.log("Migration complete.");
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
