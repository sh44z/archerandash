import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductDetails from '@/app/components/ProductDetails';
import mongoose from 'mongoose';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getProduct(term: string) {
    await dbConnect();

    try {
        let query;
        if (mongoose.isValidObjectId(term)) {
            query = { $or: [{ _id: term }, { slug: term }] };
        } else {
            query = { slug: term };
        }

        const product = await Product.findOne(query).populate('category', 'name slug').lean();
        if (!product) return null;

        // Serialize for client component
        return {
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            images: product.images || [],
            variants: product.variants || [],
            category: product.category ? {
                // @ts-ignore
                name: product.category.name,
                // @ts-ignore
                slug: product.category.slug,
                // @ts-ignore
                _id: product.category._id.toString()
            } : undefined, // Handle populated category
            slug: product.slug
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    // Redirect legacy ID URLs to slug URLs if slug exists
    if (mongoose.isValidObjectId(slug) && product.slug && slug !== product.slug) {
        permanentRedirect(`/product/${product.slug}`);
    }

    const breadcrumbItems = [
        { label: 'Collections', href: '/collections' },
    ];

    if (product.category) {
        // @ts-ignore
        breadcrumbItems.push({ label: product.category.name, href: `/collections/${product.category.slug}` });
    }

    breadcrumbItems.push({ label: product.title, href: `/product/${product.slug || product._id}` });

    return (
        <div className="bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.title,
                        description: product.description,
                        image: product.images,
                        sku: product._id,
                        brand: {
                            "@type": "Brand",
                            name: "Archer and Ash"
                        },
                        offers: {
                            "@type": "AggregateOffer",
                            priceCurrency: "GBP",
                            lowPrice: product.variants?.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : 0,
                            highPrice: product.variants?.length > 0 ? Math.max(...product.variants.map((v: any) => v.price)) : 0,
                            offerCount: product.variants?.length || 0,
                            availability: "https://schema.org/InStock"
                        }
                    })
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            {/* @ts-ignore */}
            <ProductDetails product={product} />
        </div>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: "Product Not Found",
            description: "The requested product could not be found."
        };
    }

    const mainImage = product.images?.[0] || "";

    return {
        title: product.title,
        description: product.description?.substring(0, 160) || `Buy ${product.title} at Archer and Ash`,
        alternates: {
            canonical: `/product/${product.slug || product._id}`
        },
        openGraph: {
            title: product.title,
            description: product.description?.substring(0, 200),
            images: mainImage ? [{ url: mainImage }] : [],
            type: 'article'
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description?.substring(0, 200),
            images: mainImage ? [mainImage] : [],
        }
    };
}
