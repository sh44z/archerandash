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
    const [imgSrc, setImgSrc] = useState('');
    // ... existing code ...


    // Filter products that actually have images
    const validProducts = products.filter(p => p.images && p.images.length > 0);

    useEffect(() => {
        if (validProducts.length > 0) {
            setImgSrc(normalizeDriveLink(validProducts[currentIndex].images[0]));
        }
    }, [currentIndex, validProducts]);

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
                        src={imgSrc}
                        alt={currentProduct.title}
                        className="w-full h-full object-cover"
                        onError={() => setImgSrc('https://via.placeholder.com/800x600?text=No+Image')}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Link
                            href={`/product/${currentProduct._id}`}
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
