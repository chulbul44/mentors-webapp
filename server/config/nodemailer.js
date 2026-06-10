const nodemailer = require("nodemailer");

// Create transport dynamically based on environment variables
const configureTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Check if configuration exists and is not using placeholder values
    if (host && port && user && pass && !pass.includes("xxxx")) {
        return nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465, // true for port 465, false for other ports
            auth: {
                user,
                pass,
            },
        });
    }
    return null;
};

/**
 * Sends a password reset email to the user.
 * Falls back to logging the reset link to the console if SMTP settings are not configured or fail.
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Password reset link with token
 */
const sendResetEmail = async (email, resetUrl) => {
    const transporter = configureTransporter();

    const emailSubject = "Password Reset Request - Luxe E-commerce";
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #db2777; text-align: center;">Luxe E-commerce</h2>
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
            <p>Hello,</p>
            <p>You are receiving this email because you (or someone else) requested a password reset for your account on Luxe E-commerce.</p>
            <p>Please click the button below to reset your password. This link is valid for <strong>15 minutes</strong>:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
                If you're having trouble clicking the button, copy and paste the URL below into your web browser:<br />
                <a href="${resetUrl}" style="color: #db2777;">${resetUrl}</a>
            </p>
        </div>
    `;

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"Luxe Support" <${process.env.SMTP_USER}>`,
                to: email,
                subject: emailSubject,
                html: emailHtml,
            });
            console.log(`[SMTP] Reset email sent to ${email}`);
        } catch (error) {
            console.error("[SMTP] Error sending reset email:", error);
            // Fallback to console logging so the app doesn't crash during testing/misconfiguration
            console.log("\n==================================================");
            console.log("📨  SMTP FAILED: FALLBACK RESET EMAIL LOGGED");
            console.log(`To:      ${email}`);
            console.log(`Subject: ${emailSubject}`);
            console.log("Link:   ", resetUrl);
            console.log("==================================================\n");
        }
    } else {
        // Fallback for development/testing
        console.log("\n==================================================");
        console.log("📨  DEVELOPMENT MODE: PASSWORD RESET EMAIL");
        console.log(`To:      ${email}`);
        console.log(`Subject: ${emailSubject}`);
        console.log("Link:   ", resetUrl);
        console.log("==================================================\n");
    }
};

/**
 * Sends a signup/login OTP email to the user.
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit verification code
 */
const sendOTPEmail = async (email, otp) => {
    const transporter = configureTransporter();

    const emailSubject = "Email Verification Code - Luxe E-commerce";
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #db2777; text-align: center;">Luxe E-commerce</h2>
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
            <p>Hello,</p>
            <p>Thank you for choosing Luxe E-commerce. To complete your registration, please use the following one-time password (OTP) to verify your email address. This code is valid for <strong>5 minutes</strong>:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
            </div>
            <p>If you did not request this, please ignore this email.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
                This is an automated message, please do not reply directly to this email.
            </p>
        </div>
    `;

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"Luxe Support" <${process.env.SMTP_USER}>`,
                to: email,
                subject: emailSubject,
                html: emailHtml,
            });
            console.log(`[SMTP] OTP email sent to ${email}`);
        } catch (error) {
            console.error("[SMTP] Error sending OTP email:", error);
            // Fallback for development/testing
            console.log("\n==================================================");
            console.log("📨  SMTP FAILED: FALLBACK OTP EMAIL LOGGED");
            console.log(`To:   ${email}`);
            console.log(`Code: ${otp}`);
            console.log("==================================================\n");
        }
    } else {
        // Fallback for development/testing
        console.log("\n==================================================");
        console.log("📨  DEVELOPMENT MODE: OTP EMAIL LOGGED");
        console.log(`To:   ${email}`);
        console.log(`Code: ${otp}`);
        console.log("==================================================\n");
    }
};

/**
 * Sends a password reset OTP email to the user.
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit password reset code
 */
const sendResetOTPEmail = async (email, otp) => {
    const transporter = configureTransporter();

    const emailSubject = "Password Reset Verification Code - Luxe E-commerce";
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #db2777; text-align: center;">Luxe E-commerce</h2>
            <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
            <p>Hello,</p>
            <p>We received a request to reset the password for your Luxe E-commerce account. Please use the following one-time password (OTP) to proceed with resetting your password. This code is valid for <strong>15 minutes</strong>:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827; background-color: #f3f4f6; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
            </div>
            <p>If you did not request a password reset, please ignore this email and your password will remain secure.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">
                This is an automated message, please do not reply directly to this email.
            </p>
        </div>
    `;

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"Luxe Support" <${process.env.SMTP_USER}>`,
                to: email,
                subject: emailSubject,
                html: emailHtml,
            });
            console.log(`[SMTP] Reset OTP email sent to ${email}`);
        } catch (error) {
            console.error("[SMTP] Error sending reset OTP email:", error);
            // Fallback for development/testing
            console.log("\n==================================================");
            console.log("📨  SMTP FAILED: FALLBACK RESET OTP EMAIL LOGGED");
            console.log(`To:   ${email}`);
            console.log(`Code: ${otp}`);
            console.log("==================================================\n");
        }
    } else {
        // Fallback for development/testing
        console.log("\n==================================================");
        console.log("📨  DEVELOPMENT MODE: RESET OTP EMAIL LOGGED");
        console.log(`To:   ${email}`);
        console.log(`Code: ${otp}`);
        console.log("==================================================\n");
    }
};

module.exports = { sendResetEmail, sendOTPEmail, sendResetOTPEmail };
