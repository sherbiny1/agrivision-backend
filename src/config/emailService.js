const fs = require('fs');
const path = require('path');

// Load and fill HTML template from file
const loadTemplate = (filename, replacements) => {
    const filePath = path.join(__dirname, '../views', filename);
    let html = fs.readFileSync(filePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(`{{${key}}}`, String(value));
    }
    return html;
};

// Send email using Brevo HTTP API (works on Railway — no SMTP needed)
const sendEmail = async ({ to, subject, html }) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: { name: 'AgriVision AI', email: process.env.SENDER_EMAIL || 'agrivisionproject@gmail.com' },
            to: [{ email: to }],
            subject,
            htmlContent: html,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Brevo API error: ${response.status}`);
    }

    return response.json();
};

// Send verification OTP email (6-digit code)
const sendVerificationOTP = async (toEmail, name, code) => {
    const html = loadTemplate('verificationOTP.html', {
        NAME: name,
        CODE: code,
        YEAR: new Date().getFullYear(),
    });

    await sendEmail({
        to: toEmail,
        subject: `${code} – Your AgriVision AI Verification Code`,
        html,
    });
};

// Send password reset OTP email (4-digit code)
const sendPasswordResetEmail = async (toEmail, name, code) => {
    const html = loadTemplate('passwordResetEmail.html', {
        NAME: name,
        CODE: code,
        YEAR: new Date().getFullYear(),
    });

    await sendEmail({
        to: toEmail,
        subject: `${code} – Your AgriVision AI Password Reset Code`,
        html,
    });
};

module.exports = { sendVerificationOTP, sendPasswordResetEmail, loadTemplate };
