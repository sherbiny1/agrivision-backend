const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Load and fill HTML template from file
const loadTemplate = (filename, replacements) => {
    const filePath = path.join(__dirname, '../views', filename);
    let html = fs.readFileSync(filePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(`{{${key}}}`, String(value));
    }
    return html;
};

// Send verification email (no attachment — clean email)
const sendVerificationEmail = async (toEmail, name, verificationUrl) => {
    const html = loadTemplate('verificationEmail.html', {
        NAME: name,
        VERIFICATION_URL: verificationUrl,
        YEAR: new Date().getFullYear(),
    });

    const mailOptions = {
        from: `"AgriVision AI" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Confirm Your Email – AgriVision AI',
        html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, loadTemplate };
