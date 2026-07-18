// app/products/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailCombo from "@/components/ProductDetailCombo";
import { GET_PRODUCT_BY_ID } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/products";

type ProductResponse = {
  product: ProductNode | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isShopifyConfigured()) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-14">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-900">
            <h1 className="text-2xl font-black">Shopify configuration missing</h1>
          </div>
        </main>
        <Footer />
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
      images: product.images.edges.map((edge) => edge.node),
      variants: product.variants.edges.map((edge) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: { amount: edge.node.price.amount },
        availableForSale: edge.node.availableForSale,
      })),
    };

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-950">Products</Link>
            <span>/</span>
            <span className="text-slate-900">{product.title}</span>
          </div>
          <ProductDetailCombo product={normalizedProduct} />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-14">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <h1 className="text-3xl font-black text-rose-700">Error Loading Product</h1>
            <p className="mt-3 text-sm text-rose-900/80">Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}