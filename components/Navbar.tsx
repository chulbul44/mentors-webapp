"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldAlert, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { 
        name: "Home", 
        href: "/" 
    },
    { 
        name: "Women", 
        href: "/women",
        categories: ["Dress", "Saree", "Tops", "Jewelry"]
    },
    { 
        name: "Men", 
        href: "/men",
        categories: ["Shirts", "T-Shirts", "Shoes", "Accessories"]
    },
    { name: "New Arrivals", href: "/new" },
    { name: "Offers", href: "/offers", special: true },
    { name: "Daily Coupons", href: "/coupons", special: true },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    
    const { cartCount, setIsCartOpen, isMounted } = useCart();

    useEffect(() => {
        if (!isMounted) return;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.isAdmin) {
            setTimeout(() => setIsAdmin(true), 0);
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMounted]);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none">
            <header 
                className={`w-full transition-all duration-500 pointer-events-auto ${
                    scrolled 
                    ? "py-2 px-4 sm:px-10" 
                    : "py-4 px-4 sm:px-6 lg:px-8"
                }`}
            >
                <nav className={`max-w-[1400px] mx-auto transition-all duration-500 rounded-[2rem] border overflow-visible ${
                    scrolled 
                    ? "glass shadow-2xl border-white/40" 
                    : "bg-white/40 backdrop-blur-sm border-transparent shadow-sm"
                }`}>
                    <div className="px-6 sm:px-10">
                        <div className="flex items-center justify-between h-16 sm:h-20">

                            {/* Logo */}
                            <Link href="/" className="shrink-0 flex items-center gap-2 cursor-pointer group">
                                <span className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                                    Luxe.
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <div 
                                        key={link.name}
                                        onMouseEnter={() => link.categories && setActiveDropdown(link.name)}
                                        onMouseLeave={() => setActiveDropdown(null)}
                                        className="relative"
                                    >
                                        <Link
                                            href={link.href}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1 group ${
                                                link.special 
                                                ? "text-pink-600 bg-pink-50/50 hover:bg-pink-50" 
                                                : "text-gray-800 hover:bg-white/60"
                                            }`}
                                        >
                                            {link.name}
                                            {link.categories && (
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                                            )}
                                        </Link>

                                        {/* Mega Menu Dropdown */}
                                        <AnimatePresence>
                                            {activeDropdown === link.name && link.categories && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                    className="absolute top-full left-0 mt-2 w-64 glass rounded-3xl shadow-2xl p-4 overflow-hidden"
                                                >
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-3 px-4">Popular in {link.name}</p>
                                                        {link.categories.map((cat) => (
                                                            <Link
                                                                key={cat}
                                                                href={`/${link.name.toLowerCase()}/${cat.toLowerCase()}`}
                                                                className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-white/60 hover:text-pink-600 rounded-2xl transition-all"
                                                            >
                                                                {cat}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                                
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 text-xs font-black text-white bg-gray-900 px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
                                    >
                                        <ShieldAlert className="w-4 h-4" />
                                        ADMIN
                                    </Link>
                                )}
                            </div>

                            {/* Right Section: Search & Icons */}
                            <div className="flex items-center gap-2 sm:gap-4">

                                {/* Search Bar */}
                                <div className={`hidden md:flex items-center bg-white/60 border border-transparent transition-all duration-500 rounded-full px-4 py-2 ${
                                    searchFocused ? "w-80 border-pink-200 bg-white shadow-lg" : "w-48"
                                }`}>
                                    <Search className={`w-4 h-4 transition-colors ${searchFocused ? "text-pink-500" : "text-gray-400"}`} />
                                    <input
                                        type="text"
                                        placeholder="Search trends..."
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        className="ml-2 bg-transparent outline-none text-sm font-bold text-gray-800 w-full placeholder:text-gray-400"
                                    />
                                </div>

                                {/* Icons */}
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button className="p-3 rounded-full hover:bg-white/60 text-gray-700 hover:text-pink-600 transition-all relative group">
                                        <Heart className="w-6 h-6" />
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white animate-pulse" />
                                    </button>
                                    
                                    <button
                                        onClick={() => setIsCartOpen(true)}
                                        className="p-3 rounded-full hover:bg-white/60 text-gray-700 hover:text-pink-600 transition-all relative"
                                    >
                                        <ShoppingBag className="w-6 h-6" />
                                        {isMounted && cartCount > 0 && (
                                            <span className="absolute top-2 right-2 bg-gray-900 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                    
                                    <Link href="/profile" className="hidden sm:flex p-3 rounded-full hover:bg-white/60 text-gray-700 hover:text-pink-600 transition-all">
                                        <User className="w-6 h-6" />
                                    </Link>
                                </div>

                                {/* Mobile Menu Button */}
                                <div className="lg:hidden">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="p-3 rounded-full bg-white/60 text-gray-800 hover:text-pink-600 transition-all"
                                    >
                                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer (Same as before but improved design) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 z-50 h-full w-[320px] glass shadow-2xl lg:hidden rounded-l-[3.5rem] overflow-hidden"
                        >
                            <div className="flex flex-col h-full p-8">
                                <div className="flex items-center justify-between mb-10">
                                    <span className="text-2xl font-black text-gray-900 tracking-tighter">EXPLORE</span>
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-white/60 rounded-full hover:bg-white transition-all">
                                        <X className="w-6 h-6 text-gray-800" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-6">
                                    {/* Mobile Search */}
                                    <div className="flex items-center bg-white/80 px-5 py-4 rounded-[2rem] border border-gray-100 shadow-sm focus-within:border-pink-200 transition-all">
                                        <Search className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Find something..."
                                            className="ml-3 bg-transparent outline-none text-base font-bold text-gray-800 w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={`block px-6 py-4 rounded-[2rem] text-xl font-bold transition-all ${link.special
                                                    ? "bg-pink-500 text-white shadow-lg shadow-pink-200"
                                                    : "text-gray-800 hover:bg-white hover:text-pink-600"
                                                    }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="pt-10 border-t border-gray-100">
                                        <Link href="/profile" className="flex items-center gap-4 px-6 py-4 text-gray-700 font-bold hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="p-3 bg-white/60 rounded-2xl"><User className="w-6 h-6" /></div>
                                            <span>My Account</span>
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-4 px-6 py-4 text-gray-700 font-bold hover:text-pink-600" onClick={() => setIsMobileMenuOpen(false)}>
                                            <div className="p-3 bg-white/60 rounded-2xl"><Heart className="w-6 h-6" /></div>
                                            <span>My Wishlist</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
