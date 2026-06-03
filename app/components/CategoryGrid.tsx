'use client';

import Link from 'next/link';

interface CategoryItem {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
}

interface CategoryGridProps {
    categories: CategoryItem[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (categories.length === 0) return null;

    return (
        <section className="bg-gray-50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif">
                        Shop by Category
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Find the perfect art for your style
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/shop?category=${category.id}`} className="group block">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative h-40 sm:h-72 shadow-sm transition-all duration-500 hover:shadow-xl">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-center object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                                    }}
                                />
                                {/* Gradient overlay for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-85" />
                                
                                {/* Glassmorphic text info badge */}
                                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/90 backdrop-blur-md border border-white/20 px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between rounded-xl shadow-md transform transition-all duration-500 group-hover:-translate-y-1.5 group-hover:bg-white">
                                    <div className="min-w-0 pr-2">
                                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-widest truncate font-sans">
                                            {category.name}
                                        </h3>
                                        <span className="text-[9px] sm:text-[10px] text-indigo-600 font-semibold tracking-wider uppercase block mt-0.5 sm:mt-1 font-sans">
                                            Explore
                                        </span>
                                    </div>
                                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-300 group-hover:translate-x-0.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
