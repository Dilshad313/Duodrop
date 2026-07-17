"use client";

import { useMemo, useState, useTransition } from "react";

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
};

const sellingModes = [
  {
    key: "automatic",
    title: "Automatic Selection",
    description: "We instantly recommend the best-selling configuration for the fastest checkout.",
  },
  {
    key: "custom",
    title: "Custom Selection",
    description: "Choose your preferred variant manually for a more personalized bundle experience.",
  },
] as const;

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [mode, setMode] = useState<(typeof sellingModes)[number]["key"]>("automatic");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const chosenVariant = product.variants[selectedVariant] ?? product.variants[0];
  const currentPrice = chosenVariant?.price.amount ?? product.priceRange.minVariantPrice.amount;
  const compareAtPrice = useMemo(() => {
    const base = Number(currentPrice);
    return (base * 1.18).toFixed(0);
  }, [currentPrice]);

  const handleCart = (redirectToCheckout: boolean) => {
    if (!chosenVariant) {
      setMessage("No product variant available.");
      return;
    }

    startTransition(async () => {
      setMessage(null);
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: [{ merchandiseId: chosenVariant.id, quantity: 1 }],
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to create cart");
        }

        const data = (await response.json()) as { cart?: { checkoutUrl?: string } };
        if (redirectToCheckout && data.cart?.checkoutUrl) {
          window.location.href = data.cart.checkoutUrl;
          return;
        }

        setMessage("Added to cart successfully. You can continue shopping or buy now.");
      } catch (error) {
        console.error(error);
        setMessage("Cart request failed. Please try again in a moment.");
      }
    });
  };

  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_45%),linear-gradient(135deg,#f8fbff_0%,#eef3ff_48%,#f8fafc_100%)] aspect-[4/3]">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].altText || product.title}
                className="h-full w-full object-contain p-6 transition duration-500"
              />
            ) : (
              <div className="grid h-full place-items-center text-slate-400">No image available</div>
            )}
            <div className="absolute left-5 top-5 rounded-full border border-indigo-200 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 shadow-sm">
              Premium Edit
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {product.images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              onClick={() => setSelectedImage(index)}
              className={`overflow-hidden rounded-2xl border bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                selectedImage === index ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200"
              }`}
              aria-label={`Select image ${index + 1}`}
            >
              <div className="aspect-square overflow-hidden rounded-xl bg-slate-50">
                <img src={image.url} alt={image.altText || product.title} className="h-full w-full object-cover" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              In Demand
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
              Responsive premium UI
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{product.title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{product.description}</p>

          <div className="mt-6 flex items-end gap-3">
            <div className="text-4xl font-black tracking-tight text-slate-950">
              ₹{Number(currentPrice).toLocaleString("en-IN")}
            </div>
            <div className="pb-1 text-sm font-semibold text-slate-400 line-through">
              ₹{Number(compareAtPrice).toLocaleString("en-IN")}
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              Save 18%
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {sellingModes.map((option) => (
              <button
                key={option.key}
                onClick={() => {
                  setMode(option.key);
                  if (option.key === "automatic") setSelectedVariant(0);
                }}
                className={`rounded-[1.5rem] border p-5 text-left transition ${
                  mode === option.key
                    ? "border-indigo-500 bg-indigo-50 shadow-[0_15px_35px_rgba(99,102,241,0.16)]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-950">{option.title}</h3>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border text-[10px] ${mode === option.key ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 text-transparent"}`}>
                    ●
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">Product Selection</h2>
              <span className="text-xs font-semibold text-slate-500">{product.variants.length} variants available</span>
            </div>

            <div className="grid gap-3">
              {product.variants.map((variant, index) => {
                const active = selectedVariant === index;
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setMode("custom");
                      setSelectedVariant(index);
                    }}
                    className={`flex flex-col items-start justify-between gap-3 rounded-[1.25rem] border p-4 text-left transition sm:flex-row sm:items-center ${
                      active
                        ? "border-slate-950 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                        : "border-transparent bg-white/70 hover:border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">{variant.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {variant.availableForSale === false ? "Currently unavailable" : "Ready to ship"}
                        {typeof variant.quantityAvailable === "number" ? ` • ${variant.quantityAvailable} left` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-950">₹{Number(variant.price.amount).toLocaleString("en-IN")}</span>
                      <span className={`grid h-6 w-6 place-items-center rounded-full border ${active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-transparent"}`}>
                        ✓
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleCart(false)}
              disabled={isPending}
              className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => handleCart(true)}
              disabled={isPending}
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Redirecting..." : "Buy Now"}
            </button>
          </div>

          {message ? <p className="mt-4 text-sm font-medium text-slate-600">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
