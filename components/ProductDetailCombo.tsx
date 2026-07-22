"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Zap, Truck, Shield, RefreshCw, Award } from "lucide-react";

type Variant = {
  id: string;
  title: string;
  price: { amount: string };
  compareAtPrice?: { amount: string } | null;
  availableForSale?: boolean;
};

type Product = {
  id: string;
  title: string;
  description: string;
  images: { url: string; altText: string | null }[];
  variants: Variant[];
};

// Helper function to format currency in INR
function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function getOfferPrice(variant: Variant): number {
  return Number(variant.price.amount) || 0;
}

function getActualPrice(variant: Variant): number {
  return Number(variant.compareAtPrice?.amount || variant.price.amount) || 0;
}

export default function ProductDetailCombo({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Auto-selected variants (first 5)
  const autoVariants = product.variants.slice(0, 5);

  // Custom selection state
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});

  // Toggle selection - click anywhere on card
  const toggleVariant = (id: string) => {
    setSelectedVariantIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
    if (!selectedVariantIds.includes(id)) {
      setCustomQuantities((q) => ({ ...q, [id]: 1 }));
    } else {
      setCustomQuantities((q) => {
        const { [id]: _, ...rest } = q;
        return rest;
      });
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCustomQuantities((prev) => {
      const newQty = Math.max(1, (prev[id] || 1) + delta);
      return { ...prev, [id]: newQty };
    });
  };

  const selectedVariants = product.variants.filter((v) => selectedVariantIds.includes(v.id));
  const totalMrp = selectedVariants.reduce(
    (sum, v) => sum + getActualPrice(v) * (customQuantities[v.id] || 1),
    0
  );
  const comboPrice = selectedVariants.reduce(
    (sum, v) => sum + getActualPrice(v) * (customQuantities[v.id] || 1),
    0
  );
  const youSave = Math.max(0, totalMrp - comboPrice);
  const discountPercent = totalMrp > 0 ? Math.round((youSave / totalMrp) * 100) : 0;
  const autoTotalMrp = autoVariants.reduce((sum, v) => sum + getActualPrice(v), 0);
  // Auto combo price is the exact sum of Shopify Price fields.
  const autoComboPrice = autoVariants.reduce((sum, v) => sum + getOfferPrice(v), 0);
  const autoYouSave = Math.max(0, autoTotalMrp - autoComboPrice);
  const autoDiscountPercent = autoTotalMrp > 0 ? Math.round((autoYouSave / autoTotalMrp) * 100) : 0;

  // Add auto products to cart
  const addAutoToCart = async () => {
    if (autoVariants.length === 0) {
      setMessage("No auto products available.");
      return;
    }
    startTransition(async () => {
      try {
        for (const variant of autoVariants) {
          await addToCart({
            variantId: variant.id,
            quantity: 1,
            title: variant.title,
            price: variant.price.amount,
          });
        }
        setMessage(`${autoVariants.length} auto combo items added to cart.`);
      } catch (error) {
        setMessage("Failed to add to cart.");
      }
    });
  };

  // Buy Now - Auto products
  const handleAutoBuyNow = async () => {
    if (autoVariants.length === 0) {
      setMessage("No auto products available.");
      return;
    }
    startTransition(async () => {
      try {
        const lines = autoVariants.map((v) => ({
          merchandiseId: v.id,
          quantity: 1,
        }));
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = await response.json();
        if (data.cart?.checkoutUrl) {
          window.location.href = data.cart.checkoutUrl;
        } else {
          setMessage("Checkout unavailable.");
        }
      } catch {
        setMessage("Checkout failed.");
      }
    });
  };

  // Add custom products to cart
  const addCustomToCart = async () => {
    if (selectedVariants.length === 0) {
      setMessage("Please select at least one product.");
      return;
    }
    startTransition(async () => {
      try {
        for (const variant of selectedVariants) {
          await addToCart({
            variantId: variant.id,
            quantity: customQuantities[variant.id] || 1,
            title: variant.title,
            price: getActualPrice(variant).toString(),
          });
        }
        setMessage(`${selectedVariants.length} custom items added to cart.`);
      } catch (error) {
        setMessage("Failed to add to cart.");
      }
    });
  };

  // Buy Now - Custom products
  const handleCustomBuyNow = async () => {
    if (selectedVariants.length === 0) {
      setMessage("Please select at least one product.");
      return;
    }
    startTransition(async () => {
      try {
        const lines = selectedVariants.map((v) => ({
          merchandiseId: v.id,
          quantity: customQuantities[v.id] || 1,
        }));
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = await response.json();
        if (data.cart?.checkoutUrl) {
          window.location.href = data.cart.checkoutUrl;
        } else {
          setMessage("Checkout unavailable.");
        }
      } catch {
        setMessage("Checkout failed.");
      }
    });
  };

  return (
    <div className="space-y-10">
      {/* AUTO SELECT COMBO */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-black text-slate-950">AUTO SELECT COMBO</h2>
          <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-700">
            {autoVariants.length} Items Combo (Automatically Selected)
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          No customization. Best products, best savings!
        </p>

        <div className="mt-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch]">
          <div className="flex gap-4 w-max">
            {autoVariants.map((variant) => (
              <div
                key={variant.id}
                className="snap-start w-44 flex-none rounded-2xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur-sm"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-50 p-2">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={variant.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-400">No img</div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-bold text-slate-950">{variant.title}</h3>
                <p className="text-xs text-slate-500">Size: {variant.title}</p>
                <p className="mt-1 text-lg font-black text-slate-950">
                  ₹{formatINR(Number(variant.price.amount))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-700">
            {autoVariants.length} Premium Items
          </span>
          <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-700">
            All Skin Types
          </span>
          <span className="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-700">
            Dermatologically Tested
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            <span className="text-sm font-semibold text-slate-500 line-through">
              MRP: ₹{formatINR(autoTotalMrp)}
            </span>
            <span className="text-xl font-black text-indigo-600">
              Combo Price: ₹{formatINR(autoComboPrice)}
            </span>
            {autoYouSave > 0 && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Save {autoDiscountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Auto Section Buttons */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={addAutoToCart}
            disabled={isPending}
            className="flex-1 rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-600 disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={14} />
              {isPending ? "Adding..." : "Add Auto Combo"}
            </span>
          </button>
          <button
            onClick={handleAutoBuyNow}
            disabled={isPending}
            className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
          >
            <span className="flex items-center justify-center gap-2">
              <Zap size={14} />
              Buy Auto Combo
            </span>
          </button>
        </div>
      </section>

      {/* CUSTOMIZE YOUR COMBO */}
      <section>
        <h2 className="text-2xl font-black text-slate-950">CUSTOMIZE YOUR COMBO</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose any products from below â€“ click any product to select
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {product.variants.map((variant) => {
            const isSelected = selectedVariantIds.includes(variant.id);
            return (
              <div
                key={variant.id}
                onClick={() => toggleVariant(variant.id)}
                className={`group cursor-pointer rounded-2xl border p-3 transition ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/50 shadow-[0_10px_30px_rgba(79,70,229,0.12)]"
                    : "border-white/70 bg-white/80 shadow-sm hover:border-indigo-200"
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-50 p-2">
                  {product.images[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={variant.title}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-400">No img</div>
                  )}
                </div>
                <h3 className="mt-2 text-sm font-bold text-slate-950">{variant.title}</h3>
                <p className="text-xs text-slate-500">Size: {variant.title}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-950">
                    ₹{formatINR(getActualPrice(variant))}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleVariant(variant.id);
                    }}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(variant.id, -1);
                      }}
                      className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-xs"
                    >
                      â€“
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {customQuantities[variant.id] || 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity(variant.id, 1);
                      }}
                      className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-xs"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm font-medium text-indigo-600">
          Select any products to create your perfect combo and save more!
        </p>

        {/* Custom Section Buttons */}
        {selectedVariants.length > 0 && (
          <>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addCustomToCart}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-600 disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  <ShoppingCart size={14} />
                  {isPending ? "Adding..." : `Add ${selectedVariants.length} Selected`}
                </span>
              </button>
              <button
                onClick={handleCustomBuyNow}
                disabled={isPending}
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  <Zap size={14} />
                  Buy Selected
                </span>
              </button>
            </div>
          </>
        )}
      </section>

      {/* Summary */}
      {selectedVariants.length > 0 && (
        <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Total MRP</p>
              <p className="text-2xl font-black text-slate-950">
                ₹{formatINR(totalMrp)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">You Save</p>
              <p className="text-2xl font-black text-emerald-600">
                ₹{formatINR(youSave)} ({discountPercent}% OFF)
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Combo Price</p>
              <p className="text-2xl font-black text-indigo-600">
                ₹{formatINR(comboPrice)}
              </p>
            </div>
          </div>
          {message && <p className="mt-4 text-sm font-medium text-emerald-600">{message}</p>}
        </section>
      )}

      {/* Trust Badges */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Truck, title: "Free Shipping", copy: "Above ₹499" },
          { icon: Shield, title: "100% Original", copy: "Products" },
          { icon: RefreshCw, title: "Easy Returns", copy: "Hassle Free" },
          { icon: Award, title: "Best Value", copy: "Save More" },
        ].map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm"
          >
            <Icon className="mx-auto mb-1 h-5 w-5 text-indigo-600" strokeWidth={1.5} />
            <p className="text-sm font-black text-slate-950">{title}</p>
            <p className="text-xs text-slate-500">{copy}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
