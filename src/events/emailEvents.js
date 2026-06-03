const EventEmitter = require('events');
const { sendVerificationEmail } = require('../config/emailServiceBrevo'); // Use Brevo API

const emailEmitter = new EventEmitter();

// Listen for email verification events
emailEmitter.on('sendVerificationEmail', async ({ email, name, verificationUrl }) => {
    try {
        await sendVerificationEmail(email, name, verificationUrl);
        console.log(`✅ Verification email sent to ${email}`);
    } catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err.message);
    }
});

module.exports = emailEmitter;
