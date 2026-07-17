// app/page.tsx (Server Component)
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

export default async function HomePage() {
  // Shopify-ൽ നിന്ന് ലൈവായി പ്രോഡക്റ്റുകൾ എടുക്കുന്നു
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-white to-slate-50 pt-20 pb-16 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            🚀 Live Shopify Bundles Active
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
            Build Perfect Combos, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Save Massive Money.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Select a live Shopify combo pack below to unlock variant level customizations and direct checkout discounts.
          </p>
        </div>
      </section>

      {/* BUNDLES GRID */}
      <section id="bundles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link 
              href={`/products/${encodeURIComponent(product.id)}`} 
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {product.images.edges.length > 0 && (
                  <img 
                    src={product.images.edges[0].node.url} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-950 tracking-wide border border-slate-100">
                  {product.variants.edges.length} VARIANTS AVAILABLE
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed line-clamp-2 flex-grow">
                  {product.description}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                    </span>
                  </div>
                  <span className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                    Configure Combo
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid gap-8 grid-cols-1 md:grid-cols-3">
          <div className="space-y-4">
            <span className="text-lg font-black tracking-tight text-slate-900">COMBO<span className="text-indigo-600">.STORE</span></span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Live Shopify pipeline syncing variants into flexible line-item checkouts.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Integrations</h4>
            <ul className="text-xs space-y-2 text-slate-500 font-medium">
              <li>Shopify GraphQL Storefront</li>
              <li>Next.js App Router 16</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Support</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Fully optimized server and client pipeline orchestration.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[11px] font-medium text-slate-400">© 2026 Combo.Store. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}