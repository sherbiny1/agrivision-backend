const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Debug: Check if BREVO_API_KEY is loaded
console.log('🔑 BREVO_API_KEY loaded:', process.env.BREVO_API_KEY ? '✅ Yes' : '❌ No');
if (!process.env.BREVO_API_KEY) {
    console.error('⚠️ WARNING: BREVO_API_KEY not found in environment variables!');
    console.error('⚠️ Make sure .env file has: BREVO_API_KEY=your-key-here');
}

// Load and fill HTML template from file
const loadTemplate = (filename, replacements) => {
    const filePath = path.join(__dirname, '../views', filename);
    let html = fs.readFileSync(filePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(`{{${key}}}`, String(value));
    }
    return html;
};

// Send verification email using Brevo API (via axios)
const sendVerificationEmail = async (toEmail, name, verificationUrl) => {
    try {
        const html = loadTemplate('verificationEmail.html', {
            NAME: name,
            VERIFICATION_URL: verificationUrl,
            YEAR: new Date().getFullYear(),
            BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
        });

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'AgriVision AI',
                    email: process.env.EMAIL_USER || 'noreply@agrivision.app'
                },
                to: [{
                    email: toEmail,
                    name: name
                }],
                subject: 'Confirm Your Email – AgriVision AI',
                htmlContent: html
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        console.log(`✅ Verification email sent to ${toEmail} via Brevo API`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to send email via Brevo API:`, error.response?.data || error.message);
        throw error;
    }
};

module.exports = { sendVerificationEmail, loadTemplate };
