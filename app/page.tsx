// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GET_ALL_COLLECTIONS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { Truck, RefreshCw, Lock, Headphones, ArrowRight } from "lucide-react";

type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
};

type CollectionsResponse = {
  collections: {
    edges: Array<{ node: Collection }>;
  };
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let collections: Collection[] = [];
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<CollectionsResponse>({
        query: GET_ALL_COLLECTIONS,
        variables: { first: 12 },
      });
      collections = data.collections.edges.map((edge) => edge.node);
    } catch (error) {
      console.error("Failed to fetch Shopify collections:", error);
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/header.png"
              alt="Hero background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-5 pl-0 sm:pl-4 lg:pl-8">
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-[#143255] [text-shadow:0_2px_20px_rgba(255,255,255,0.7)] sm:text-5xl lg:text-6xl">
                Discover Your <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent [text-shadow:0_2px_20px_rgba(255,255,255,0.5)]">
                  Beauty
                </span>{" "}
                Essentials
              </h1>
              <p className="max-w-xl text-lg text-[#143255] [text-shadow:0_2px_20px_rgba(255,255,255,0.7)] sm:text-xl">
                Premium beauty tools and combos curated for your everyday routine.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="#collections"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#2FEBD8] px-8 py-4 text-sm font-bold text-[#143255] shadow-[0_20px_40px_rgba(47,235,216,0.3)] transition hover:-translate-y-1 hover:bg-[#2FEBD8]/80 hover:shadow-[0_30px_60px_rgba(47,235,216,0.4)]"
                >
                  Shop Now
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-[#143255]/80 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-[#143255]"
                >
                  All Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section id="collections" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Shop by Collection
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Browse our curated collections</p>
            </div>
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              View All Products
            </Link>
          </div>

          {loadError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900">
              Could not load collections. Please check your Shopify configuration.
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-indigo-50/50">
                  {collection.image ? (
                    <img
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-square grid place-items-center bg-slate-100 text-slate-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="line-clamp-1 text-base font-bold text-slate-950">{collection.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{collection.description || `Explore our ${collection.title} collection`}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">View Collection</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition group-hover:translate-x-1">
                      Explore <ArrowRight size={16} />
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

      <Footer />
    </div>
  );
}