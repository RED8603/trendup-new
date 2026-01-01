const { hashPassword, comparePassword } = require('../src/modules/auth/utils/password.utils');

async function testArgon2() {
    console.log('Starting Argon2 Verification...');

    const password = 'TestPassword123!';

    try {
        console.log('1. Testing Hashing...');
        const hash = await hashPassword(password);
        console.log('   Hash generated:', hash.substring(0, 30) + '...');

        if (!hash.startsWith('$argon2')) {
            throw new Error('Hash does not start with $argon2');
        }
        console.log('   ✅ Hashing successful');

        console.log('2. Testing Verification (Correct Password)...');
        const isValid = await comparePassword(password, hash);
        if (!isValid) {
            throw new Error('Password verification failed for correct password');
        }
        console.log('   ✅ Verification successful');

        console.log('3. Testing Verification (Incorrect Password)...');
        const isInvalid = await comparePassword('WrongPassword', hash);
        if (isInvalid) {
            throw new Error('Password verification passed for incorrect password');
        }
        console.log('   ✅ Rejection successful');

        console.log('🎉 Argon2 Implementation Verified!');
    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        process.exit(1);
    }
}

testArgon2();
