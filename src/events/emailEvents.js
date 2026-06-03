const EventEmitter = require('events');
const { sendVerificationEmail } = require('../config/emailServiceBrevo'); // Use Brevo API

const emailEmitter = new EventEmitter();

// Listen for email verification events (non-blocking)
emailEmitter.on('sendVerificationEmail', ({ email, name, verificationUrl }) => {
    // Send email without awaiting (fire and forget)
    sendVerificationEmail(email, name, verificationUrl)
        .then(() => {
            console.log(`✅ Verification email sent to ${email}`);
        })
        .catch((err) => {
            console.error(`❌ Failed to send email to ${email}:`, err.message);
        });
});

module.exports = emailEmitter;
