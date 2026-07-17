'use client';

import { ProductNode } from '../types/product';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: ProductNode;
  featured?: boolean;
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    const firstVariant = product.variants.edges[0]?.node;
    
    if (firstVariant) {
      await addToCart({
        variantId: firstVariant.id,
        quantity: 1,
      });
    }
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const originalPrice = featured ? Math.round(price * 1.25) : null;

  return (
    <Link 
      href={`/products/${encodeURIComponent(product.id)}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
    >
      {featured && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          -20%
        </div>
      )}
      
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {product.images.edges.length > 0 && (
          <img 
            src={product.images.edges[0].node.url} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-yellow-500">⭐</span>
          <span className="text-sm font-medium text-slate-600">4.8</span>
          <span className="text-sm text-slate-400">(245)</span>
        </div>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {originalPrice && (
              <span className="text-sm text-slate-400 line-through block">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-slate-900">
              ₹{price.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition-all duration-300 ${
              isAdding 
                ? 'bg-green-500 scale-95' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isAdding ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}