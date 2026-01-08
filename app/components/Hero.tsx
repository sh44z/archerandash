'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { normalizeDriveLink } from '@/lib/imageUtils';

interface Product {
    _id: string;
    title: string;
    description: string;
    images: string[];
}

interface HeroProps {
    products?: Product[];
}

export default function Hero({ products = [] }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // ... existing code ...


    // Filter products that actually have images
    const validProducts = products.filter(p => p.images && p.images.length > 0);

    useEffect(() => {
        if (validProducts.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % validProducts.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [validProducts.length]);

    if (validProducts.length === 0) {
        return (
            <div className="relative bg-zinc-900 h-[600px] flex items-center justify-center overflow-hidden">
                <div className="text-center px-4">
                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-serif">
                        <span className="block">Curated Art for</span>
                        <span className="block text-indigo-400">Modern Living</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                        Discover unique canvas prints and wall art.
                    </p>
                    <div className="mt-8">
                        <a href="#products" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-zinc-900 bg-white hover:bg-gray-100 md:py-4 md:text-lg transition-colors">
                            Shop Collection
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const currentProduct = validProducts[currentIndex];

    // Variants for slide animation
    const variants = {
        enter: { opacity: 0, x: 100 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
    };

    return (
        <div className="relative h-[500px] sm:h-[550px] md:h-[600px] bg-zinc-50 overflow-hidden group">
            {/* Background pattern or subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-100/50 pointer-events-none z-10" />

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentProduct._id}
                    className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Image - Shows first on mobile, right on desktop */}
                    <div className="relative z-10 w-full md:w-1/2 h-[200px] sm:h-[250px] md:h-full flex items-center justify-center px-4 md:px-0 mb-6 md:mb-0 order-1 md:order-2">
                        <motion.div
                            className="relative w-full h-full max-w-full flex items-center justify-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <img 
                                    src={normalizeDriveLink(currentProduct.images[0])}
                                    alt={currentProduct.title}
                                    className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                                    style={{ 
                                        maxHeight: '100%',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        width: 'auto'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Content - Shows below image on mobile, left on desktop */}
                    <div className="z-20 w-full md:w-1/2 text-center md:text-left md:pr-8 order-2 md:order-1">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="hidden md:block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-3 sm:mb-4"
                        >
                            {currentProduct.title}
                        </motion.h2>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link
                                href={`/product/${currentProduct._id}`}
                                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Shop Now
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            {validProducts.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {validProducts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {validProducts.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + validProducts.length) % validProducts.length)}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-white/90 md:bg-white/80 text-gray-800 shadow-md hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % validProducts.length)}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-white/90 md:bg-white/80 text-gray-800 shadow-md hover:bg-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
