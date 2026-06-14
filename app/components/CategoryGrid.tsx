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
        <section className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl font-serif tracking-tight">
                        Shop by Category
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
                        Find the perfect art for your style
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/shop?category=${category.id}`} className="group block w-[calc(50%-8px)] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] max-w-xs">
                            <div className="h-28 sm:h-36 w-full rounded-2xl border border-gray-100 bg-white flex items-center justify-center p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-200">
                                <span className="text-xl sm:text-2xl lg:text-3xl text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 font-serif font-bold text-center select-none">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
