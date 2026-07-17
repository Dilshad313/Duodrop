import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetailClient from "@/components/ProductDetailClient";
import { GET_PRODUCT_BY_ID } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";

type ProductResponse = {
  product: {
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
        node: {
          id: string;
          title: string;
          availableForSale?: boolean;
          quantityAvailable?: number | null;
          price: { amount: string };
        };
      }>;
    };
  } | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isShopifyConfigured()) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-sm">
            <h1 className="text-2xl font-black">Shopify configuration missing</h1>
            <p className="mt-3 text-sm leading-7">
              Please add the Shopify storefront environment variables to load the product detail experience.
            </p>
          </div>
        </main>
      </div>
    );
  }

  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);
    const data = await shopifyFetch<ProductResponse>({
      query: GET_PRODUCT_BY_ID,
      variables: { id: decodedId },
    });

    const product = data.product;
    if (!product) notFound();

    const normalizedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      priceRange: product.priceRange,
      images: product.images.edges.map((edge) => edge.node),
      variants: product.variants.edges.map((edge) => edge.node),
    };

    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            <Link href="/" className="transition hover:text-slate-950">Home</Link>
            <span>/</span>
            <Link href="/products" className="transition hover:text-slate-950">Products</Link>
            <span>/</span>
            <span className="text-slate-900">{product.title}</span>
          </div>

          <ProductDetailClient product={normalizedProduct} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black text-rose-700">Error Loading Product</h1>
            <p className="mt-3 text-sm leading-7 text-rose-900/80">Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }
}
