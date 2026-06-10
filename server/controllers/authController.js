const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendResetEmail, sendOTPEmail, sendResetOTPEmail } = require("../config/nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_change_me";

// JWT Generator Helper
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "30d",
    });
};

/**
 * Handles user registration (Signup).
 * Generates and sends a 6-digit verification OTP via email.
 * @route POST /api/signup
 */
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            if (user.isVerified) {
                return res.status(400).json({ success: false, message: "User already exists with this email." });
            }
            // If user exists but is not verified, overwrite their registration details with the new ones
            user.name = name;
            user.password = password; // Will be hashed by pre-save hook
        } else {
            // Create a temporary, unverified user
            user = new User({
                name,
                email: normalizedEmail,
                password,
                isVerified: false
            });
        }

        // Generate 6-digit OTP code
        const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing (SHA-256)
        const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        await user.save();

        // Send OTP email
        await sendOTPEmail(user.email, rawOtp);

        res.status(200).json({
            success: true,
            email: user.email,
            message: "A 6-digit verification OTP has been sent to your email address."
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Verifies the 6-digit signup OTP.
 * Activates the user account on success and returns a JWT.
 * @route POST /api/verify-otp
 */
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified." });
        }

        // Hash token to compare with the database value
        const hashedOtp = crypto.createHash("sha256").update(otp.trim()).digest("hex");

        // Verify OTP matches and is not expired
        if (user.otp !== hashedOtp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
        }

        // Activate user and clear OTP fields
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            message: "Account verified successfully! Welcome to Luxe E-commerce."
        });
    } catch (error) {
        console.error("OTP Verification error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Resends a new signup verification OTP code.
 * @route POST /api/resend-otp
 */
const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified." });
        }

        // Generate new 6-digit OTP code
        const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

        user.otp = hashedOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        await user.save();

        // Resend email
        await sendOTPEmail(user.email, rawOtp);

        res.status(200).json({
            success: true,
            message: "A new 6-digit verification code has been sent to your email."
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Handles user login.
 * Rejects logging in if the account is not verified yet.
 * @route POST /api/login
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified && !user.isAdmin) {
                // Generate a fresh OTP for verification
                const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

                user.otp = hashedOtp;
                user.otpExpires = Date.now() + 5 * 60 * 1000;
                await user.save();

                await sendOTPEmail(user.email, rawOtp);

                return res.status(401).json({
                    success: false,
                    isUnverified: true,
                    email: user.email,
                    message: "Your account is not verified. A verification code has been sent to your email."
                });
            }

            res.status(200).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                message: "Login Successful",
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Handles forgot password requests.
 * Generates a 6-digit OTP and returns it in response for development/testing support.
 * @route POST /api/forgot-password
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        // Standard message for user privacy/security (prevents user enumeration)
        const successMessage = "If an account exists with this email, a password reset OTP has been sent.";

        if (!user) {
            // Silently succeed (standard message for user privacy/security)
            return res.status(200).json({
                success: true,
                message: successMessage
            });
        }

        // Generate 6-digit OTP code
        const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP before storing (SHA-256)
        const hashedToken = crypto.createHash("sha256").update(rawOtp).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes

        await user.save();

        // Send OTP email
        await sendResetOTPEmail(user.email, rawOtp);

        res.status(200).json({
            success: true,
            message: successMessage,
            otp: rawOtp // Exposed for developer/tester to copy from the screen
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ success: false, message: "An error occurred while processing your request." });
    }
};

/**
 * Handles password reset requests using email and OTP.
 * @route POST /api/reset-password
 */
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        if (!otp) {
            return res.status(400).json({ success: false, message: "Reset OTP is required." });
        }
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "New password is required." });
        }
        
        // Enforce strong password complexity validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or expired OTP." });
        }

        // Hash token to compare with the database value
        const hashedToken = crypto.createHash("sha256").update(otp.trim()).digest("hex");

        // Verify OTP matches and is not expired
        if (user.resetPasswordToken !== hashedToken || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset OTP." });
        }

        // Update password and clear reset fields
        user.password = newPassword; // Will be hashed automatically by user model's pre-save middleware
        user.isVerified = true; // Mark as verified since they verified the reset OTP sent to their email
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now login with your new password."
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ success: false, message: "An error occurred while resetting your password." });
    }
};

module.exports = {
    signupUser,
    verifyOTP,
    resendOTP,
    loginUser,
    forgotPassword,
    resetPassword
};
