"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scissors, Copy, CheckCircle2, Clock, Info } from "lucide-react";
import { useState } from "react";

const COUPONS = [
    {
        id: 1,
        title: "FLAT 50% OFF",
        description: "Valid on all new arrivals and premium collections.",
        code: "LUXE50",
        expiry: "Ends in 2 days",
        minOrder: "₹2,499",
        color: "from-pink-500 to-rose-500"
    },
    {
        id: 2,
        title: "EXTRA 20% OFF",
        description: "Applicable over existing discounts on clearance items.",
        code: "EXTRA20",
        expiry: "Ends today",
        minOrder: "₹1,499",
        color: "from-purple-500 to-indigo-500"
    },
    {
        id: 3,
        title: "FREE SHIPPING",
        description: "Get free express delivery on your next order.",
        code: "FREESHIP",
        expiry: "Ends in 5 days",
        minOrder: "₹999",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 4,
        title: "₹500 CASHBACK",
        description: "Flat cashback on your wallet after successful delivery.",
        code: "CASH500",
        expiry: "Ends in 1 week",
        minOrder: "₹3,999",
        color: "from-emerald-500 to-teal-500"
    }
];

export default function CouponsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Coupons</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Unlock extra savings with our exclusive, hand-picked daily discount codes. Just copy and apply at checkout!
                    </p>
                </div>

                {/* Coupons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {COUPONS.map((coupon) => (
                        <div key={coupon.id} className="relative group rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex">
                            
                            {/* Left Side (Discount Info) */}
                            <div className={`w-1/3 bg-gradient-to-br ${coupon.color} text-white p-6 flex flex-col justify-center items-center text-center relative`}>
                                <Scissors className="absolute top-2 right-2 w-5 h-5 opacity-20 transform rotate-180" />
                                <div className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2">
                                    {coupon.title.split(" ").map((word, i) => (
                                        <div key={i}>{word}</div>
                                    ))}
                                </div>
                                {/* Decorative dashed cut line */}
                                <div className="absolute right-0 top-0 bottom-0 w-[1px] border-r-2 border-dashed border-white/40"></div>
                                <div className="absolute -right-3 -top-3 w-6 h-6 bg-white rounded-full"></div>
                                <div className="absolute -right-3 -bottom-3 w-6 h-6 bg-white rounded-full"></div>
                            </div>

                            {/* Right Side (Details & Copy) */}
                            <div className="w-2/3 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                                        Use Code: <span className="text-pink-600 tracking-wider bg-pink-50 px-2 py-1 rounded-md border border-pink-100">{coupon.code}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                                        {coupon.description}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md">
                                            <Info className="w-3.5 h-3.5 text-blue-500" />
                                            Min. Order: {coupon.minOrder}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md">
                                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                                            {coupon.expiry}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy(coupon.code)}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                                        copiedCode === coupon.code
                                            ? "bg-green-50 text-green-600 border border-green-200"
                                            : "bg-gray-900 text-white hover:bg-pink-600 shadow-md hover:shadow-pink-500/25"
                                    }`}
                                >
                                    {copiedCode === coupon.code ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Copied to Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            Copy Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </main>
    );
}
