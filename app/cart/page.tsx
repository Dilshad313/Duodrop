// app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    // Call /api/cart to get checkout URL
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            <ArrowLeft size={18} className="inline" /> Continue Shopping
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Your Cart</h1>
            {cartItems.length === 0 ? (
              <div className="mt-8 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-slate-300" />
                <p className="mt-4 text-lg font-semibold text-slate-600">Your cart is empty</p>
                <Link href="/" className="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-950">{item.title || "Product"}</h3>
                      <p className="text-sm text-slate-500">Variant: {item.variantId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="w-24 text-right font-bold text-slate-950">
                        ₹{(Number(item.price || 0) * item.quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={clearCart}
                  className="text-sm font-medium text-rose-500 hover:text-rose-700"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <h2 className="text-xl font-black text-slate-950">Order Summary</h2>
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-bold">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full rounded-2xl bg-slate-950 py-4 text-sm font-bold text-white transition hover:bg-indigo-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}