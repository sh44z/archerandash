import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.archerandash.com';

    await dbConnect();

    // Get all products and categories
    const products = await Product.find({}).select('_id slug updatedAt createdAt').lean();
    const categories = await Category.find({}).select('slug updatedAt createdAt').lean();

    const productEntries: MetadataRoute.Sitemap = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.slug || product._id.toString()}`,
        lastModified: product.updatedAt || product.createdAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
        url: `${baseUrl}/collections/${category.slug}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/collections`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shop`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/shipping`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/refunds`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...categoryEntries,
        ...productEntries,
    ];
}
