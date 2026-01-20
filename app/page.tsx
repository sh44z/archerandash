import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import NewsletterForm from './components/NewsletterForm';
import CategoryGrid from './components/CategoryGrid';
import Product from '@/models/Product';
import Category from '@/models/Category';
import dbConnect from '@/lib/db';
import Link from 'next/link';
import { normalizeDriveLink } from '@/lib/imageUtils';

// Force dynamic since we're fetching from DB to ensure fresh data
export const dynamic = 'force-dynamic';

async function getProducts() {
  await dbConnect();
  // Fetch products, sort by latest
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean(); // lean() for plain JS objects

  // Convert _id and dates to string for serialization
  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    variants: p.variants || [], // Ensure variants exist
    images: p.images || []
  })).filter(p => !p._id.startsWith('6961'));
}

async function getCategoriesWithImages() {
  await dbConnect();
  // Fetch all categories to include subcategories like "Canvas Prints"
  const categories = await Category.find({}).lean();

  const categoriesWithImages = await Promise.all(categories.map(async (cat: any) => {
    // Find a product in this category (checking both new 'categories' array and legacy 'category' field)
    const product = await Product.findOne({
      $or: [
        { categories: cat._id },
        { category: cat._id }
      ],
      images: { $exists: true, $not: { $size: 0 } }
    }).select('images').lean();

    let imageUrl = 'https://via.placeholder.com/400x400?text=No+Image';
    if (product && product.images && product.images.length > 0) {
      imageUrl = normalizeDriveLink(product.images[0]);
    }

    return {
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      imageUrl
    };
  }));

  return categoriesWithImages;
}

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategoriesWithImages();

  return (
    <div className="bg-white min-h-screen">
      <Hero products={products.slice(0, 5)} />

      {/* Category Grid Section */}
      <CategoryGrid categories={categories} />

      <div id="products" className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed font-light">
            Transform your space with our curated collection of diverse
            <span className="font-medium text-gray-900"> wall arts</span>,
            premium <span className="font-medium text-gray-900">posters</span>, and
            stunning <span className="font-medium text-gray-900">canvas prints</span>.
            Each piece is selected to bring character and modern elegance to your home.
          </p>
        </div>

        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 font-serif">Latest Arrivals</h2>
          <Link href="/shop" className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">Shop all collection<span aria-hidden="true"> &rarr;</span></Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              No products found. Check back soon!
            </div>
          ) : (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <Link href="/shop" className="font-medium text-indigo-600 hover:text-indigo-500">Shop all collection<span aria-hidden="true"> &rarr;</span></Link>
        </div>
      </div>

      {/* Newsletter / Footer */}
      <NewsletterForm />
    </div>
  );
}
