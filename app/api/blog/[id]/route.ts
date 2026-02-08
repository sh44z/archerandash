
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();
        const id = params.id;

        // Try to find by ID first, then by slug
        let post;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            post = await BlogPost.findById(id);
        }

        if (!post) {
            post = await BlogPost.findOne({ slug: id });
        }

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog post' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();

        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const user = token ? await verifyToken(token) : null;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const data = await request.json();

        const updatedPost = await BlogPost.findByIdAndUpdate(
            id,
            {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                coverImage: data.coverImage,
                status: data.status,
                // Don't update createdAt or author usually
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedPost);
    } catch (error: any) {
        console.error('Error updating blog post:', error);
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A post with this slug already exists.' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update blog post' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await dbConnect();

        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const user = token ? await verifyToken(token) : null;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;
        const deletedPost = await BlogPost.findByIdAndDelete(id);

        if (!deletedPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog post' },
            { status: 500 }
        );
    }
}
