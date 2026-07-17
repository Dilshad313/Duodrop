// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/products";

type ProductsResponse = {
  products: {
    edges: Array<{ node: ProductNode }>;
  };
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: ProductNode[] = [];
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<ProductsResponse>({
        query: GET_ALL_PRODUCTS,
        variables: { first: 12 },
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

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/60 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-14 lg:py-20">
                <span className="mb-5 inline-flex w-fit items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                  New Arrival
                </span>
                <h1 className="max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight text-slate-950">
                  Step Into Comfort,<br />
                  Step Into <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Style</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                  Discover premium Shopify-powered bundles with elegant product customization, polished cards, and seamless checkout.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#products"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-indigo-600"
                  >
                    Shop Now →
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-950"
                  >
                    Explore Collection
                  </Link>
                </div>
              </div>

              <div className="relative flex min-h-[280px] items-center justify-center bg-gradient-to-br from-indigo-50/80 to-slate-100/50 p-8">
                {products[0]?.images.edges[0] ? (
                  <img
                    src={products[0].images.edges[0].node.url}
                    alt={products[0].title}
                    className="max-h-[320px] w-full max-w-[480px] object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.15)]"
                  />
                ) : (
                  <div className="text-center text-slate-500">Connect Shopify to see hero product</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="products" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Our Collection
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Premium products curated for you</p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              View All
            </Link>
          </div>

          {loadError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900 shadow-sm">
              Could not load products. Please verify your Shopify environment variables.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${encodeURIComponent(product.id)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
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
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Truck", "Free Shipping", "On orders above ₹999"],
              ["RefreshCw", "Easy Returns", "Hassle-free returns"],
              ["Lock", "Secure Payment", "100% secure payment"],
              ["Headphones", "24/7 Support", "Dedicated support"],
            ].map(([icon, title, copy]) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl border border-white/70 bg-white/80 p-5 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="mb-2 text-2xl text-indigo-600">✦</div>
                <h3 className="text-base font-black text-slate-950">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}