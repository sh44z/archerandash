import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

const baseUrl = 'https://www.archerandash.com';

interface SitemapProduct {
    _id: string;
    slug?: string;
    updatedAt?: string | Date;
    createdAt?: string | Date;
}

interface SitemapCategory {
    slug: string;
    updatedAt?: string | Date;
    createdAt?: string | Date;
}

async function loadProductEntries(): Promise<MetadataRoute.Sitemap> {
    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI not set; sitemap will include only core pages.');
        return [];
    }

    try {
        await dbConnect();
        const products = await Product.find({}).select('_id slug updatedAt createdAt').lean<SitemapProduct[]>();

        return products.map((product) => ({
            url: `${baseUrl}/product/${product.slug || product._id.toString()}`,
            lastModified: product.updatedAt || product.createdAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Failed to load product sitemap entries:', error);
        return [];
    }
}

async function loadCategoryEntries(): Promise<MetadataRoute.Sitemap> {
    if (!process.env.MONGODB_URI) {
        return [];
    }

    try {
        await dbConnect();
        const categories = await Category.find({}).select('slug updatedAt createdAt').lean<SitemapCategory[]>();

        return categories.map((category) => ({
            url: `${baseUrl}/collections/${category.slug}`,
            lastModified: category.updatedAt || category.createdAt || new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Failed to load category sitemap entries:', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [productEntries, categoryEntries] = await Promise.all([
        loadProductEntries(),
        loadCategoryEntries(),
    ]);

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
