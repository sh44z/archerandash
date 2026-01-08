const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const UserSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
        });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const email = 'admin@archerandash.com';
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Admin user already exists');
            // Reset password just in case
            existing.passwordHash = passwordHash;
            await existing.save();
            console.log('Admin password reset to: password123');
        } else {
            await User.create({ email, passwordHash });
            console.log(`Admin user created: ${email} / ${password}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
