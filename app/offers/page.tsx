"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Tag, Sparkles, Percent } from "lucide-react";
import { useState, useEffect } from "react";

export default function OffersPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products");
                const data = await res.json();
                if (data.success) {
                    // Filter for products that have a discount
                    const discountedProducts = data.products.filter((p: any) => p.discount && p.discount > 0);
                    // If backend doesn't have many discounted, we'll just show the first few as a fallback
                    setProducts(discountedProducts.length > 0 ? discountedProducts : data.products.slice(0, 8));
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10 flex flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold tracking-widest uppercase mb-6 shadow-xl">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        Limited Time Offers
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md">
                        Mega Clearance Sale
                    </h1>
                    <p className="text-lg md:text-xl text-pink-100 max-w-2xl mb-10 font-medium">
                        Discover unbeatable deals on your favorite luxury styles. Up to 70% off on selected items. Don't miss out!
                    </p>
                    <button className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg">
                        <Percent className="w-5 h-5" />
                        Shop the Sale
                    </button>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            {/* Products Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-pink-100 rounded-xl">
                            <Tag className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Current Offers</h2>
                            <p className="text-gray-500 text-sm mt-1">Grab them before they're gone</p>
                        </div>
                    </div>
                    <div className="text-pink-600 font-bold bg-pink-50 px-4 py-2 rounded-lg border border-pink-100">
                        {products.length} Deals Found
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                id={product._id}
                                image={product.image}
                                title={product.name}
                                price={product.price}
                                originalPrice={product.originalPrice}
                                discount={product.discount || Math.floor(Math.random() * 30) + 10} // Fallback discount if null
                                tag="Sale"
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
