// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from 'next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GET_ALL_COLLECTIONS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { Truck, RefreshCw, Lock, Headphones, ArrowRight } from "lucide-react";

// --- Metadata for the page ---
export const metadata: Metadata = {
  title: 'Duodrop - Premium Grooming & Beauty Essentials',
  description: 'Discover premium beauty tools, grooming products, and curated combos at Duodrop. Free shipping on orders above ₹999.',
  keywords: ['grooming', 'beauty', 'skincare', 'beard', 'shaving', 'premium products', 'combo offers'],
  authors: [{ name: 'Duodrop' }],
  creator: 'Duodrop',
  publisher: 'Duodrop',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://duodrop.in/',
    siteName: 'Duodrop',
    title: 'Duodrop - Premium Grooming & Beauty Essentials',
    description: 'Discover premium beauty tools, grooming products, and curated combos at Duodrop.',
    images: [
      {
        url: '/title.svg',
        width: 1500,
        height: 690,
        alt: 'Duodrop - Premium Grooming & Beauty Essentials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Duodrop - Premium Grooming & Beauty Essentials',
    description: 'Discover premium beauty tools, grooming products, and curated combos at Duodrop.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

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
        <section className="relative w-full overflow-hidden">
          <div className="relative w-full h-[90vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-[92vh] 2xl:h-[95vh]">
            
            {/* Desktop/Tablet Background Image - hidden on mobile */}
            <div className="absolute inset-0 hidden sm:block bg-slate-100 mb-22">
              <Image
                src="/h1.png"
                alt="Duodrop Banner"
                fill
                priority
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>

            {/* Mobile Background Image - only visible on mobile */}
            <div className="absolute inset-0 block sm:hidden bg-slate-100">
              <Image
                src="/h3.png"
                alt="Duodrop Mobile Banner"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>

            {/* Shop Combos Button - positioned higher on both mobile and desktop */}
            <Link
              href="/collections"
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 top-[calc(82%-50px)] lg:top-[calc(87%-100px)]"
              style={{
                width: 'min(58%, 260px)',
                height: '11%',
                minHeight: '52px',
                background: 'linear-gradient(135deg, #5B2E91 0%, #4A1F7A 100%)',
                fontSize: 'clamp(15px, 2.8vw, 24px)',
                whiteSpace: 'nowrap',
                padding: '0 24px',
                boxShadow: '0 10px 40px rgba(91, 46, 145, 0.4)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Shop Combos</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
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
              href="/collections"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              View All Combo
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
              // { icon: Truck, title: "Free Shipping", copy: "On orders above ₹999" },
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