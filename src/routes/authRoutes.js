const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser,
    verifyEmail,
    forgotPassword,
    verifyCode,
    resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);

module.exports = router;
