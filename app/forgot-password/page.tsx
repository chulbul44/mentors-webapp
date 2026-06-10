"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle, Key, Lock, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // OTP Reset states
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

    // Request Reset OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(data.message || "A password reset OTP has been sent.");
                if (data.otp) {
                    setGeneratedOtp(data.otp);
                }
                setShowOtpInput(true);
            } else {
                setError(data.message || "An error occurred. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Could not connect to server. Ensure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP & Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    otp: otp.trim(),
                    newPassword
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage(data.message || "Password reset successfully!");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setGeneratedOtp(null);

                // Redirect to login page after 3 seconds
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(data.message || "Reset failed. Please verify your OTP and try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Could not connect to server. Ensure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/50">
                    
                    {!showOtpInput ? (
                        <>
                            <div className="text-center mb-8">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors mb-6"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    Forgot Password
                                </h1>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Enter your email address to receive a secure password reset OTP
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex gap-3 items-start animate-in fade-in duration-300">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="your-email@example.com"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        "Send Reset OTP"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <button
                                    onClick={() => {
                                        setShowOtpInput(false);
                                        setMessage(null);
                                        setError(null);
                                        setGeneratedOtp(null);
                                    }}
                                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors mb-6"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Email
                                </button>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                    Reset Password
                                </h1>
                                <p className="text-gray-500 mt-2 text-sm">
                                    Enter the 6-digit OTP code sent to your email to update your password
                                </p>
                            </div>

                            {/* Testing OTP Banner */}
                            {generatedOtp && (
                                <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex gap-3 items-start animate-in fade-in duration-300">
                                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold">Development Mode OTP: </span>
                                        <span className="font-bold tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded">{generatedOtp}</span>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex gap-3 items-start animate-in fade-in duration-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <span>{message}</span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex gap-3 items-start animate-in fade-in duration-300">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">6-Digit Reset OTP</label>
                                    <div className="relative">
                                        <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            placeholder="123456"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900 tracking-[8px] font-bold text-center text-lg"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Create a strong password"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Verify your new password"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
