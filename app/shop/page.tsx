import ProductCard from '../components/ProductCard';
import Product from '@/models/Product';
import Category from '@/models/Category';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import mongoose from 'mongoose';

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
          <div className="space-y-4">
            {/* All Products Link */}
            <div>
              <Link
                href="/shop"
                className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${!categoryId
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All Products
              </Link>
            </div>

            {/* Parent Categories */}
            {parentCategories.map((parent) => {
              const children = childCategories.filter(c => c.parent === parent._id);

              return (
                <div key={parent._id} className="space-y-2">
                  <Link
                    href={`/shop?category=${parent._id}`}
                    className={`inline-block px-4 py-2 rounded-md text-sm font-medium transition-colors ${categoryId === parent._id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {parent.name}
                  </Link>

                  {/* Subcategories */}
                  {children.length > 0 && (
                    <div className="ml-6 flex flex-wrap gap-2">
                      {children.map((child) => (
                        <Link
                          key={child._id}
                          href={`/shop?subcategory=${child._id}`}
                          className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${categoryId === child._id
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
      alternates: {
        canonical: '/shop'
      }
    };
  }

  await dbConnect();
  const category = await Category.findById(categoryId).lean();

  if (!category) {
    return {
      title: "Shop | Archer and Ash",
      alternates: {
        canonical: '/shop'
      }
    };
  }

  const categoryName = category.name;
  const canonicalPath = params.subcategory
    ? `/shop?subcategory=${categoryId}`
    : `/shop?category=${categoryId}`;

  return {
    title: `${categoryName} | Archer and Ash`,
    description: `Shop our exclusive collection of ${categoryName} at Archer and Ash.`,
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title: `${categoryName} | Archer and Ash`,
      description: `Shop our exclusive collection of ${categoryName} at Archer and Ash.`,
    }
  };
}
