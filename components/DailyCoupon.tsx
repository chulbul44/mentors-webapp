"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Sparkles } from "lucide-react";

const COUPONS = [
    { code: "WOMEN30", discount: "30% OFF", category: "Women's Collection", description: "Get flat 30% off on all women's apparel." },
    { code: "SAREE25", discount: "25% OFF", category: "Ethnic Wear", description: "Special discount on our premium silk sarees." },
    { code: "SUMMER40", discount: "40% OFF", category: "Summer Essentials", description: "Beat the heat with our cool summer collection." },
    { code: "PARTY50", discount: "50% OFF", category: "Party Wear", description: "Shine bright with half price on party dresses." },
    { code: "ACCESS20", discount: "20% OFF", category: "Accessories", description: "Complete your look with stylish accessories." },
    { code: "FIRST15", discount: "15% OFF", category: "New Arrivals", description: "Welcome bonus for our newest collection." },
];

export default function DailyCoupon() {
    const [coupon, setCoupon] = useState(COUPONS[0]);
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Select coupon based on the day of the month
        const dayOfMonth = new Date().getDate();
        const index = dayOfMonth % COUPONS.length;
        setTimeout(() => setCoupon(COUPONS[index]), 0);

        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-16 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative group">
                    {/* Animated Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className="relative glass rounded-3xl p-1 overflow-hidden shadow-2xl">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[22px] p-6 sm:p-12 text-gray-900 relative flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">

                            {/* Left Content */}
                            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-lg">
                                <div className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-pink-200">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Today&apos;s Exclusive Reward
                                </div>
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-gray-900">
                                    {coupon.discount} <br />
                                    <span className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block mt-2">
                                        on {coupon.category}
                                    </span>
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    {coupon.description}
                                </p>

                                <div className="flex items-center gap-3 text-sm font-bold bg-white/50 backdrop-blur-md border border-gray-200 px-6 py-3 rounded-2xl shadow-sm">
                                    <Clock className="w-5 h-5 text-pink-500 animate-pulse" />
                                    <span className="text-gray-700">Ends in: <span className="text-pink-600">{timeLeft}</span></span>
                                </div>
                            </div>

                            {/* Right Content - Coupon Card */}
                            <div className="relative z-10 w-full max-w-sm">
                                <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-2 border-dashed border-pink-200 relative overflow-hidden">
                                    <div className="text-center space-y-6">
                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Unlock Coupon</p>
                                        <div className="bg-gray-50 py-6 rounded-2xl border border-gray-100 group-hover:border-pink-100 transition-colors">
                                            <code className="text-4xl font-black tracking-[0.15em] text-gray-900">
                                                {coupon.code}
                                            </code>
                                        </div>

                                        <button
                                            onClick={copyToClipboard}
                                            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 ${copied
                                                ? "bg-emerald-500 text-white"
                                                : "bg-gray-900 text-white hover:bg-black"
                                                }`}
                                        >
                                            {copied ? (
                                                <>SAVED!</>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5" />
                                                    COPY CODE
                                                </>
                                            )}
                                        </button>
                                        <p className="text-[10px] text-gray-400 font-medium">
                                            *Automatically applied at checkout. Limited time offer.
                                        </p>
                                    </div>
                                    
                                    {/* Decorative circles */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8f9fb] rounded-full shadow-inner border-r border-pink-100"></div>
                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#f8f9fb] rounded-full shadow-inner border-l border-pink-100"></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
