const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load env from .env.local
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/MONGODB_URI=(.+)/);
            if (match) {
                MONGODB_URI = match[1].replace(/"/g, '').trim();
            }
        }
    } catch (e) {
        console.warn('Could not read .env.local', e);
    }
}

if (!MONGODB_URI) {
    // Fallback based on what we saw in other files
    MONGODB_URI = 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';
    console.log('Using fallback MONGODB_URI');
}

// Define schemas
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function checkSEO() {
    console.log('🔍 Checking Product SEO data...\n');

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✓ Connected to MongoDB\n');

        const allProducts = await Product.find({}).select('title metaTitle metaDescription keywords');

        console.log(`📦 Total products: ${allProducts.length}\n`);

        let hasSEO = 0;

        for (const product of allProducts) {
            const hasData = product.metaTitle || product.metaDescription || product.keywords;
            if (hasData) hasSEO++;

            console.log(`📌 ${product.title}`);
            console.log(`   - Title: ${product.metaTitle || '❌ (missing)'}`);
            console.log(`   - Desc:  ${product.metaDescription ? (product.metaDescription.substring(0, 50) + '...') : '❌ (missing)'}`);
            console.log(`   - Keys:  ${product.keywords || '❌ (missing)'}`);
            console.log('');
        }

        console.log(`Summary: ${hasSEO} out of ${allProducts.length} products have some SEO data.`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkSEO();
