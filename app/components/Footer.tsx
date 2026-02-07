import Link from 'next/link';
import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold tracking-wider">Archer and Ash</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Curated wall art and canvas prints for the modern home. diverse collections designed to inspire.
                        </p>
                        <div className="flex space-x-4 pt-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaPinterest className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/collections/mindfulness" className="hover:text-white transition-colors">Mindfulness</Link></li>
                            <li><Link href="/collections/abstract" className="hover:text-white transition-colors">Abstract</Link></li>
                            <li><Link href="/collections/minimalist" className="hover:text-white transition-colors">Minimalist</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Information</Link></li>
                            <li><Link href="/refunds" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Email</span>
                                <a href="mailto:customers@archerandash.com" className="hover:text-white transition-colors">customers@archerandash.com</a>
                            </li>
                            <li>
                                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1 mt-4">Business Name</span>
                                <span>Archer And Ash UK</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {currentYear} Archer And Ash UK. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
