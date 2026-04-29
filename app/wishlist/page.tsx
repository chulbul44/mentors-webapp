"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products and simulate checking wishlist from localStorage
        const fetchWishlist = async () => {
            try {
                // In a real app, this would be a backend call or global state
                const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                
                if (savedWishlist.length > 0) {
                    const res = await fetch("http://localhost:5000/api/products");
                    const data = await res.json();
                    if (data.success) {
                        const items = data.products.filter((p: any) => savedWishlist.includes(p._id));
                        setWishlistItems(items);
                    }
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                    <div className="p-3 bg-pink-100 rounded-full text-pink-600">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Wishlist</h1>
                        <p className="text-gray-500 mt-1">{wishlistItems.length} items saved</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {wishlistItems.map((product) => (
                            <div key={product._id} className="relative group">
                                <ProductCard
                                    id={product._id}
                                    image={product.image}
                                    title={product.name}
                                    price={product.price}
                                    originalPrice={product.originalPrice}
                                    discount={product.discount}
                                    tag={product.tag}
                                />
                                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-pink-500 hover:bg-pink-50 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 z-10">
                                    <Heart className="w-5 h-5 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6 relative">
                            <Heart className="w-10 h-10 text-pink-300" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-gray-200 rounded-full text-white flex items-center justify-center text-[10px] font-bold">0</div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 max-w-sm mb-8">
                            Save items you love and buy them later. Start exploring our collections now.
                        </p>
                        <Link 
                            href="/"
                            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg hover:shadow-pink-500/30"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
