"use client";

import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle, CreditCard, Truck, MapPin, Wallet } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0 && !isSuccess) {
            router.push("/");
        }
    }, [cart, isSuccess, router]);

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. Your order has been placed successfully and is being processed.
                    </p>
                    <Link
                        href="/"
                        className="block w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (cart.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="Doe" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input required type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="john@example.com" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Street Address</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="123 Main St, Apt 4B" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none" placeholder="10001" />
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 p-4 border border-pink-500 bg-pink-50/30 rounded-2xl cursor-pointer transition-all">
                                    <div className="w-5 h-5 rounded-full border-2 border-pink-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-pink-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Wallet className="w-4 h-4 text-gray-500" />
                                            Credit / Debit Card
                                        </span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-all">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-gray-500" />
                                            Cash on Delivery
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={
                                                    item.image && typeof item.image === 'string' && (item.image.startsWith('/') || item.image.startsWith('http'))
                                                        ? item.image 
                                                        : "/favicon.ico"
                                                } 
                                                alt={item.title} 
                                                className="w-full h-full object-cover" 
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-bold text-lg pt-2">
                                    <span>Total</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>Place Order</>
                                )}
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Secure checkout powered by Stripe (Mock)
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
