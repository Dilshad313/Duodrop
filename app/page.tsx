// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/products";
import { Truck, RefreshCw, Lock, Headphones } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Hero Section – Fixed for proper display */}
        <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/header.png"
              alt="Hero background"
              fill
              className="object-cover object-center brightness-110 contrast-105"
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a33]/80 via-[#0b1a33]/30 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-5">
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)] sm:text-5xl lg:text-6xl">
                Discover Your <br />
                <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(79,70,229,0.3)]">
                  Beauty
                </span>{" "}
                Essentials
              </h1>
              <p className="max-w-xl text-lg text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-xl">
                Premium beauty tools and combos curated for your everyday routine.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="#products"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)]"
                >
                  Shop Now
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/beauty-tools"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white/20 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/30"
                >
                  Explore Tools
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section id="products" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Featured Collection
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Handpicked favorites for you</p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              View All
            </Link>
          </div>

          {loadError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900">
              Could not load products. Please check your Shopify configuration.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          </div>
        </section>

        {/* Trust Badges */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Truck, title: "Free Shipping", copy: "On orders above ₹999" },
              { icon: RefreshCw, title: "Easy Returns", copy: "Hassle-free returns" },
              { icon: Lock, title: "Secure Payment", copy: "100% secure payment" },
              { icon: Headphones, title: "24/7 Support", copy: "Dedicated support" },
            ].map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="flex flex-col items-center rounded-2xl border border-white/70 bg-white/80 p-5 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <Icon className="mb-2 h-6 w-6 text-indigo-600" strokeWidth={1.5} />
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