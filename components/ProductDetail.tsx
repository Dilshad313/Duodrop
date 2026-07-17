'use client';

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ProductDetail({ product }: any) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="mb-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
              {product.images.edges.length > 0 && (
                <img
                  src={product.images.edges[0].node.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.edges.slice(1, 5).map((img: any, index: number) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 hover:ring-indigo-600 transition-all">
                    <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Premium Product</span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">{product.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-bold text-slate-900">4.8</span>
                  <span className="text-slate-400">(245 reviews)</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-green-600 font-semibold">In Stock</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-900">
                  ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                </span>
                <span className="text-lg text-slate-400 line-through">
                  ₹{Math.round(parseFloat(product.priceRange.minVariantPrice.amount) * 1.25).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Save 20%</span>
              </div>
              <p className="text-slate-600 text-sm">Inclusive of all taxes</p>
            </div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {product.variants.edges.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Select Variant</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.edges.map((variant: any) => (
                    <button
                      key={variant.node.id}
                      onClick={() => setSelectedVariant(variant.node)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedVariant?.id === variant.node.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {variant.node.title}
                      <span className="block text-xs font-normal text-slate-400">
                        ₹{parseFloat(variant.node.price.amount).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition-colors text-xl font-bold"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-slate-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-indigo-600 transition-colors text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-4 rounded-2xl text-lg font-bold text-white transition-all ${
                isAdding 
                  ? 'bg-green-500 scale-95' 
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {isAdding ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </button>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl">🚚</div>
                <p className="text-xs font-semibold text-slate-600 mt-1">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="text-2xl">↩️</div>
                <p className="text-xs font-semibold text-slate-600 mt-1">Easy Returns</p>
              </div>
              <div className="text-center">
                <div className="text-2xl">🔒</div>
                <p className="text-xs font-semibold text-slate-600 mt-1">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}