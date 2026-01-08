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
            {/* @ts-ignore */}
            <ProductDetails product={product} />
        </div>
    );
}
