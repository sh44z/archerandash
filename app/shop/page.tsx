import ProductCard from '../components/ProductCard';
import Product from '@/models/Product';
import Category from '@/models/Category';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import mongoose from 'mongoose';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProducts(categoryId?: string) {
  await dbConnect();

  let query: any = {};
  if (categoryId) {
    // Convert string to ObjectId if needed
    try {
      const objectId = new mongoose.Types.ObjectId(categoryId);
      query.categories = { $in: [objectId] };
    } catch {
      query.categories = { $in: [] };
    }
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    variants: p.variants || [],
    images: p.images || [],
    categories: (p.categories || []).map((c: any) => c.toString()),
    category: p.category ? p.category.toString() : (p.categories && p.categories[0] ? p.categories[0].toString() : undefined)
  }));
}

async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return categories.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    parent: c.parent ? c.parent.toString() : null
  }));
}

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>
}) {
  const params = await searchParams;
  const categoryId = params.category || params.subcategory;

  const [products, categories] = await Promise.all([
    getProducts(categoryId),
    getCategories()
  ]);

  // Organize categories into parent/child structure
  const parentCategories = categories.filter(c => !c.parent);
  const childCategories = categories.filter(c => c.parent);

  // Find active parent category ID
  let activeParentId: string | null = null;
  if (categoryId) {
    const selectedCat = categories.find(c => c._id === categoryId);
    if (selectedCat) {
      activeParentId = selectedCat.parent ? selectedCat.parent : selectedCat._id;
    }
  }

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c._id === id);
    return cat?.name || 'All Products';
  };

  const selectedCategoryName = categoryId ? getCategoryName(categoryId) : 'All Products';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-serif mb-6">
            {selectedCategoryName}
          </h1>

          {/* Category Navigation */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 mb-6">
            {/* Parent Categories Horizontal scroll list */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mb-2 no-scrollbar">
              <Link
                href="/shop"
                className={`inline-block px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm border whitespace-nowrap ${
                  !categoryId
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                All Products
              </Link>

              {parentCategories.map((parent) => (
                <Link
                  key={parent._id}
                  href={`/shop?category=${parent._id}`}
                  className={`inline-block px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm border whitespace-nowrap ${
                    activeParentId === parent._id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {parent.name}
                </Link>
              ))}
            </div>

            {/* Subcategories Horizontal Scroll Container */}
            {activeParentId && (
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100/60 pb-1 no-scrollbar animate-fadeIn">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 whitespace-nowrap">
                  Refine:
                </span>
                {childCategories
                  .filter((c) => c.parent === activeParentId)
                  .map((child) => (
                    <Link
                      key={child._id}
                      href={`/shop?subcategory=${child._id}`}
                      className={`inline-block px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border whitespace-nowrap ${
                        categoryId === child._id
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold shadow-sm shadow-indigo-50/50'
                          : 'bg-gray-50/50 text-gray-600 border-gray-100 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found in this category. Check back soon!
            </div>
          ) : (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ category?: string; subcategory?: string }>
}): Promise<import("next").Metadata> {
  const params = await searchParams;
  const categoryId = params.category || params.subcategory;

  if (!categoryId) {
    return {
      title: "Shop All Products | Archer and Ash",
      description: "Browse our complete collection of modern wall art and canvas prints.",
      viewport: {
        width: 'device-width',
        initialScale: 1,
        minimumScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
      alternates: {
        canonical: 'https://www.archerandash.com/shop'
      }
    };
  }

  await dbConnect();
  const category = await Category.findById(categoryId).lean();

  if (!category) {
    return {
      title: "Shop | Archer and Ash",
      viewport: {
        width: 'device-width',
        initialScale: 1,
        minimumScale: 1,
        maximumScale: 5,
        userScalable: true,
      },
      alternates: {
        canonical: 'https://www.archerandash.com/shop'
      }
    };
  }

  const categoryName = category.name;
  const canonicalUrl = params.subcategory
    ? `https://www.archerandash.com/shop?subcategory=${categoryId}`
    : `https://www.archerandash.com/shop?category=${categoryId}`;

  return {
    title: `${categoryName} | Archer and Ash`,
    description: `Shop our exclusive collection of ${categoryName} at Archer and Ash.`,
    viewport: {
      width: 'device-width',
      initialScale: 1,
      minimumScale: 1,
      maximumScale: 5,
      userScalable: true,
    },
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: `${categoryName} | Archer and Ash`,
      description: `Shop our exclusive collection of ${categoryName} at Archer and Ash.`,
    }
  };
}




