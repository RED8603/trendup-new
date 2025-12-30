const mongoose = require('mongoose');
require('dotenv').config();
const { User, Auth } = require('../src/modules/auth/models');

async function unlockUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'mijlalatif10@gmail.com'; // Target email

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

        console.log('Current status:', {
            failedLoginAttempts: auth.failedLoginAttempts,
            lockUntil: auth.lockUntil,
            isLocked: auth.isLocked // Virtual
        });

        // Reset fields
        auth.failedLoginAttempts = 0;
        auth.lockUntil = undefined; // Unset lock

        await auth.save();

        // Verify
        const updatedAuth = await Auth.findOne({ userId: user._id });
        console.log('User unlocked successfully');
        console.log('New status:', {
            failedLoginAttempts: updatedAuth.failedLoginAttempts,
            lockUntil: updatedAuth.lockUntil,
            isLocked: updatedAuth.isLocked
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

unlockUser();
