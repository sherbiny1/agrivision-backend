const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Force IPv4 DNS resolution (fixes Railway IPv6 ENETUNREACH errors)
dns.setDefaultResultOrder('ipv4first');

// Create transporter using Gmail SMTP (works on localhost + deployment)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
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

// Send verification OTP email (6-digit code)
const sendVerificationOTP = async (toEmail, name, code) => {
    const html = loadTemplate('verificationOTP.html', {
        NAME: name,
        CODE: code,
        YEAR: new Date().getFullYear(),
    });

    const mailOptions = {
        from: `"AgriVision AI" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `${code} – Your AgriVision AI Verification Code`,
        html,
    };

    await transporter.sendMail(mailOptions);
};

// Send password reset OTP email (4-digit code)
const sendPasswordResetEmail = async (toEmail, name, code) => {
    const html = loadTemplate('passwordResetEmail.html', {
        NAME: name,
        CODE: code,
        YEAR: new Date().getFullYear(),
    });

    const mailOptions = {
        from: `"AgriVision AI" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `${code} – Your AgriVision AI Password Reset Code`,
        html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationOTP, sendPasswordResetEmail, loadTemplate };
