import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { normalizeDriveLink } from '@/lib/imageUtils';
import { getStaticInspirationPostBySlug, getStaticInspirationPosts } from '@/lib/inspirationData';

// Pre-render all known blog post slugs at build time so Googlebot sees full HTML
export async function generateStaticParams() {
    const posts = getStaticInspirationPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

// Allow ISR — revalidate every 24 h in case content changes
export const revalidate = 86400;

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getBlogPost(slug: string) {
    return getStaticInspirationPostBySlug(slug);
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const post = getBlogPost(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Archer and Ash`,
        description: post.excerpt,
        alternates: {
            canonical: `https://www.archerandash.com/inspiration/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [normalizeDriveLink(post.coverImage || '')],
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author],
        },
    };
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params;
    const post = getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    // Process HTML content to normalize any Google Drive image links
    const contentWithNormalizedImages = post.content
        ? post.content.replace(/<img(.*?)src=["'](.*?)['"]/gi, (match: string, prefix: string, src: string) => {
            return `<img${prefix}src="${normalizeDriveLink(src)}"`;
        })
        : '';

    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: normalizeDriveLink(post.coverImage),
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
            '@type': 'Organization',
            name: post.author,
            url: 'https://www.archerandash.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Archer And Ash UK',
            url: 'https://www.archerandash.com',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '216-220 Blackfriars Road',
                addressLocality: 'London',
                postalCode: 'SE1 0XL',
                addressCountry: 'GB',
            },
        },
        url: `https://www.archerandash.com/inspiration/${post.slug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.archerandash.com/inspiration/${post.slug}`,
        },
        isPartOf: {
            '@type': 'Blog',
            '@id': 'https://www.archerandash.com/inspiration',
            name: 'Archer and Ash — Inspiration',
        },
    };

    return (
        <article className="bg-white min-h-screen">
            {/* JSON-LD: BlogPosting structured data — rendered server-side so Googlebot reads it */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            {/* Hero Image */}
            <div className="w-full h-64 md:h-96 relative">
                <img
                    src={normalizeDriveLink(post.coverImage)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-bold text-white font-serif mb-4 drop-shadow-md">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center space-x-4 text-white text-sm md:text-base font-medium drop-shadow-sm">
                            <span>{post.author}</span>
                            <span>•</span>
                            <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Navigation Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/inspiration" className="hover:text-gray-900 transition-colors">Inspiration</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{post.title}</span>
                </nav>

                <div className="prose prose-lg prose-indigo mx-auto text-gray-700">
                    <div dangerouslySetInnerHTML={{ __html: contentWithNormalizedImages }} />
                </div>

                <div className="mt-16 border-t border-gray-200 pt-8">
                    <Link
                        href="/inspiration"
                        className="text-indigo-600 font-medium hover:text-indigo-500 flex items-center"
                    >
                        ← Back to Inspiration
                    </Link>
                </div>
            </div>
        </article>
    );
}
