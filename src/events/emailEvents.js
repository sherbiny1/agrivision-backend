const EventEmitter = require('events');
const { sendVerificationOTP, sendPasswordResetEmail } = require('../config/emailService');

const emailEmitter = new EventEmitter();

// Listen for email verification OTP events (non-blocking)
emailEmitter.on('sendVerificationOTP', ({ email, name, code }) => {
    sendVerificationOTP(email, name, code)
        .then(() => {
            console.log(`✅ Verification OTP sent to ${email}`);
        })
        .catch((err) => {
            console.error(`❌ Failed to send verification OTP to ${email}:`, err.message);
        });
});

// Listen for password reset code events (non-blocking)
emailEmitter.on('sendPasswordResetCode', ({ email, name, code }) => {
    sendPasswordResetEmail(email, name, code)
        .then(() => {
            console.log(`✅ Password reset code sent to ${email}`);
        })
        .catch((err) => {
            console.error(`❌ Failed to send password reset code to ${email}:`, err.message);
        });
});

module.exports = emailEmitter;
