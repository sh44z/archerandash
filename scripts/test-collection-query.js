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

async function testQuery() {
    console.log('🔍 Testing collection query...\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        // Get Travel Posters
        const travelPosters = await Category.findOne({ slug: 'travel-posters' });
        
        if (!travelPosters) {
            console.log('❌ Travel Posters not found');
            await mongoose.connection.close();
            process.exit(1);
        }

        console.log(`📌 Travel Posters ID: ${travelPosters._id}\n`);

        // Test query exactly like the page does
        const objectId = new mongoose.Types.ObjectId(travelPosters._id.toString());
        console.log(`🔍 Looking for products with objectId: ${objectId}`);
        console.log(`   Type: ${typeof objectId}\n`);

        // Get subcategories
        const subcats = await Category.find({ parent: objectId }).lean();
        console.log(`📊 Subcategories found: ${subcats.length}`);
        
        const catIds = [objectId, ...subcats.map(c => c._id)];
        console.log(`   Cat IDs for query: ${catIds.map(id => id.toString()).join(', ')}\n`);

        // Run the actual query
        const products = await Product.find({
            $or: [
                { category: { $in: catIds } },
                { categories: { $in: catIds } }
            ]
        }).lean();

        console.log(`✓ Found ${products.length} products`);
        products.forEach(p => {
            console.log(`  - ${p.title}`);
            console.log(`    categories: ${p.categories.map(c => c.toString()).join(', ')}`);
        });

        // Also test just the categories query
        console.log(`\n🔎 Testing JUST categories array query:`);
        const productsCategories = await Product.find({
            categories: { $in: catIds }
        }).lean();
        
        console.log(`✓ Found ${productsCategories.length} products with categories array`);
        productsCategories.forEach(p => {
            console.log(`  - ${p.title}`);
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testQuery();
