'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { setIsCartOpen, cartCount } = useCart();

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-gray-900">
                            Archer & Ash
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/shop" className="text-gray-600 hover:text-black transition-colors text-sm uppercase tracking-wide">Shop</Link>
                        <Link href="/about" className="text-gray-600 hover:text-black transition-colors text-sm uppercase tracking-wide">About</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-black transition-colors text-sm uppercase tracking-wide">Contact</Link>
                        <Link href="/hub" className="text-indigo-600 hover:text-indigo-800 transition-colors text-sm uppercase tracking-wide font-medium">Hub</Link>

                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-600 hover:text-black transition-colors">
                            <span className="sr-only">Open cart</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-black focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/shop" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 uppercase tracking-wide">Shop</Link>
                        <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 uppercase tracking-wide">About</Link>
                        <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 uppercase tracking-wide">Contact</Link>
                        <Link href="/hub" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 uppercase tracking-wide">Hub</Link>
                        <button
                            onClick={() => { setIsCartOpen(true); setIsOpen(false); }}
                            className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 uppercase tracking-wide"
                        >
                            Cart ({cartCount})
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
