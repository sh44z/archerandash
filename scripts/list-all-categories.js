const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

// Define schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    slug: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Category', categorySchema);

async function checkAllCategories() {
    console.log('📋 All Categories:\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        const categories = await Category.find({}).sort({ name: 1 });
        
        console.log(`Found ${categories.length} categories:\n`);
        
        for (const cat of categories) {
            const parentCat = cat.parent ? await Category.findById(cat.parent) : null;
            console.log(`📌 ${cat.name}`);
            console.log(`   ID: ${cat._id}`);
            console.log(`   Slug: ${cat.slug}`);
            console.log(`   Parent: ${parentCat ? parentCat.name : 'none'}`);
            console.log('');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAllCategories();
