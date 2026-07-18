import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GET_ALL_COLLECTIONS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

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

export default async function AllCollectionsPage() {
  let collections: Collection[] = [];
  let loadError = false;

  if (isShopifyConfigured()) {
    try {
      const data = await shopifyFetch<CollectionsResponse>({
        query: GET_ALL_COLLECTIONS,
        variables: { first: 50 },
      });
      collections = data.collections.edges.map((edge) => edge.node);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      loadError = true;
    }
  } else {
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-4">
            <Layers size={14} />
            All Collections
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Shop by Collection
          </h1>
          <p className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
            Browse our curated collections and find the perfect products for your beauty routine.
          </p>
        </div>

        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-900 mb-8">
            Could not load collections. Please check your Shopify configuration.
          </div>
        )}

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
            >
              <div className="relative h-56 overflow-hidden bg-gradient-to-b from-slate-50 to-indigo-50/50">
                {collection.image ? (
                  <img
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-100">
                    <Sparkles size={48} className="text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-xl font-black text-white drop-shadow-lg">
                    {collection.title}
                  </h2>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm text-slate-500 line-clamp-2">
                  {collection.description || `Explore our ${collection.title} collection`}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    View Collection
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition group-hover:translate-x-1">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {collections.length === 0 && !loadError && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
            <Layers size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-semibold text-slate-600">No collections found.</p>
            <p className="text-sm text-slate-400 mt-2">Make sure your Shopify store has collections set up.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}