
const mongoose = require('mongoose');
const path = require('path');
const MONGODB_URI = 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';
// require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Define Schemas inline to avoid import issues in standalone script
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    slug: { type: String, required: true, unique: true },
});

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: { type: [String], default: [] },
});

// Create models if not exist
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function main() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const allCategories = await Category.find({}).lean();
        console.log(`Total categories: ${allCategories.length}`);

        console.log('--- All Categories ---');
        for (const cat of allCategories) {
            const productCount = await Product.countDocuments({
                $or: [
                    { categories: cat._id },
                    { category: cat._id }
                ]
            });
            const productWithImageCount = await Product.countDocuments({
                $or: [
                    { categories: cat._id },
                    { category: cat._id }
                ],
                images: { $exists: true, $not: { $size: 0 } }
            });

            console.log(`Name: "${cat.name}", ID: ${cat._id}, Parent: ${cat.parent}, Slug: ${cat.slug}`);
            console.log(`  Safe to display (parent==null): ${!cat.parent}`);
            console.log(`  Products in category: ${productCount}`);
            console.log(`  Products with images: ${productWithImageCount}`);
            console.log('---------------------');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

main();
