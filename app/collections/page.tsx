import Link from 'next/link';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getCategories() {
    await dbConnect();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return categories.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
        parent: c.parent ? c.parent.toString() : null
    }));
}

export default async function CollectionsPage() {
    const categories = await getCategories();
    const parentCategories = categories.filter(c => !c.parent);

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-12 text-center font-serif">
                    Collections
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {parentCategories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/collections/${category.slug}`}
                            className="group relative block h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 hover:ring-indigo-500 transition-all duration-300"
                        >
                            {/* Optional: Add category image if available in model later */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors">
                                <span className="text-gray-400 text-4xl font-light">
                                    {/* Placeholder icon or image */}
                                    {category.name.charAt(0)}
                                </span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-50 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-6 w-full text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {category.name}
                                </h2>
                                <span className="inline-flex items-center text-sm font-medium text-white group-hover:underline">
                                    View Collection &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export const metadata: Metadata = {
    title: 'Collections | Archer and Ash',
    description: 'Explore our curated collections of wall art and canvas prints.',
    alternates: {
        canonical: '/collections'
    }
};
