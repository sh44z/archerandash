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

async function findByIds() {
    console.log('🔍 Searching for specific category IDs:\n');
    
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        const ids = ['69613dcbbf0f65635f1731e8', '695ecd99c78c8b8198bc566c'];
        
        for (const id of ids) {
            try {
                const cat = await Category.findById(new mongoose.Types.ObjectId(id));
                if (cat) {
                    console.log(`✓ Found ID: ${id}`);
                    console.log(`  Name: ${cat.name}`);
                    console.log(`  Slug: ${cat.slug}`);
                    console.log('');
                } else {
                    console.log(`✗ ID not found: ${id}`);
                }
            } catch (e) {
                console.log(`✗ Invalid ID: ${id}`);
            }
        }

        const allCats = await Category.find({});
        console.log(`\nTotal categories in database: ${allCats.length}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

findByIds();
