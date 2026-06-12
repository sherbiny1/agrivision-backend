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
const {
    validateRegister,
    validateLogin,
    validateResetPassword,
} = require('../middleware/validationMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;
