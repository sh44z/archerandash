import Link from 'next/link';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

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
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-serif sm:text-5xl">
                        Our Collections
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Discover curated art pieces grouped by theme and style.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {parentCategories.map((category) => (
                        <Link
                            key={category._id}
                            href={`/collections/${category.slug}`}
                            className="group relative block h-32 sm:h-40 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white flex items-center justify-center p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-200"
                        >
                            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 font-calligraphy capitalize text-center select-none leading-none">
                                {category.name.toLowerCase()}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
