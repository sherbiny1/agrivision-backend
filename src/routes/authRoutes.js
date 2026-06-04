const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    verifyCode,
    resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

module.exports = router;
