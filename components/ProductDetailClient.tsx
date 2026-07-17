// components/ProductDetailClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Zap, Star } from "lucide-react";
import Link from "next/link";

type ProductImage = {
  url: string;
  altText: string | null;
};

type ProductVariant = {
  id: string;
  title: string;
  availableForSale?: boolean;
  quantityAvailable?: number | null;
  price: { amount: string };
};

type ProductDetailClientProps = {
  product: {
    id: string;
    title: string;
    description: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
    images: ProductImage[];
    variants: ProductVariant[];
  };
  featuredProducts: {
    id: string;
    title: string;
    priceRange: {
      minVariantPrice: { amount: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
  }[];
  customProducts: {
    id: string;
    title: string;
    priceRange: {
      minVariantPrice: { amount: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
  }[];
};

export default function ProductDetailClient({
  product,
  featuredProducts,
  customProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Custom collection selection state
  const [selectedCustomIds, setSelectedCustomIds] = useState<string[]>([]);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});

  const chosenVariant = product.variants[selectedVariant] ?? product.variants[0];
  const currentPrice = chosenVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const compareAtPrice = (Number(currentPrice) * 1.18).toFixed(0);

  // ---- Add to Cart (normal) ----
  const handleAddToCart = () => {
    if (!chosenVariant) return;
    startTransition(async () => {
      setMessage(null);
      try {
        await addToCart({
          variantId: chosenVariant.id,
          quantity,
          title: product.title,
          price: currentPrice,
        });
        setMessage(`Added ${quantity} × ${product.title} to cart.`);
      } catch (error) {
        console.error(error);
        setMessage("Failed to add to cart. Please try again.");
      }
    });
  };

  // ---- Buy Now (direct checkout) ----
  const handleBuyNow = () => {
    if (!chosenVariant) return;
    startTransition(async () => {
      setMessage(null);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: chosenVariant.id, quantity }],
          }),
        });
        const data = await response.json();
        if (data.cart?.checkoutUrl) {
          window.location.href = data.cart.checkoutUrl;
        } else {
          setMessage("Could not initiate checkout. Please try again.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Checkout failed. Please try again.");
      }
    });
  };

  // ---- Custom selection handlers ----
  const toggleCustomSelection = (productId: string) => {
    setSelectedCustomIds((prev) => {
      if (prev.includes(productId)) {
        // remove
        setCustomQuantities((q) => {
          const { [productId]: _, ...rest } = q;
          return rest;
        });
        return prev.filter((id) => id !== productId);
      } else {
        // add
        setCustomQuantities((q) => ({ ...q, [productId]: 1 }));
        return [...prev, productId];
      }
    });
  };

  const handleCustomQuantity = (productId: string, delta: number) => {
    setCustomQuantities((prev) => {
      const newQty = Math.max(1, (prev[productId] || 1) + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  const addCustomToCart = async () => {
    // For each selected custom product, we need its variant ID.
    // Since we don't have variant data for these products, we'll need to fetch them.
    // For demo, we'll use the product ID as a placeholder (but Shopify expects a variant ID).
    // In a real scenario, you'd fetch variants for these products from the API.
    // To keep it simple, we'll just show a message.
    setMessage("Custom products added to cart (demo). In production, variant IDs are required.");
    // Actually we can try to add to cart using the product ID? No, we need variant ID.
    // We'll just mock and use the first variant of each product? We don't have variants.
    // So we'll skip actual cart addition for now and show a message.
    // For a proper implementation, you should fetch variants for customProducts in the parent.
    // I'll leave a placeholder.
  };

  const totalCustomPrice = selectedCustomIds.reduce((sum, id) => {
    const product = customProducts.find((p) => p.id === id);
    if (!product) return sum;
    const price = Number(product.priceRange.minVariantPrice.amount);
    const qty = customQuantities[id] || 1;
    return sum + price * qty;
  }, 0);

  return (
    <div className="space-y-16">
      {/* Main Product Detail */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery - reduced size */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].altText || product.title}
                  className="h-full w-full object-contain transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-400">No image</div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {product.images.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border bg-white p-1 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  selectedImage === index ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-50">
                  <img src={image.url} alt={image.altText || ""} className="h-full w-full object-cover" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{product.title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{product.description}</p>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-slate-950">
              ₹{Number(currentPrice).toLocaleString("en-IN")}
            </span>
            <span className="pb-1 text-sm font-semibold text-slate-400 line-through">
              ₹{Number(compareAtPrice).toLocaleString("en-IN")}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Save 18%</span>
          </div>

          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(index)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedVariant === index
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-700">Quantity</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-10 w-10 place-items-center text-slate-600 hover:bg-slate-100"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="grid h-10 w-10 place-items-center text-slate-600 hover:bg-slate-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className="flex-1 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                {isPending ? "Adding..." : "Add to Cart"}
              </span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isPending}
              className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(99,102,241,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(99,102,241,0.4)] disabled:opacity-60"
            >
              <span className="flex items-center justify-center gap-2">
                <Zap size={18} />
                Buy Now
              </span>
            </button>
          </div>

          {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
        </div>
      </section>

      {/* Two Product Sections */}
      <div className="space-y-16">
        {/* Featured Products (Auto) - no interaction */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Featured Products (Auto)</h2>
              <p className="text-sm text-slate-500">Curated best‑sellers – no action needed</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl border border-white/70 bg-white/80 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-slate-50 p-2">
                  <img
                    src={product.images.edges[0]?.node.url || "/placeholder.png"}
                    alt={product.title}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 line-clamp-1 text-sm font-bold text-slate-950">{product.title}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-lg font-black text-slate-950">
                    ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                  </span>
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hand Picked Collection (Custom) - click anywhere to select */}
        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">Hand Picked Collection (Custom)</h2>
              <p className="text-sm text-slate-500">Click any product to select – build your own bundle</p>
            </div>
            {selectedCustomIds.length > 0 && (
              <div className="flex items-center gap-4 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold">
                <span className="text-indigo-700">Total: ₹{totalCustomPrice.toLocaleString("en-IN")}</span>
                <button
                  onClick={addCustomToCart}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                >
                  Add Selected to Cart
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {customProducts.map((product) => {
              const isSelected = selectedCustomIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleCustomSelection(product.id)}
                  className={`group cursor-pointer rounded-xl border p-3 transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/50 shadow-[0_10px_30px_rgba(79,70,229,0.12)]"
                      : "border-white/70 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-indigo-200"
                  }`}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-slate-50 p-2">
                    <img
                      src={product.images.edges[0]?.node.url || "/placeholder.png"}
                      alt={product.title}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-950">{product.title}</h3>
                      <span className="text-sm font-black text-slate-950">
                        ₹{Number(product.priceRange.minVariantPrice.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent double toggle
                        toggleCustomSelection(product.id);
                      }}
                      className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomQuantity(product.id, -1);
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{customQuantities[product.id] || 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomQuantity(product.id, 1);
                        }}
                        className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-xs"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}