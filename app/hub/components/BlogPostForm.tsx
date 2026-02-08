'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BlogPostFormProps {
    initialData?: {
        title: string;
        slug: string;
        excerpt: string;
        content: string;
        coverImage: string;
        status: 'draft' | 'published';
    };
    isEditing?: boolean;
    onSubmit: (data: any) => Promise<void>;
}

export default function BlogPostForm({ initialData, isEditing = false, onSubmit }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        coverImage: initialData?.coverImage || '',
        status: initialData?.status || 'published',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (Optional)</label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="auto-generated-from-title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                </div>

                <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
                    <input
                        type="text"
                        name="coverImage"
                        id="coverImage"
                        required
                        value={formData.coverImage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    {formData.coverImage && (
                        <div className="mt-2">
                            <img src={formData.coverImage} alt="Preview" className="h-40 w-auto object-cover rounded" />
                        </div>
                    )}
                </div>

                <div className="col-span-2">
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                        name="excerpt"
                        id="excerpt"
                        rows={3}
                        required
                        value={formData.excerpt}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                    <p className="mt-1 text-sm text-gray-500">Brief summary displayed on the blog list.</p>
                </div>

                <div className="col-span-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content (HTML supported)</label>
                    <textarea
                        name="content"
                        id="content"
                        rows={15}
                        required
                        value={formData.content}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border font-mono"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Link href="/hub" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}
