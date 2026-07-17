// app/products/[id]/page.tsx (Server Component)
import { shopifyFetch } from '@/lib/shopify';
import { GET_PRODUCT_BY_ID } from '@/lib/queries';
import { notFound } from 'next/navigation';

type ProductResponse = {
  product: {
    id: string;
    title: string;
    description: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
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
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const resolvedParams = await params;
    const decodedId = decodeURIComponent(resolvedParams.id);
    const data = await shopifyFetch<ProductResponse>({
      query: GET_PRODUCT_BY_ID,
      variables: { id: decodedId },
    });

    const product = data.product;
    if (!product) notFound();

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {product.images.edges.length > 0 && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                className="w-full rounded-lg"
              />
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-gray-600 mt-4">{product.description}</p>
            <p className="text-2xl font-bold mt-4">
              ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
            </p>
            
            {/* Variants */}
            <div className="mt-6">
              <h3 className="font-semibold">Variants:</h3>
              {product.variants.edges.map((variant) => (
                <div key={variant.node.id} className="flex items-center gap-4 mt-2">
                  <span>{variant.node.title}</span>
                  <span>₹{parseFloat(variant.node.price.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Product</h1>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }
}