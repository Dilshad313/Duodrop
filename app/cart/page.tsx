// app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  // Calculate savings (assuming 32% off as in the combo)
  const savings = subtotal * 0.32;
  const total = subtotal - savings;

  const handleCheckout = async () => {
    const lines = cartItems.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await response.json();
      if (data.cart?.checkoutUrl) {
        window.location.href = data.cart.checkoutUrl;
      } else {
        alert("Could not initiate checkout. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Checkout failed.");
    }
  };

  const handleImageError = (variantId: string) => {
    setImageErrors(prev => ({ ...prev, [variantId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:shadow-md transition-all hover:text-indigo-600 border border-slate-200/50"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
          
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 transition-all"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Your Cart
                {cartItems.length > 0 && (
                  <span className="ml-2 text-sm font-medium text-slate-400">
                    ({cartCount} items)
                  </span>
                )}
              </h1>
            </div>

            {cartItems.length === 0 ? (
              <div className="mt-12 text-center">
                <div className="mx-auto h-32 w-32 rounded-full bg-indigo-50 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-indigo-300" />
                </div>
                <p className="mt-6 text-xl font-semibold text-slate-700">Your cart is empty</p>
                <p className="mt-2 text-sm text-slate-500">Looks like you haven't added any products yet.</p>
                <Link 
                  href="/" 
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <ShoppingBag size={18} />
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const hasImage = item.image && item.image.length > 0;
                  const hasError = imageErrors[item.variantId];
                  const showImage = hasImage && !hasError;
                  
                  return (
                    <div
                      key={item.variantId}
                      className="group relative rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100/80"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                          {showImage ? (
                            <Image
                              src={item.image as string}
                              alt={item.title || "Product"}
                              fill
                              className="object-contain p-2"
                              onError={() => handleImageError(item.variantId)}
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-950 text-sm sm:text-base line-clamp-2">
                            {item.title || "Product"}
                          </h3>
                          {item.variantTitle && item.variantTitle.length > 0 && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.variantTitle}
                            </p>
                          )}
                          
                          {/* Price and Quantity */}
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50 transition-colors rounded-l-lg"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50 transition-colors rounded-r-lg"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-950">
                                ₹{(Number(item.price || 0) * item.quantity).toLocaleString("en-IN")}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-xs text-slate-400">
                                  ₹{Number(item.price || 0).toLocaleString("en-IN")} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto rounded-full p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-slate-100/80">
                <h2 className="text-xl font-black text-slate-950">Order Summary</h2>
                
                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount (32%)</span>
                    <span className="font-medium text-emerald-600">-₹{savings.toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                    <span className="text-slate-950">Total</span>
                    <span className="text-indigo-600">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full rounded-xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Proceed to Checkout
                </button>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200 pt-6">
                  <div className="text-center">
                    <Truck className="mx-auto h-5 w-5 text-indigo-400" />
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <Shield className="mx-auto h-5 w-5 text-indigo-400" />
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <RotateCcw className="mx-auto h-5 w-5 text-indigo-400" />
                    <p className="mt-1 text-[10px] font-medium text-slate-500">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}