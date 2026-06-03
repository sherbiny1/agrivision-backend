const Brevo = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

// Initialize Brevo API
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Load and fill HTML template from file
const loadTemplate = (filename, replacements) => {
    const filePath = path.join(__dirname, '../views', filename);
    let html = fs.readFileSync(filePath, 'utf-8');
    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(`{{${key}}}`, String(value));
    }
    return html;
};

// Send verification email using Brevo API
const sendVerificationEmail = async (toEmail, name, verificationUrl) => {
    try {
        const html = loadTemplate('verificationEmail.html', {
            NAME: name,
            VERIFICATION_URL: verificationUrl,
            YEAR: new Date().getFullYear(),
            BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
        });

        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = 'Confirm Your Email – AgriVision AI';
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = { 
            name: 'AgriVision AI', 
            email: process.env.EMAIL_USER || 'noreply@agrivision.com'
        };
        sendSmtpEmail.to = [{ email: toEmail, name: name }];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Verification email sent to ${toEmail} via Brevo API`);
    } catch (error) {
        console.error(`❌ Failed to send email via Brevo API:`, error.message);
        throw error;
    }
};

module.exports = { sendVerificationEmail, loadTemplate };
