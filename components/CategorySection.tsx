"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
    { name: "Sarees", image: "https://images.unsplash.com/photo-1610030469983-98e55041d04f?q=80&w=2574&auto=format&fit=crop", count: "120+ Items", accent: "from-pink-500/20 to-purple-500/20" },
    { name: "Kurtis", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2670&auto=format&fit=crop", count: "85+ Items", accent: "from-blue-500/20 to-indigo-500/20" },
    { name: "Western Wear", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop", count: "200+ Items", accent: "from-orange-500/20 to-red-500/20" },
    { name: "Party Wear", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2548&auto=format&fit=crop", count: "50+ Items", accent: "from-emerald-500/20 to-teal-500/20" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2000&auto=format&fit=crop", count: "150+ Items", accent: "from-indigo-500/20 to-purple-500/20" },
];

export default function CategorySection() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-xs font-black tracking-widest uppercase border border-pink-200"
                        >
                            Curated Selection
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter"
                        >
                            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Category</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/categories" className="group flex items-center gap-3 text-lg font-bold text-gray-900 hover:text-pink-600 transition-all">
                            Explore All Categories 
                            <div className="p-2 rounded-full bg-white border border-gray-100 group-hover:border-pink-200 group-hover:bg-pink-50 transition-all shadow-sm">
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/category/${cat.name.toLowerCase()}`}
                                className="group block relative rounded-[2.5rem] overflow-hidden aspect-[4/5] glass shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                
                                {/* Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: `url('${cat.image}')` }}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-2xl font-black mb-2 tracking-tight">{cat.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{cat.count}</p>
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-pink-200/20 rounded-full blur-[120px] -z-10"></div>
        </section>
    );
}
