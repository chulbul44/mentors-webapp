"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, Loader2, Key } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [showOtpVerify, setShowOtpVerify] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    // Check if redirecting from login page for an unverified account
    useEffect(() => {
        const verifyParam = searchParams.get("verify");
        const emailParam = searchParams.get("email");
        if (verifyParam === "true" && emailParam) {
            setRegisteredEmail(emailParam);
            setShowOtpVerify(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setRegisteredEmail(formData.email);
                setShowOtpVerify(true);
                alert("A 6-digit verification code (OTP) has been sent to your email.");
            } else {
                alert("Signup Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error: Could not connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: registeredEmail,
                    otp: otp.trim()
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Save user info & token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    isAdmin: data.isAdmin
                }));
                alert("Account verified successfully! Welcome to Luxe E-commerce.");
                router.push("/");
            } else {
                alert("Verification Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error verifying OTP. Please try again.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/resend-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: registeredEmail })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("A new 6-digit OTP has been sent to your email.");
            } else {
                alert("Resend OTP Failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error resending verification code.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/50 w-full max-w-md">
            {!showOtpVerify ? (
                <>
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Store
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Create Account
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            Join us for exclusive deals and faster checkout
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    placeholder="hello@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Create a strong password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-pink-600 font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center mb-10">
                        <button 
                            onClick={() => setShowOtpVerify(false)} 
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Registration
                        </button>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Verify Email
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm">
                            We have sent a 6-digit verification code to <span className="font-semibold text-gray-900">{registeredEmail}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">6-Digit Code (OTP)</label>
                            <div className="relative">
                                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    placeholder="123456"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all text-gray-900 tracking-[8px] font-bold text-center text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    disabled={otpLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={otpLoading}
                            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {otpLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Activate"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-3">
                        <p className="text-sm text-gray-500">
                            Didn't receive the code?
                        </p>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendLoading}
                            className="text-pink-600 font-bold hover:underline text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                        >
                            {resendLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending Code...
                                </>
                            ) : (
                                "Resend verification code"
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-soft-bg relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4 flex justify-center">
                <Suspense fallback={
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-gray-500 w-full max-w-md">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-pink-500" />
                        <span>Loading registration form...</span>
                    </div>
                }>
                    <SignupForm />
                </Suspense>
            </div>
        </div>
    );
}
