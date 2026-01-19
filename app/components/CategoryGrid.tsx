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

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/shop?category=${category.id}`} className="group">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8 relative h-64 shadow-md transition-shadow hover:shadow-xl">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                                    <h3 className="text-2xl font-bold text-white tracking-wider drop-shadow-md">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
