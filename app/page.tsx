import Link from "next/link";
import Navbar from "@/components/Navbar";
import { GET_ALL_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";

type ProductNode = {
  id: string;
  title: string;
  handle?: string;
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

export const dynamic = "force-dynamic";

function getRating(index: number) {
  return (4.5 + ((index % 4) * 0.1)).toFixed(1);
}

export default async function HomePage() {
  let products: ProductNode[] = [];
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<ProductsResponse>({
        query: GET_ALL_PRODUCTS,
        variables: { first: 10 },
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
    <div className="min-h-screen text-slate-900">
      <Navbar />

      <main className="pb-16">
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="grid overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/65 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
              <span className="mb-5 inline-flex w-fit items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                New Arrival
              </span>
              <h1 className="max-w-2xl text-[clamp(2.7rem,6vw,5rem)] font-black leading-[0.98] tracking-tight text-slate-950">
                Step Into Comfort,
                <br />
                Step Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Style</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Discover premium Shopify-powered bundles with elegant product customization, polished cards, seamless checkout, and a refined shopping experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#featured-products" className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-indigo-600">
                  Shop Now →
                </Link>
                <Link href="/products" className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-950">
                  Explore Collection
                </Link>
              </div>
              <div className="mt-10 grid gap-4 text-sm font-semibold text-slate-600 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                  <span className="text-lg">✦</span>
                  Premium Quality
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                  <span className="text-lg">⟳</span>
                  Easy Returns
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
                  <span className="text-lg">🔒</span>
                  Secure Payment
                </div>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_34%),linear-gradient(135deg,#f7f9ff_0%,#ebf2ff_50%,#f8fbff_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,255,255,0.9),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.12),transparent_22%)]" />
              <div className="relative flex h-full items-center justify-center p-8 sm:p-12">
                {products[0]?.images.edges[0] ? (
                  <img
                    src={products[0].images.edges[0].node.url}
                    alt={products[0].images.edges[0].node.altText || products[0].title}
                    className="max-h-[420px] w-full max-w-[560px] object-contain drop-shadow-[0_30px_50px_rgba(15,23,42,0.18)]"
                  />
                ) : (
                  <div className="grid h-[340px] w-full max-w-[520px] place-items-center rounded-[2rem] border border-dashed border-slate-300 bg-white/70 text-center text-slate-500">
                    Connect Shopify products to display the hero product preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="featured-products" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Featured Products <span className="text-indigo-600">(Auto)</span>
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                Automatically selected best selling products.
              </p>
            </div>
            <Link href="/products" className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600">
              View All
            </Link>
          </div>

          {loadError ? (
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900 shadow-sm">
              Shopify products could not be loaded. Please verify your storefront environment variables and try again.
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {products.map((product, index) => (
              <Link
                href={`/products/${encodeURIComponent(product.id)}`}
                key={product.id}
                className="group overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    -20%
                  </span>
                  <span className="text-slate-300 transition group-hover:text-rose-400">♡</span>
                </div>
                <div className="aspect-square overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,#fbfdff_0%,#f0f5ff_100%)] p-4">
                  {product.images.edges[0] ? (
                    <img
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-400">No image</div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="line-clamp-1 text-base font-bold text-slate-950">{product.title}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xl font-black text-slate-950">
                      ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{Math.round(Number(product.priceRange.minVariantPrice.amount) * 1.25).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-600">★ {getRating(index)} ({120 + index * 17})</span>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm text-white transition group-hover:bg-indigo-600">
                      🛒
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            ["🚚", "Free Shipping", "On orders above ₹999"],
            ["⟳", "Easy Returns", "Hassle free returns"],
            ["🔐", "Secure Payment", "100% secure payment"],
            ["🎧", "24/7 Support", "Dedicated support"],
          ].map(([icon, title, copy]) => (
            <div key={title} className="rounded-[1.7rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="mb-3 text-2xl">{icon}</div>
              <h3 className="text-base font-black text-slate-950">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{copy}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
