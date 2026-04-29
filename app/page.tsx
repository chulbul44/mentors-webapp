"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
const AnimatedHero = dynamic(() => import("@/components/AnimatedHero"), { ssr: false });
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false });
import DailyCoupon from "@/components/DailyCoupon";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative pt-20">
      <DynamicBackground />
      <Navbar />
      <AnimatedHero />
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <DailyCoupon />
        <CategorySection />
        <ProductSection />
      </div>
      <Footer />
    </main>
  );
}
