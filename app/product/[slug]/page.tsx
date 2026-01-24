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
        let isId = mongoose.isValidObjectId(term);

        if (isId) {
            query = { $or: [{ _id: term }, { slug: term }] };
        } else {
            query = { slug: term };
        }

        // Must fetch document to support saving if needed
        let productDoc = await Product.findOne(query);

        if (!productDoc) return null;

        // Self-healing: If product has no slug, save it to generate one
        if (!productDoc.slug && productDoc.title) {
            try {
                // The pre-save hook will generate the slug
                await productDoc.save();
                console.log(`Auto-generated slug for product ${productDoc._id}: ${productDoc.slug}`);
            } catch (optError) {
                console.error("Error auto-generating slug:", optError);
            }
        }

        // Convert to plain object for component
        const product = productDoc.toObject ? productDoc.toObject() : productDoc;

        // Populate category manually or via another query if needed, 
        // strictly speaking toObject() doesn't populate if not called on query.
        // Let's re-fetch populated to be clean, or populate the doc.
        await productDoc.populate('category', 'name slug');
        const populatedProduct = productDoc.toObject();

        return {
            ...populatedProduct,
            _id: populatedProduct._id.toString(),
            createdAt: populatedProduct.createdAt?.toISOString(),
            images: populatedProduct.images || [],
            variants: populatedProduct.variants || [],
            category: populatedProduct.category ? {
                // @ts-ignore
                name: populatedProduct.category.name,
                // @ts-ignore
                slug: populatedProduct.category.slug,
                // @ts-ignore
                _id: populatedProduct.category._id.toString()
            } : undefined,
            slug: populatedProduct.slug
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

    // Redirect legacy ID URLs to slug URLs
    // If user visited by ID (slug param is ID), and we have a valid slug now (product.slug), redirect.
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
