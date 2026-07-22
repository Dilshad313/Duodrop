// types/product.ts
export type ProductNode = {
  id: string;
  title: string;
  handle: string;
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
        price: { amount: string };
        compareAtPrice?: { amount: string } | null;
        availableForSale?: boolean;
        quantityAvailable?: number;
      };
    }>;
  };
};

export type ProductsResponse = {
  products: {
    edges: Array<{ node: ProductNode }>;
  };
};

export type ProductResponse = {
  product: ProductNode;
};
