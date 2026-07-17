// app/products/page.tsx (Server Component)
import { shopifyFetch } from '@/lib/shopify';
import { GET_ALL_PRODUCTS } from '@/lib/queries';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

type ProductNode = {
  id: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{
      node: { url: string; altText: string | null };
    }>;
  };
  variants: {
    edges: Array<{
      node: { id: string; title: string; price: { amount: string } };
    }>;
  };
};

type ProductsResponse = {
  products: {
    edges: Array<{ node: ProductNode }>;
  };
};

export default async function ProductsPage() {
  let products: ProductNode[] = [];
  try {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_ALL_PRODUCTS,
      variables: { first: 20 },
    });
    products = data.products.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Failed to fetch Shopify products:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 w-full flex-grow">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Shopify Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${encodeURIComponent(product.id)}`}>
              <div className="bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl transition flex flex-col h-full group">
                {product.images.edges.length > 0 && (
                  <div className="overflow-hidden rounded-2xl aspect-video bg-slate-100 mb-4">
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{product.title}</h2>
                <p className="text-slate-500 text-sm mt-2 flex-grow line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-slate-900">
                    ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                  </span>
                  <span className="bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-indigo-600 transition-colors">
                    View Pack
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}