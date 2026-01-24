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

// Helper to safely get product
async function getProduct(term: string) {
    await dbConnect();

    try {
        let productDoc = null;
        const isId = mongoose.Types.ObjectId.isValid(term);

        if (isId) {
            // Try ID first
            productDoc = await Product.findById(term);
        }

        // If not found by ID, try slug
        if (!productDoc) {
            productDoc = await Product.findOne({ slug: term });
        }

        if (!productDoc) return null;

        // Self-healing: If ID lookup succeeded but no slug, save to generate one
        if (!productDoc.slug && productDoc.title) {
            try {
                await productDoc.save();
                console.log(`Auto-generated slug for product ${productDoc._id}`);
            } catch (e) {
                console.error("Error auto-generating slug:", e);
            }
        }

        // Populate category
        await productDoc.populate('category', 'name slug');

        // Use JSON serialization to ensure clean object for Next.js props
        const populatedProduct = JSON.parse(JSON.stringify(productDoc));

        return {
            ...populatedProduct,
            _id: populatedProduct._id.toString(),
            createdAt: populatedProduct.createdAt ? new Date(populatedProduct.createdAt).toISOString() : null,
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

    // Redirect legacy ID URLs to slug URLs if slug exists
    if (mongoose.Types.ObjectId.isValid(slug) && product.slug && slug !== product.slug) {
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
