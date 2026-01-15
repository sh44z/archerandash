import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { normalizeDriveLink } from '@/lib/imageUtils';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();

        const baseUrl = 'https://www.archerandash.com';
        // Trim whitespace to ensure it starts with <?xml
        const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Archer and Ash Products</title>
<link>${baseUrl}</link>
<description>Modern Canvas Art &amp; Wall Decor</description>`;

        const xmlFooter = `
</channel>
</rss>`;

        const items = products.map((product: any) => {
            // Calculate price (use lowest variant price or legacy price)
            let price = 0;
            if (product.variants && product.variants.length > 0) {
                price = Math.min(...product.variants.map((v: any) => v.price));
            } else if (product.price) {
                price = product.price;
            }

            // Skip if no price (shouldn't happen for valid products)
            if (!price) return '';

            // Get main image
            const imageLink = product.images && product.images.length > 0
                ? normalizeDriveLink(product.images[0])
                : '';

            if (!imageLink) return ''; // Google requires an image

            return `
<item>
<g:id>${product._id}</g:id>
<g:title><![CDATA[${product.title}]]></g:title>
<g:description><![CDATA[${product.description}]]></g:description>
<g:link>${baseUrl}/product/${product._id}</g:link>
<g:image_link>${imageLink}</g:image_link>
<g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${price.toFixed(2)} GBP</g:price>
<g:brand>Archer and Ash</g:brand>
<g:identifier_exists>no</g:identifier_exists>
<g:item_group_id>${product._id}</g:item_group_id>
<g:google_product_category>500044</g:google_product_category> 
</item>`;
        }).join('');

        const xmlContent = (xmlHeader + items + xmlFooter).trim();

        return new NextResponse(xmlContent, {
            headers: {
                'Content-Type': 'application/rss+xml; charset=utf-8',
                'Cache-Control': 's-maxage=3600, stale-while-revalidate',
            },
        });

    } catch (error) {
        console.error('Error generating feed:', error);
        // Return JSON on error so we can debug, or simple text.
        return new NextResponse(JSON.stringify({ error: 'Failed to generate feed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
