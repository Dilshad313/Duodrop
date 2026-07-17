import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";

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
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<ProductsResponse>({
        query: GET_ALL_PRODUCTS,
        variables: { first: 20 },
      });
      products = data.products.edges.map((edge) => edge.node);
    } catch (error) {
      console.error("Failed to fetch Shopify products:", error);
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2.2rem] border border-white/70 bg-white/75 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                Premium catalog
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Explore All Products</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Browse responsive, premium product cards connected to your live Shopify catalog with elegant spacing, polished presentation, and direct detail-page navigation.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white shadow-lg">
              {products.length} items available
            </div>
          </div>
        </section>

        {loadError ? (
          <div className="mt-8 rounded-[1.8rem] border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-900 shadow-sm">
            Shopify data is unavailable right now. Please confirm your storefront environment variables.
          </div>
        ) : null}

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${encodeURIComponent(product.id)}`}
              className="group flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.14)]"
            >
              <div className="mb-4 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#fbfdff_0%,#edf3ff_100%)] p-4">
                {product.images.edges[0] ? (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    className="aspect-square w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid aspect-square place-items-center text-slate-400">No image</div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="line-clamp-1 text-lg font-black text-slate-950 transition group-hover:text-indigo-600">
                    {product.title}
                  </h2>
                  <span className="text-slate-300">♡</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <div className="text-2xl font-black text-slate-950">
                      ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-amber-600">★ {(4.4 + (index % 5) * 0.1).toFixed(1)} rating</div>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition group-hover:bg-indigo-600">
                    View Pack
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
