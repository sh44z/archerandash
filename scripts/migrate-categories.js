const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

// Define Product schema
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

async function migrateCategories() {
    console.log("Starting categories migration...");
    
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB.");

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
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateCategories();
