import { notFound, permanentRedirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductDetails from '@/app/components/ProductDetails';
import mongoose from 'mongoose';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ProductCard from '@/app/components/ProductCard';

interface ProductVariant {
    size: string;
    price: number;
}

interface ProductData {
    _id: string;
    title: string;
    description: string;
    images: string[];
    variants: ProductVariant[];
    slug?: string;
    category?: {
        _id: string;
        name: string;
        slug: string;
    };
    categories?: {
        _id: string;
        name: string;
        slug: string;
    }[];
    createdAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Helper to safely get product
async function getProduct(term: string): Promise<ProductData | null> {
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
        await productDoc.populate('categories', 'name slug');

        // Use JSON serialization to ensure clean object for Next.js props
        const populatedProduct = JSON.parse(JSON.stringify(productDoc)) as ProductData & {
            category?: {
                _id?: string;
                name: string;
                slug: string;
            };
            categories?: {
                _id?: string;
                name: string;
                slug: string;
            }[];
        };

        return {
            ...populatedProduct,
            _id: populatedProduct._id.toString(),
            createdAt: populatedProduct.createdAt ? new Date(populatedProduct.createdAt).toISOString() : undefined,
            images: populatedProduct.images || [],
            variants: populatedProduct.variants || [],
            category: populatedProduct.category ? {
                name: populatedProduct.category.name,
                slug: populatedProduct.category.slug,
                _id: populatedProduct.category._id?.toString() || ''
            } : undefined,
            categories: populatedProduct.categories?.map(c => ({
                name: c.name,
                slug: c.slug,
                _id: c._id?.toString() || ''
            })) || [],
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
        breadcrumbItems.push({ label: product.category.name, href: `/collections/${product.category.slug}` });
    }

    breadcrumbItems.push({ label: product.title, href: `/product/${product.slug || product._id}` });

    const unframedVariants = product.variants?.filter((variant: ProductVariant) => /unframed/i.test(variant.size)) || [];
    const offerVariants: ProductVariant[] = unframedVariants.length > 0 ? unframedVariants : product.variants || [];
    const lowPrice = offerVariants.length > 0 ? Math.min(...offerVariants.map((v: ProductVariant) => v.price)) : 0;
    const highPrice = offerVariants.length > 0 ? Math.max(...offerVariants.map((v: ProductVariant) => v.price)) : lowPrice;
    const offerCount = offerVariants.length || 1;
    const productUrl = `https://www.archerandash.com/product/${product.slug || product._id}`;

    // Fetch related products
    let relatedProducts: any[] = [];
    const categoryIds = product.categories?.map((c: any) => c._id) || [];
    if (product.category?._id && !categoryIds.includes(product.category._id)) {
        categoryIds.push(product.category._id);
    }

    if (categoryIds.length > 0) {
        try {
            await dbConnect();
            const relatedDocs = await Product.find({
                $or: [
                    { category: { $in: categoryIds } },
                    { categories: { $in: categoryIds } }
                ],
                _id: { $ne: product._id }
            })
            .limit(4)
            .lean();

            relatedProducts = JSON.parse(JSON.stringify(relatedDocs)).map((doc: any) => ({
                ...doc,
                _id: doc._id.toString(),
                category: doc.category?.toString()
            }));
        } catch (error) {
            console.error("Error fetching related products:", error);
        }
    }

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
                        url: productUrl,
                        sku: product._id,
                        brand: {
                            "@type": "Brand",
                            name: "Archer and Ash"
                        },
                        offers: {
                            "@type": "AggregateOffer",
                            priceCurrency: "GBP",
                            lowPrice,
                            highPrice,
                            offerCount,
                            availability: "https://schema.org/InStock"
                        }
                    })
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumbs items={breadcrumbItems} />
            </div>
            <ProductDetails product={product} />

            {/* You May Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 mt-12">
                    <h2 className="text-2xl font-serif text-gray-900 mb-8 text-center uppercase tracking-wider">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCard key={relatedProduct._id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
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
    const normalizedImage = mainImage ? (mainImage.startsWith('http') ? mainImage : `https://www.archerandash.com${mainImage}`) : "https://www.archerandash.com/images/logo.jpg";
    const productUrl = `https://www.archerandash.com/product/${product.slug || product._id}`;

    return {
        title: product.metaTitle || product.title,
        description: (product.metaDescription || product.description)?.substring(0, 160) || `Buy ${product.title} at Archer and Ash`,
        keywords: product.keywords ? product.keywords.split(',').map((k: string) => k.trim()) : undefined,
        viewport: {
            width: 'device-width',
            initialScale: 1,
            minimumScale: 1,
            maximumScale: 5,
            userScalable: true,
        },
        alternates: {
            canonical: productUrl
        },
        openGraph: {
            title: product.metaTitle || product.title,
            description: (product.metaDescription || product.description)?.substring(0, 200),
            images: normalizedImage ? [{ url: normalizedImage, width: 1200, height: 900 }] : [],
            type: 'article',
            url: productUrl,
        },
        twitter: {
            card: 'summary_large_image',
            title: product.metaTitle || product.title,
            description: (product.metaDescription || product.description)?.substring(0, 200),
            images: normalizedImage ? [normalizedImage] : [],
        }
    };
}
