import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { Metadata } from 'next';

// Force dynamic rendering to ensure fresh content
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
    await dbConnect();
    // Try finding by slug first, then by ID as a fallback
    let post = await BlogPost.findOne({ slug, status: 'published' }).lean();

    if (!post && slug.match(/^[0-9a-fA-F]{24}$/)) {
        post = await BlogPost.findOne({ _id: slug, status: 'published' }).lean();
    }

    if (!post) return null;

    return {
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt?.toISOString(),
        publishedAt: post.publishedAt?.toISOString(),
        updatedAt: post.updatedAt?.toISOString(),
    };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const post = await getBlogPost(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Archer and Ash`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author],
        },
    };
}

export default async function BlogPostPage(props: PageProps) {
    const params = await props.params;
    const post = await getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen">
            {/* Hero Image */}
            <div className="w-full h-64 md:h-96 relative">
                <img
                    src={post.coverImage}
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
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
