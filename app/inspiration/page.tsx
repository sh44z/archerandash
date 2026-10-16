import Link from 'next/link';
import Script from 'next/script';
import { Metadata } from 'next';
import { normalizeDriveLink } from '@/lib/imageUtils';
import { getStaticInspirationPosts } from '@/lib/inspirationData';

// Revalidate every 24 h — allows static generation at build time so
// Googlebot receives full HTML immediately, while still staying fresh.
export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Inspiration | Archer and Ash',
    description: 'Explore our latest articles, design tips, and inspiration for your home decor journey with Archer and Ash.',
    alternates: {
        canonical: 'https://www.archerandash.com/inspiration',
    },
};

export default async function InspirationPage() {
    const posts = getStaticInspirationPosts();

    const blogJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Archer and Ash — Inspiration',
        url: 'https://www.archerandash.com/inspiration',
        description: 'Design tips, wall art guides and home décor inspiration from Archer and Ash.',
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
        blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
                '@type': 'Organization',
                name: post.author,
            },
            url: `https://www.archerandash.com/inspiration/${post.slug || post._id}`,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.archerandash.com/inspiration/${post.slug || post._id}`,
            },
        })),
    };

    return (
        <div className="bg-white min-h-screen">
            {/* JSON-LD: Blog + BlogPosting list — rendered in initial HTML so Googlebot picks it up */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        Inspiration
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Ideas, stories, and design tips to help you create a space you love.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
                    {posts.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No articles found yet. Check back soon for inspiration!
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                                <div className="flex-shrink-0">
                                    <Link href={`/inspiration/${post.slug || post._id}`}>
                                        <img className="h-48 w-full object-cover" src={normalizeDriveLink(post.coverImage)} alt={post.title} />
                                    </Link>
                                </div>
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-600">
                                            Article
                                        </p>
                                        <Link href={`/inspiration/${post.slug || post._id}`} className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                            <p className="mt-3 text-base text-gray-500 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        </Link>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="flex-shrink-0">
                                            <span className="sr-only">{post.author}</span>
                                            {/* Placeholder avatar or just name */}
                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                {post.author ? post.author[0].toUpperCase() : 'A'}
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                {post.author}
                                            </p>
                                            <div className="flex space-x-1 text-sm text-gray-500">
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
                            </div>
                        ))
                    )}
                </div>

                <section className="mt-16">
                    <div id="soro-blog"></div>
                    <Script
                        id="soro-blog-script"
                        src="https://app.trysoro.com/api/embed/3d2963ca-2134-4b81-8ae6-0a98a48014a7"
                        strategy="afterInteractive"
                    />
                </section>
            </div>
        </div>
    );
}
