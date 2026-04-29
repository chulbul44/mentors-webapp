"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Summer Essentials",
    subtitle: "2026 Collection",
    description: "Lightweight fabrics and vibrant colors designed for the ultimate summer escape.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
    accent: "from-orange-400 to-pink-500",
  },
  {
    id: 2,
    title: "Modern Minimalism",
    subtitle: "Timeless Pieces",
    description: "Elevate your daily rotation with our curated selection of clean silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Eco-Conscious",
    subtitle: "Sustainable Style",
    description: "Feel good in what you wear. Our most sustainable collection yet, crafted with care.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    accent: "from-emerald-400 to-teal-600",
  },
];

const AnimatedHero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="relative w-full h-[90vh] overflow-hidden mt-4 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.8 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110"
              style={{ backgroundImage: `url(${slides[current].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-2xl"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/30">
                  {slides[current].subtitle}
                </span>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                  {slides[current].title.split(" ").map((word, i) => (
                    <span key={i} className="block">
                      {i === 1 ? (
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[current].accent}`}>
                          {word}
                        </span>
                      ) : (
                        word
                      )}
                    </span>
                  ))}
                </h1>
                <p className="text-xl text-white/80 mb-10 max-w-lg leading-relaxed">
                  {slides[current].description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold transition-all hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:-translate-y-1">
                    Shop Collection
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="px-8 py-4 rounded-full font-bold border-2 border-white/30 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white">
                    Explore Trends
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-20">
          <button
            onClick={prevSlide}
            className="p-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-10 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                index === current ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
