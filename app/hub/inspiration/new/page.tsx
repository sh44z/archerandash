'use client';

import { useRouter } from 'next/navigation';
import BlogPostForm from '../../components/BlogPostForm';

export default function NewBlogPostPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/hub?tab=inspiration');
            } else {
                const error = await res.json();
                alert(`Failed to create post: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New Blog Post</h1>
                </div>
                <BlogPostForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
