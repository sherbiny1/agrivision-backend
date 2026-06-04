const User = require('../models/User');
const jwt = require('jsonwebtoken');
const emailEmitter = require('../events/emailEvents');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Generate 6-digit OTP code
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate 6-digit verification code
        const verificationCode = generateOTP();
        const verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create user (unverified)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Farmer',
            emailVerified: false,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: verificationExpires,
        });

        if (user) {
            // Emit event — email sends in background, response is instant
            emailEmitter.emit('sendVerificationOTP', {
                email,
                name,
                code: verificationCode,
            });

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                message: 'Registration successful! Please check your email for the 6-digit verification code.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Email with OTP code
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Please provide email and verification code' });
        }

        const user = await User.findOne({
            email,
            emailVerificationCode: code,
            emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.emailVerificationCode = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: true,
            token: generateToken(user._id),
            message: 'Email verified successfully!',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: 'Email is already verified' });
        }

        // Generate new code
        const verificationCode = generateOTP();
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send new code via email
        emailEmitter.emit('sendVerificationOTP', {
            email,
            name: user.name,
            code: verificationCode,
        });

        res.status(200).json({ message: 'New verification code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {

            // Block login if email not verified
            if (!user.emailVerified) {
                return res.status(403).json({
                    message: 'Please verify your email before logging in. Check your inbox for the verification code.'
                });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password (sends code via email)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetPasswordCode = code;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send reset code via email
        emailEmitter.emit('sendPasswordResetCode', {
            email,
            name: user.name,
            code,
        });

        console.log(`\n=== PASSWORD RESET CODE ===`);
        console.log(`To: ${email} | Code: ${code}`);
        console.log(`===========================\n`);

        res.json({ message: 'Password reset code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Code
// @route   POST /api/auth/verify-code
// @access  Public
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        res.json({ message: 'Code verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired code' });
        }

        user.password = newPassword;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    resendVerification,
    loginUser,
    forgotPassword,
    verifyCode,
    resetPassword
};
