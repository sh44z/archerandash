const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

// Define schemas
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    slug: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false },
    sizes: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    variants: [{
        size: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    slug: { type: String, required: false, unique: true, sparse: true },
    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function checkCategoryData() {
    console.log('🔍 Checking category and product data...\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        // Find Travel Posters category
        const travelPosters = await Category.findOne({ slug: 'travel-posters' });
        
        if (!travelPosters) {
            console.log('❌ Travel Posters category not found!');
            console.log('\n📋 Available categories:');
            const allCategories = await Category.find({});
            for (const cat of allCategories) {
                console.log(`  - ${cat.name} (${cat.slug}) ID: ${cat._id}`);
            }
        } else {
            console.log(`✓ Found Travel Posters category`);
            console.log(`  - ID: ${travelPosters._id}`);
            console.log(`  - Slug: ${travelPosters.slug}`);
            console.log(`  - Parent: ${travelPosters.parent || 'none'}\n`);

            // Find products in this category
            const catIds = [travelPosters._id];
            const subcats = await Category.find({ parent: travelPosters._id });
            if (subcats.length > 0) {
                console.log(`  - Has ${subcats.length} subcategories:`);
                subcats.forEach(s => console.log(`    • ${s.name} (${s.slug}) ID: ${s._id}`));
                catIds.push(...subcats.map(c => c._id));
            }

            const products = await Product.find({
                $or: [
                    { category: { $in: catIds } },
                    { categories: { $in: catIds } }
                ]
            }).select('title category categories');

            console.log(`\n📦 Products in Travel Posters (and subcategories):`);
            if (products.length === 0) {
                console.log('  ❌ No products found!');
            } else {
                console.log(`  Found ${products.length} products:`);
                products.forEach(p => {
                    console.log(`  - ${p.title}`);
                    console.log(`    category: ${p.category ? p.category.toString() : 'none'}`);
                    console.log(`    categories: ${p.categories && p.categories.length > 0 ? p.categories.map(c => c.toString()).join(', ') : 'empty'}`);
                });
            }
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkCategoryData();
