import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import ProductDetails from '@/app/components/ProductDetails';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getProduct(id: string) {
    await dbConnect();

    try {
        const product = await Product.findById(id).lean();
        if (!product) return null;

        // Serialize for client component
        return {
            ...product,
            _id: product._id.toString(),
            createdAt: product.createdAt?.toISOString(),
            images: product.images || [],
            variants: product.variants || [],
            category: product.category ? product.category.toString() : undefined
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
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
            {/* @ts-ignore */}
            <ProductDetails product={product} />
        </div>
    );
}

export async function generateMetadata({ params }: PageProps): Promise<import("next").Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

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
        openGraph: {
            title: product.title,
            description: product.description?.substring(0, 200),
            images: mainImage ? [{ url: mainImage }] : [],
            type: 'article' // or 'product' context
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description?.substring(0, 200),
            images: mainImage ? [mainImage] : [],
        }
    };
}
