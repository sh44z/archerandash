'use client';

import { Product } from '@/types';
import { normalizeDriveLink } from '@/lib/imageUtils';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const imageUrl = product.images && product.images.length > 0
        ? normalizeDriveLink(product.images[0])
        : 'https://via.placeholder.com/300?text=No+Image';

    // Calculate Price Range
    let priceDisplay = '';
    if (product.variants && product.variants.length > 0) {
        const prices = product.variants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
            priceDisplay = `£${minPrice.toFixed(2)}`;
        } else {
            priceDisplay = `From £${minPrice.toFixed(2)}`;
        }
    } else if (product.price) {
        // Legacy fallback
        priceDisplay = `£${product.price.toFixed(2)}`;
    } else {
        priceDisplay = 'Price TBD';
    }

    const [imgSrc, setImgSrc] = useState(imageUrl);

    return (
        <Link href={`/product/${product._id}`} className="group block">
            <div
                className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm flex items-center justify-center p-2 md:p-0"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={imgSrc}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgSrc('https://via.placeholder.com/400x600?text=No+Image')}
                    className={`w-auto h-auto max-w-full max-h-full object-contain md:object-cover md:w-full md:h-full object-center transition-transform duration-700 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}
                />

                {/* Overlay Button */}
                <div className={`absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-full shadow-sm">
                        View Details
                    </span>
                </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row justify-between">
                <div className="mb-2 sm:mb-0">
                    <h3 className="text-sm text-gray-700 uppercase tracking-wide font-medium">
                        {product.title}
                    </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">{priceDisplay}</p>
            </div>
        </Link>
    );
}
