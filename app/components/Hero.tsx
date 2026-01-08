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

    return (
        <div className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentProduct._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={normalizeDriveLink(currentProduct.images[0])}
                        alt={currentProduct.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Link
                            href={`/product/${currentProduct._id}`}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            {validProducts.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {validProducts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {validProducts.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + validProducts.length) % validProducts.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % validProducts.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
