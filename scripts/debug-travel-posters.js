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

async function debugTravelPosters() {
    console.log('🔍 Debugging Travel Posters Category\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        // Get Travel Posters category
        const travelPosters = await Category.findOne({ slug: 'travel-posters' });
        
        if (!travelPosters) {
            console.log('❌ Travel Posters category not found!');
            await mongoose.connection.close();
            process.exit(1);
        }

        console.log(`📌 Travel Posters Category:`);
        console.log(`   ID: ${travelPosters._id}`);
        console.log(`   Slug: ${travelPosters.slug}\n`);

        // Search for products with Travel Posters ID
        const objectId = new mongoose.Types.ObjectId(travelPosters._id);
        
        console.log(`🔎 Searching for products with Travel Posters ID: ${objectId}\n`);

        // Search method 1: Using $in with categories array
        const query1 = await Product.find({
            categories: { $in: [objectId] }
        }).select('title categories category');

        console.log(`✓ Query 1 - categories array contains Travel Posters: ${query1.length} products`);
        query1.forEach(p => {
            console.log(`  - ${p.title}`);
            console.log(`    categories: ${p.categories.map(c => c.toString()).join(', ')}`);
        });

        // Search method 2: Using single category field
        const query2 = await Product.find({
            category: objectId
        }).select('title categories category');

        console.log(`\n✓ Query 2 - single category field equals Travel Posters: ${query2.length} products`);
        query2.forEach(p => {
            console.log(`  - ${p.title}`);
            console.log(`    category: ${p.category ? p.category.toString() : 'none'}`);
            console.log(`    categories: ${p.categories.map(c => c.toString()).join(', ')}`);
        });

        // Show all products to see what's actually stored
        console.log('\n📋 All Products and their categories:\n');
        const allProducts = await Product.find({}).select('title category categories').sort({ createdAt: -1 });
        
        allProducts.forEach(p => {
            console.log(`📌 ${p.title}`);
            console.log(`   category: ${p.category ? p.category.toString() : 'none'}`);
            console.log(`   categories: ${p.categories && p.categories.length > 0 ? p.categories.map(c => c.toString()).join(', ') : 'empty'}`);
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

debugTravelPosters();
