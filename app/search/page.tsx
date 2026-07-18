// app/search/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SEARCH_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/product";

type SearchResponse = {
  products: {
    edges: Array<{ node: ProductNode }>;
  };
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  if (!query) {
    redirect("/products");
  }

  let products: ProductNode[] = [];
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<SearchResponse>({
        query: SEARCH_PRODUCTS,
        variables: { query, first: 20 },
      });
      products = data.products.edges.map((edge) => edge.node);
    } catch (error) {
      console.error("Search failed:", error);
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Results for "{query}"
        </h1>
        <p className="mt-2 text-sm text-slate-500">{products.length} products found</p>

        {loadError && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900">
            Search unavailable. Please try again later.
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${encodeURIComponent(product.id)}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
            >
              <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-indigo-50/50 p-4">
                {product.images.edges[0] ? (
                  <img
                    src={product.images.edges[0].node.url}
                    alt={product.title}
                    className="aspect-square w-full object-contain transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-square grid place-items-center text-slate-400">No image</div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="line-clamp-1 text-base font-bold text-slate-950">{product.title}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-950">
                    ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ₹{Math.round(Number(product.priceRange.minVariantPrice.amount) * 1.25).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-600">★ 4.8 (245)</span>
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-sm text-white transition group-hover:bg-indigo-600">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {products.length === 0 && !loadError && (
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-slate-600">No products found matching your search.</p>
            <Link href="/products" className="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white">
              Browse All Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}