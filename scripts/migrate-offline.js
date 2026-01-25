const mongoose = require('mongoose');
const path = require('path');

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

async function runMigration() {
    console.log('🔄 Starting product categories migration...\n');
    
    try {
        // Connect with timeout
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        // Find products that need migration
        const productsToMigrate = await Product.find({ 
            category: { $exists: true, $ne: null },
            $or: [
                { categories: { $exists: false } },
                { categories: { $eq: [] } }
            ]
        });

        console.log(`📦 Found ${productsToMigrate.length} products to migrate\n`);

        if (productsToMigrate.length === 0) {
            console.log('✓ All products are up to date!');
            await mongoose.connection.close();
            process.exit(0);
        }

        let successCount = 0;
        let errorCount = 0;

        for (const product of productsToMigrate) {
            try {
                const newCategories = product.category ? [product.category] : [];
                
                const result = await Product.updateOne(
                    { _id: product._id },
                    { $set: { categories: newCategories } }
                );

                if (result.modifiedCount === 1) {
                    console.log(`✓ ${product.title}`);
                    successCount++;
                } else {
                    console.log(`⚠ ${product.title} (no changes made)`);
                }
            } catch (err) {
                console.log(`✗ ${product.title} (${err.message})`);
                errorCount++;
            }
        }

        console.log(`\n📊 Migration Summary:`);
        console.log(`  ✓ Successful: ${successCount}`);
        console.log(`  ✗ Failed: ${errorCount}`);
        console.log(`  Total: ${successCount + errorCount}`);

        if (successCount > 0) {
            console.log(`\n✅ Migration completed successfully!`);
        }

        await mongoose.connection.close();
        process.exit(errorCount > 0 ? 1 : 0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        
        if (error.name === 'MongooseServerSelectionError') {
            console.log('\n💡 Could not connect to MongoDB. Please check:');
            console.log('  - MongoDB URI is correct');
            console.log('  - Your IP is whitelisted in MongoDB Atlas');
            console.log('  - Internet connection is working');
        }
        
        process.exit(1);
    }
}

// Run migration
runMigration();
