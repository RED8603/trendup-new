/**
 * Quick Mailtrap SMTP Test
 * Tests email sending with current environment configuration
 */

require('dotenv').config();
const EmailService = require('./src/modules/auth/services/email.service');

const testEmail = async () => {
    console.log('\n========================================');
    console.log('MAILTRAP EMAIL TEST');
    console.log('========================================\n');
    
    console.log('Current SMTP Configuration:');
    console.log(`  Host: ${process.env.SMTP_HOST}`);
    console.log(`  Port: ${process.env.SMTP_PORT}`);
    console.log(`  User: ${process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 10) + '...' : 'NOT SET'}`);
    console.log(`  Pass: ${process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : 'NOT SET'}`);
    console.log(`  From: ${process.env.FROM_EMAIL}\n`);
    
    const testEmail = 'test@example.com';
    const testCode = '123456';
    
    console.log('Sending test verification email...');
    console.log(`To: ${testEmail}`);
    console.log(`Code: ${testCode}\n`);
    
    try {
        await EmailService.sendVerificationEmail(testEmail, testCode);
        console.log('✅ SUCCESS! Email sent successfully!');
        console.log('\nCheck your Mailtrap inbox at: https://mailtrap.io/inboxes');
        console.log('You should see a verification email with code: 123456\n');
        console.log('========================================\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILED! Email sending failed:');
        console.error(`Error: ${error.message}\n`);
        
        if (error.code === 'EAUTH') {
            console.log('⚠️  Authentication Error - Check:');
            console.log('  1. SMTP_USER is correct');
            console.log('  2. SMTP_PASS is correct');
            console.log('  3. Credentials copied from Mailtrap SMTP Settings');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('⚠️  Connection Error - Check:');
            console.log('  1. SMTP_HOST is correct (sandbox.smtp.mailtrap.io)');
            console.log('  2. SMTP_PORT is correct (2525)');
        } else {
            console.log('⚠️  Error details:', error);
        }
        
        console.log('\n========================================\n');
        process.exit(1);
    }
};

testEmail();

