'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { normalizeDriveLink } from '@/lib/imageUtils';

interface Product {
    _id: string;
    title: string;
    description: string;
    categories?: string;
    variants: { size: string; price: number }[];
    images: string[];
}

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Default to first variant if exists, else handle legacy
    const currentPrice = selectedVariant ? selectedVariant.price : (product as any).price;

    const handleAddToCart = () => {
        const price = selectedVariant ? selectedVariant.price : (product as any).price;
        const size = selectedVariant ? selectedVariant.size : 'One Size';

        if (price === undefined) {
            console.error("No price found for product");
            return;
        }

        addToCart({
            productId: product._id,
            title: product.title,
            image: normalizeDriveLink(product.images[0]),
            price: price,
            size: size,
            quantity: 1
        });
    };

    return (
        <div className="bg-white">
            <div className="pt-6 pb-16 sm:pb-24">
                <div className="mt-8 max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                        {/* Image Gallery */}
                        <div className="flex flex-col-reverse">
                            {/* Mobile Image Carousel */}
                            <div className="block sm:hidden w-full aspect-square relative mb-6 overflow-hidden rounded-lg">
                                <div className="flex overflow-x-auto snap-x snap-mandatory h-full w-full hide-scrollbar">
                                    {product.images.map((image, idx) => (
                                        <div key={idx} className="w-full flex-shrink-0 snap-center h-full flex items-center justify-center bg-gray-50 p-2">
                                            <img
                                                src={normalizeDriveLink(image)}
                                                alt={`${product.title} - Image ${idx + 1}`}
                                                className="w-auto h-auto max-w-full max-h-full object-contain"
                                                style={{
                                                    maxHeight: '100%',
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    width: 'auto'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* Simple Dots for Mobile */}
                                {product.images.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 pointer-events-none z-10">
                                        {product.images.map((_, idx) => (
                                            <div key={idx} className="w-2 h-2 rounded-full bg-gray-400/70" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Desktop Image Selector */}
                            <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                                <div className="grid grid-cols-4 gap-6" aria-orientation="horizontal">
                                    {product.images.map((image, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50 ${idx === currentImageIndex ? 'ring-indigo-500' : 'ring-transparent'
                                                }`}
                                        >
                                            <span className="sr-only">View Image {idx + 1}</span>
                                            <span className="absolute inset-0 rounded-md overflow-hidden">
                                                <img src={normalizeDriveLink(image)} alt="" className="w-full h-full object-center object-cover" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden sm:block w-full aspect-w-1 aspect-h-1 relative">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-4"
                                >
                                    {/* "hole image fit in the view" - using contain */}
                                    <img
                                        src={normalizeDriveLink(product.images[currentImageIndex])}
                                        alt={product.title}
                                        className="w-auto h-auto max-w-full max-h-full object-contain"
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            height: 'auto',
                                            width: 'auto'
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif">{product.title}</h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl text-gray-900">£{currentPrice}</p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div
                                    className="text-base text-gray-700 space-y-6"
                                    dangerouslySetInnerHTML={{ __html: product.description }} // Assuming rich text or just text, safer to use just {product.description} if plain text, but often description might have line breaks
                                />
                            </div>

                            <div className="mt-6">
                                {/* Variants */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-4 mt-4">
                                            {product.variants.map((variant) => (
                                                <button
                                                    key={variant.size}
                                                    onClick={() => setSelectedVariant(variant)}
                                                    className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${selectedVariant?.size === variant.size
                                                        ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
                                                        : 'bg-white border-gray-200 text-gray-900'
                                                        }`}
                                                >
                                                    <span id={`size-choice-${variant.size}-label`}>{variant.size}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 flex sm:flex-col1">
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full transition-transform hover:scale-105"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
