const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { 
    signupUser, 
    verifyOTP, 
    resendOTP, 
    loginUser, 
    forgotPassword, 
    resetPassword 
} = require("../controllers/authController");

// General auth rate limiter (max 20 requests per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for forgot-password requests (max 5 per 15 minutes per IP)
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many password reset requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for reset-password attempts (max 10 per 15 minutes per IP)
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many password reset attempts, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth Routes
router.post("/signup", authLimiter, signupUser);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);
router.post("/login", authLimiter, loginUser);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);

module.exports = router;
