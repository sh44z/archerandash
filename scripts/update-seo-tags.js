const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define Product Schema (Basic)
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    keywords: { type: String },
    // Other fields exist but we only need these
}, { strict: false }); // strict false to avoid errors with other fields

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const updates = [
    { title: "Ember & Olive The Rustic Grove Veridian Stillness Wall art Canvas Print", tags: "Modern Canvas Art, Wall Décor, Wall Art, Buy Wall Art, Canvas Wall Art, Modern Canvas Prints, Decorative Posters" },
    { title: "Rustic Green Door Wall Art – Premium Canvas Print", tags: "Wall Décor Prints, Botanical Wall Art, Gallery Wall Prints, Home Art Canvases, Modern Art Prints, Modern Art Wall Décor, Prints for Wall Décor, Framed Botanical Art Prints" },
    { title: "Mediterranean Escape: 6-Piece Curated Gallery Wall Art Set (20x30cm)", tags: "Prints for Wall Décor, Rolled Poster Printed, Botanical Triptych Art, Modern Canvas Art, Canvas Wall Décor, Rolled Poster Printed, The Artwork Collection, Wall Art Posters." },
    { title: "Verdant Palms | Large-Scale Botanical Triptych Art Wall Art Canvas Print", tags: "Modern Art Prints, Prints for Wall Décor, Rolled Poster Printed, Botanical Triptych Art, Wall Art and Frames, The Artwork Collection, Botanical Wall Art." },
    { title: "Mediterranean Serenity – 3-Piece Wall Art Canvas Print", tags: "Print Wall Posters, Unframed Wall Art, Canvas Art Posters, Wall Art 3 Piece, Print Wall Posters, Gallery Wall Prints, Wall Art Canvas Print, Green Art Poster, Wall Art Posters." },
    { title: "Urban Edge 6-Piece Monochrome Gallery Wall Art Set", tags: "Wall Décor, Canvas Art Posters, Wall Art 3 Piece, Gallery Wall Prints, Modern Art Prints, Wall Décor Prints, The Artwork Collection, Wall Frames for Hall." },
    { title: "3pc Modern Artistic luck, power, and natural beauty Wall Art Canvas Print", tags: "Posters for All Rooms, Botanical Wall Art, Gallery Wall Prints, Home Art Canvases, Modern Art Prints, Modern Art Wall Décor, Prints for Wall Décor, Wall Art and Frames." },
    { title: "Tree Sun Shadow unframed Wall Art set of 2 Wall Art Canvas Print", tags: "Rolled Poster Printed, Botanical Triptych Art, Wall Art and Frames, The Artwork Collection, Botanical Wall Art." }
];

async function updateTags() {
    try {
        // Load env
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            throw new Error('.env.local file not found');
        }
        const envContent = fs.readFileSync(envPath, 'utf8');
        const mongoUriMatch = envContent.match(/MONGODB_URI=(.+)/);
        const mongoUri = mongoUriMatch ? mongoUriMatch[1].trim().replace(/^["']|["']$/g, '') : null;

        if (!mongoUri) {
            console.log('MONGODB_URI not found in .env.local, using fallback');
            mongoUri = 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to Database');

        for (const update of updates) {
            // Find roughly by title (case insensitive)
            const regex = new RegExp(`^${update.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
            const product = await Product.findOne({ title: regex });

            if (product) {
                product.keywords = update.tags;
                await product.save();
                console.log(`Updated tags for: ${product.title}`);
            } else {
                console.log(`Product NOT FOUND: ${update.title}`);
                // Try fuzzy? for now just report.
            }
        }

        console.log('Update complete');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateTags();
