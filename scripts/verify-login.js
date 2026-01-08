const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://hubadmin:hubadmin@archerandash.w3rhjhg.mongodb.net/?appName=archerandash';

async function verify() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const UserSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            passwordHash: { type: String, required: true },
        });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const email = 'admin@archerandash.com';
        const password = 'password123';

        console.log(`Checking user: ${email}`);
        const user = await User.findOne({ email });

        if (!user) {
            console.error('ERROR: User not found in DB!');
        } else {
            console.log('User found.');
            console.log('Stored Hash:', user.passwordHash);

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            console.log(`Password Match (${password}):`, isMatch);
        }

    } catch (err) {
        console.error('DB Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

verify();
