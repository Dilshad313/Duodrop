// app/products/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductDetailClient from "@/components/ProductDetailClient";
import { GET_PRODUCT_BY_ID, GET_ALL_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { ProductNode } from "@/types/products";

type ProductResponse = {
  product: ProductNode | null;
};

type ProductsResponse = {
  products: {
    edges: Array<{ node: ProductNode }>;
  };
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
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-sm">
            <h1 className="text-2xl font-black">Shopify configuration missing</h1>
            <p className="mt-3 text-sm">Add your storefront environment variables.</p>
          </div>
        </main>
      </div>
    );
  }

  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);

    // Fetch main product
    const productData = await shopifyFetch<ProductResponse>({
      query: GET_PRODUCT_BY_ID,
      variables: { id: decodedId },
    });

    const product = productData.product;
    if (!product) notFound();

    // Fetch additional products for the two sections (featured and custom)
    const allProductsData = await shopifyFetch<ProductsResponse>({
      query: GET_ALL_PRODUCTS,
      variables: { first: 12 },
    });
    const allProducts = allProductsData.products.edges.map((edge) => edge.node);

    // Split into two groups: first 5 for featured, next 5 for custom
    const featuredProducts = allProducts.slice(0, 5);
    const customProducts = allProducts.slice(5, 10);

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
            <Link href="/" className="hover:text-slate-950">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-950">Products</Link>
            <span>/</span>
            <span className="text-slate-900">{product.title}</span>
          </div>

          <ProductDetailClient
            product={normalizedProduct}
            featuredProducts={featuredProducts}
            customProducts={customProducts}
          />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
            <h1 className="text-3xl font-black text-rose-700">Error Loading Product</h1>
            <p className="mt-3 text-sm text-rose-900/80">Please try again later.</p>
          </div>
        </main>
      </div>
    );
  }
}