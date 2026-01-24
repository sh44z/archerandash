import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ProductCard from '@/app/components/ProductCard';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const dynamic = 'force-dynamic';

async function getCategory(slug: string) {
    await dbConnect();
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;
    return {
        ...category,
        _id: category._id.toString(),
        parent: category.parent ? category.parent.toString() : null
    };
}

async function getProductsInCollection(categoryId: string) {
    await dbConnect();
    // Find products in this category OR subcategories
    // First get all subcats
    const subcats = await Category.find({ parent: categoryId }).lean();
    const catIds = [categoryId, ...subcats.map(c => c._id)];

    const products = await Product.find({
        $or: [
            { category: { $in: catIds } },
            { categories: { $in: catIds } } // Support both legacy single ref and array
        ]
    })
        .sort({ createdAt: -1 })
        .lean();

    return products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        variants: p.variants || [],
        images: p.images || [],
        category: p.category ? p.category.toString() : undefined,
        slug: p.slug
    }));
}

import Breadcrumbs from '@/app/components/Breadcrumbs';

// ... imports

// ... getCategory, getProductsInCollection

export default async function CollectionPage({ params }: PageProps) {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        notFound();
    }

    const products = await getProductsInCollection(category._id);

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Breadcrumbs items={[
                    { label: 'Collections', href: '/collections' },
                    { label: category.name, href: `/collections/${category.slug}` }
                ]} />

                <div className="border-b border-gray-200 pb-10 mb-10 mt-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-serif">
                        {category.name}
                    </h1>
                    <p className="mt-4 text-base text-gray-500 max-w-2xl">
                        Shop our exclusive {category.name} collection.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products found in this collection.
                        </div>
                    ) : (
                        products.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategory(slug);

    if (!category) {
        return {
            title: "Collection Not Found",
            description: "The requested collection could not be found."
        };
    }

    return {
        title: `${category.name} | Archer and Ash`,
        description: `Shop ${category.name} at Archer and Ash.`,
        alternates: {
            canonical: `/collections/${slug}`
        },
        openGraph: {
            title: `${category.name} | Archer and Ash`,
            description: `Shop ${category.name} at Archer and Ash.`,
        }
    };
}
