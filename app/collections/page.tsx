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

const COLLECTIONS_GRADIENTS = [
    { bg: 'from-slate-50 to-zinc-100/50 border-slate-200/60', text: 'text-slate-900', accent: 'bg-slate-900 text-white', hoverBorder: 'hover:border-slate-400 hover:shadow-slate-100/80' },
    { bg: 'from-stone-50 to-neutral-100/50 border-stone-200/60', text: 'text-stone-900', accent: 'bg-stone-800 text-white', hoverBorder: 'hover:border-stone-400 hover:shadow-stone-100/80' },
    { bg: 'from-indigo-50/50 to-slate-100/50 border-indigo-100/60', text: 'text-indigo-900', accent: 'bg-indigo-900 text-white', hoverBorder: 'hover:border-indigo-300 hover:shadow-indigo-50/80' },
    { bg: 'from-rose-50/50 to-zinc-100/50 border-rose-100/60', text: 'text-rose-900', accent: 'bg-rose-900 text-white', hoverBorder: 'hover:border-rose-300 hover:shadow-rose-50/80' },
    { bg: 'from-emerald-50/50 to-neutral-100/50 border-emerald-100/60', text: 'text-emerald-900', accent: 'bg-emerald-900 text-white', hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-50/80' },
];

export default async function CollectionsPage() {
    const categories = await getCategories();
    const parentCategories = categories.filter(c => !c.parent);

    return (
        <div className="bg-gray-50/30 min-h-screen">
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
                    {parentCategories.map((category, index) => {
                        const style = COLLECTIONS_GRADIENTS[index % COLLECTIONS_GRADIENTS.length];
                        return (
                            <Link
                                key={category._id}
                                href={`/collections/${category.slug}`}
                                className={`group relative block h-48 sm:h-56 w-full overflow-hidden rounded-2xl border bg-gradient-to-br ${style.bg} p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${style.hoverBorder}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0 pr-4">
                                        <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase font-sans">
                                            Collection
                                        </span>
                                        <h2 className="text-2xl font-bold text-gray-900 mt-2 font-serif group-hover:text-indigo-900 transition-colors">
                                            {category.name}
                                        </h2>
                                    </div>
                                    <span className="text-2xl font-extrabold font-serif text-gray-300 group-hover:text-indigo-200 transition-colors select-none">
                                        0{index + 1}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50">
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 font-sans">
                                        View Collection 
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
