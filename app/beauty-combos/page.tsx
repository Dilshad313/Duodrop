// app/beauty-combos/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GET_COLLECTION_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/products";

type CollectionResponse = {
  collectionByHandle: {
    id: string;
    title: string;
    handle: string;
    description: string;
    products: {
      edges: Array<{ node: ProductNode }>;
    };
  } | null;
};

export default async function BeautyCombosPage() {
  let products: ProductNode[] = [];
  let collectionTitle = "Beauty Combos";
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<CollectionResponse>({
        query: GET_COLLECTION_PRODUCTS,
        variables: { handle: "beauty-combos", first: 50 },
      });

      if (data.collectionByHandle) {
        collectionTitle = data.collectionByHandle.title;
        products = data.collectionByHandle.products.edges.map((edge) => edge.node);
      } else {
        loadError = true;
      }
    } catch (error) {
      console.error("Failed to fetch beauty combos collection:", error);
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950">{collectionTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{products.length} products</p>
        </div>
        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900">
            Unable to load collection. Please make sure a collection with handle "beauty-combos" exists.
          </div>
        )}
        {products.length === 0 && !loadError && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
            <p className="text-slate-500">No products found in this collection.</p>
          </div>
        )}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-600">★ 4.8</span>
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-sm text-white transition group-hover:bg-indigo-600">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}