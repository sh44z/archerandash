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

const GRADIENTS = [
    { bg: 'from-indigo-50/80 to-purple-50/40 border-indigo-100/60', accent: 'bg-indigo-600 text-white', text: 'text-indigo-800', hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-100/40' },
    { bg: 'from-rose-50/80 to-orange-50/40 border-rose-100/60', accent: 'bg-rose-600 text-white', text: 'text-rose-800', hoverBorder: 'hover:border-rose-300 hover:shadow-rose-100/40' },
    { bg: 'from-emerald-50/80 to-teal-50/40 border-emerald-100/60', accent: 'bg-emerald-600 text-white', text: 'text-emerald-800', hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-100/40' },
    { bg: 'from-blue-50/80 to-cyan-50/40 border-blue-100/60', accent: 'bg-blue-600 text-white', text: 'text-blue-800', hoverBorder: 'hover:border-blue-300 hover:shadow-blue-100/40' },
    { bg: 'from-amber-50/80 to-yellow-50/40 border-amber-100/60', accent: 'bg-amber-600 text-white', text: 'text-amber-800', hoverBorder: 'hover:border-amber-300 hover:shadow-amber-100/40' },
    { bg: 'from-violet-50/80 to-fuchsia-50/40 border-violet-100/60', accent: 'bg-violet-600 text-white', text: 'text-violet-800', hoverBorder: 'hover:border-violet-300 hover:shadow-violet-100/40' },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (categories.length === 0) return null;

    return (
        <section className="bg-gray-50/50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif tracking-tight">
                        Shop by Category
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
                        Find the perfect art for your style
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {categories.map((category, index) => {
                        const style = GRADIENTS[index % GRADIENTS.length];
                        return (
                            <Link key={category.id} href={`/shop?category=${category.id}`} className="group block">
                                <div className={`h-36 sm:h-44 w-full rounded-2xl border bg-gradient-to-br ${style.bg} p-4 sm:p-6 flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${style.hoverBorder}`}>
                                    <div className="flex justify-between items-start">
                                        {/* Styled modern monogram */}
                                        <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-white/50 text-base sm:text-lg font-extrabold ${style.text}`}>
                                            {category.name.charAt(0)}
                                        </div>
                                        {/* Clean Explore badge */}
                                        <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase bg-white/95 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-gray-600 border border-gray-100/50">
                                            Explore
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-3 sm:mt-4">
                                        <div className="min-w-0 pr-2">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight font-serif truncate group-hover:text-indigo-900 transition-colors">
                                                {category.name}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs text-gray-500 font-sans mt-0.5 block">
                                                Browse art &rarr;
                                            </span>
                                        </div>
                                        <div className={`flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full ${style.accent} shadow-md transition-all duration-300 group-hover:scale-110`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform transition-transform duration-300 group-hover:translate-x-0.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
