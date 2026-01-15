import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.archerandash.com'; // TODO: Update with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/hub/'], // Disallow API and Admin Hub
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
