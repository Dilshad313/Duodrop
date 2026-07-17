'use client';

import { ProductNode } from '../types/product';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  products: ProductNode[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} featured={true} />
      ))}
    </div>
  );
}