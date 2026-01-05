const mongoose = require('mongoose');
require('dotenv').config();
const { User, Auth } = require('../src/modules/auth/models');
const { hashPassword } = require('../src/modules/auth/utils/password.utils');

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'mijlalatif10@gmail.com';
        const newPassword = 'TempPassword123!';

        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        const auth = await Auth.findOne({ userId: user._id });
        if (!auth) {
            console.error('Auth record not found');
            process.exit(1);
        }

        const hashedPassword = await hashPassword(newPassword);

        auth.password = hashedPassword;
        auth.failedLoginAttempts = 0;
        auth.lockUntil = undefined;
        await auth.save();

        console.log(`Password for ${email} has been manually reset to: ${newPassword}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

resetPassword();
