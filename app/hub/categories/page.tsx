'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
    _id: string;
    name: string;
    slug: string;
    parent: string | null;
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedParent, setSelectedParent] = useState<string>(''); // For adding subcategory

    // Edit state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newCategoryName,
                    parentId: selectedParent || null
                }),
            });
            const data = await res.json();
            if (data.success) {
                setNewCategoryName('');
                setSelectedParent('');
                fetchCategories();
                router.refresh();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Failed to add category');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

        try {
            const res = await fetch(`/api/categories?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchCategories();
                router.refresh();
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting category');
        }
    };

    const startEditing = (category: Category) => {
        setEditingCategory(category);
        setEditName(category.name);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditName('');
    };

    const saveEdit = async () => {
        if (!editingCategory || !editName.trim()) return;

        try {
            const res = await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingCategory._id,
                    name: editName
                }),
            });
            const data = await res.json();
            if (data.success) {
                setEditingCategory(null);
                setEditName('');
                fetchCategories();
                router.refresh();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Failed to update category');
        }
    };

    // Organize categories into hierarchy
    const topLevelCategories = categories.filter(c => !c.parent);
    const getSubcategories = (parentId: string) => categories.filter(c => c.parent === parentId);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
                    <button onClick={() => router.push('/hub')} className="text-sm sm:text-base text-indigo-600 hover:text-indigo-800 whitespace-nowrap">Back to Hub</button>
                </div>

                {/* Add Category Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-medium mb-4">Add New Category</h2>
                    <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-grow w-full sm:w-auto">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g. Prints, Frames"
                            />
                        </div>
                        <div className="w-full sm:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
                            <select
                                value={selectedParent}
                                onChange={e => setSelectedParent(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">None (Top Level)</option>
                                {topLevelCategories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap">Add</button>
                    </form>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium">Existing Categories</h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {topLevelCategories.length === 0 && (
                            <li className="px-6 py-4 text-gray-500 text-center">No categories found.</li>
                        )}
                        {topLevelCategories.map(cat => (
                            <li key={cat._id} className="px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {editingCategory?._id === cat._id ? (
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                            />
                                        ) : (
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                        )}
                                        <span className="text-gray-400 text-xs bg-gray-100 px-2 py-1 rounded">Slug: {cat.slug}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {editingCategory?._id === cat._id ? (
                                            <>
                                                <button onClick={saveEdit} className="text-sm text-green-600 hover:text-green-800">Save</button>
                                                <button onClick={cancelEditing} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(cat)} className="text-sm text-indigo-600 hover:text-indigo-800">Edit</button>
                                                <button onClick={() => handleDelete(cat._id, cat.name)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Subcategories */}
                                <ul className="mt-2 ml-6 border-l-2 border-gray-100 pl-4 space-y-2">
                                    {getSubcategories(cat._id).map(sub => (
                                        <li key={sub._id} className="text-sm text-gray-600 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {editingCategory?._id === sub._id ? (
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={e => setEditName(e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                    />
                                                ) : (
                                                    <span>{sub.name}</span>
                                                )}
                                                <span className="text-xs text-gray-400">Slug: {sub.slug}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {editingCategory?._id === sub._id ? (
                                                    <>
                                                        <button onClick={saveEdit} className="text-xs text-green-600 hover:text-green-800">Save</button>
                                                        <button onClick={cancelEditing} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => startEditing(sub)} className="text-xs text-indigo-600 hover:text-indigo-800">Edit</button>
                                                        <button onClick={() => handleDelete(sub._id, sub.name)} className="text-xs text-red-600 hover:text-red-800">Delete</button>
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                    {getSubcategories(cat._id).length === 0 && (
                                        <li className="text-xs text-gray-400 italic">No subcategories</li>
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
