
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await dbConnect();
        // Fetch published posts sorted by newest first
        const posts = await BlogPost.find({})
            .sort({ publishedAt: -1, createdAt: -1 });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const user = token ? await verifyToken(token) : null;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Basic validation
        if (!data.title || !data.content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const newPost = await BlogPost.create({
            title: data.title,
            slug: data.slug, // Model will auto-generate if missing
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            status: data.status || 'published',
            author: user.email || 'Admin', // Use email or a default
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: any) {
        console.error('Error creating blog post:', error);
        // Check for duplicate slug error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A post with this slug already exists. Please choose a different title or slug.' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create blog post' },
            { status: 500 }
        );
    }
}
