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

async function cleanupProducts() {
    console.log('🧹 Cleaning up products...\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        // Get all valid category IDs
        const allCategories = await Category.find({});
        const validCategoryIds = new Set(allCategories.map(c => c._id.toString()));
        
        console.log(`📊 Valid categories: ${allCategories.map(c => c.name).join(', ')}`);
        console.log(`   IDs: ${Array.from(validCategoryIds).join(', ')}\n`);

        // Find all products
        const allProducts = await Product.find({});
        
        let cleanupCount = 0;

        for (const product of allProducts) {
            let needsUpdate = false;
            const updates = {};

            // Remove invalid category IDs from categories array
            if (product.categories && product.categories.length > 0) {
                const validCategories = product.categories.filter(catId => 
                    validCategoryIds.has(catId.toString())
                );

                if (validCategories.length !== product.categories.length) {
                    console.log(`🔧 Cleaning ${product.title}`);
                    console.log(`   Removed orphaned category IDs`);
                    updates.categories = validCategories;
                    needsUpdate = true;
                }
            }

            // Remove single category field
            if (product.category) {
                console.log(`🔧 Removing single category field from ${product.title}`);
                updates.category = null;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await Product.findByIdAndUpdate(product._id, updates);
                cleanupCount++;
            }
        }

        console.log(`\n✅ Cleaned up ${cleanupCount} products`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

cleanupProducts();
