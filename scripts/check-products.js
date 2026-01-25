const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

// Define schemas
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

const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
    console.log('🔍 Checking product data...\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        const allProducts = await Product.find({}).select('title category categories');
        
        console.log(`📦 Total products: ${allProducts.length}\n`);

        for (const product of allProducts) {
            console.log(`📌 ${product.title}`);
            console.log(`   - category (single): ${product.category ? product.category.toString() : 'none'}`);
            console.log(`   - categories (array): ${product.categories && product.categories.length > 0 ? product.categories.map(c => c.toString()).join(', ') : 'empty'}`);
            console.log('');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkProducts();
