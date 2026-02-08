'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostForm from '../../components/BlogPostForm';
import { use } from 'react';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/blog/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch post');
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to load post');
                router.push('/hub?tab=inspiration');
            });
    }, [id, router]);

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch(`/api/blog/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/hub?tab=inspiration');
            } else {
                const error = await res.json();
                alert(`Failed to update post: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                </div>
                <BlogPostForm initialData={post} isEditing={true} onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
