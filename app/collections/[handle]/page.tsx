// app/collections/[handle]/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useTransition, useCallback, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GET_COLLECTION_PRODUCTS } from "@/lib/queries";
import { isShopifyConfigured, shopifyFetch } from "@/lib/shopify";
import { useCart } from "@/context/CartContext";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Check, 
  Leaf,
  Truck,
  Shield,
  RotateCcw,
  Award,
  Sparkles
} from "lucide-react";

type Variant = {
  id: string;
  title: string;
  price: { amount: string };
  availableForSale?: boolean;
};

type ProductNode = {
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
      node: Variant;
    }>;
  };
};

type CollectionResponse = {
  collectionByHandle: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      url: string;
      altText: string | null;
    } | null;
    products: {
      edges: Array<{ node: ProductNode }>;
    };
  } | null;
};

// Helper function to format currency in INR
function formatINR(amount: number): string {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const [collection, setCollection] = useState<CollectionResponse["collectionByHandle"]>(null);
  const [products, setProducts] = useState<ProductNode[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");

  // Combo states
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Carousel state
  const [autoSlideIndex, setAutoSlideIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Resolve params
  useEffect(() => {
    let mounted = true;
    const resolveParams = async () => {
      try {
        const p = await params;
        if (mounted) setHandle(p.handle);
      } catch (e) {
        if (mounted) {
          setLoadError(true);
          setLoading(false);
        }
      }
    };
    resolveParams();
    return () => { mounted = false; };
  }, [params]);

  // Fetch data
  useEffect(() => {
    if (!handle) return;
    let mounted = true;
    const fetchData = async () => {
      if (!isShopifyConfigured()) {
        if (mounted) { setLoadError(true); setLoading(false); }
        return;
      }
      try {
        const data = await shopifyFetch<CollectionResponse>({
          query: GET_COLLECTION_PRODUCTS,
          variables: { handle, first: 50 },
        });
        if (mounted) {
          if (data.collectionByHandle) {
            setCollection(data.collectionByHandle);
            setProducts(data.collectionByHandle.products.edges.map((edge) => edge.node));
          } else {
            setLoadError(true);
          }
          setLoading(false);
        }
      } catch (error) {
        if (mounted) { setLoadError(true); setLoading(false); }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [handle]);

  // Derived values
  const allVariants = useMemo(() => {
    return products.flatMap((product) =>
      product.variants.edges.map((edge) => ({
        ...edge.node,
        productId: product.id,
        productTitle: product.title,
        productImage: product.images.edges[0]?.node?.url || null,
        displayTitle: edge.node.title === "Default Title" ? "" : edge.node.title
      }))
    );
  }, [products]);

  const autoVariants = useMemo(() => allVariants.slice(0, 10), [allVariants]);

  // Responsive items per slide - IMPROVED for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setItemsPerSlide(1);
      else if (window.innerWidth < 768) setItemsPerSlide(2);
      else if (window.innerWidth < 1024) setItemsPerSlide(3);
      else setItemsPerSlide(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = useMemo(() => Math.max(1, Math.ceil(autoVariants.length / itemsPerSlide)), [autoVariants.length, itemsPerSlide]);

  // Auto combo calculations
  const autoTotalMrp = useMemo(() => autoVariants.reduce((sum, v) => sum + Number(v.price.amount), 0), [autoVariants]);
  const autoDiscountPercent = 32;
  const autoYouSave = (autoTotalMrp * autoDiscountPercent) / 100;
  const autoComboPrice = autoTotalMrp - autoYouSave;
  const autoTotalItems = autoVariants.length;

  // Carousel navigation
  const nextSlide = useCallback(() => {
    setAutoSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setAutoSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Drag handlers for carousel
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = dragStartX - clientX;
    setDragOffset(diff);
  }, [isDragging, dragStartX]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (dragOffset > threshold) {
      nextSlide();
    } else if (dragOffset < -threshold) {
      prevSlide();
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, nextSlide, prevSlide]);

  // Toggle selection
  const toggleVariant = useCallback((id: string) => {
    setSelectedVariantIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        setCustomQuantities((q) => { const { [id]: _, ...rest } = q; return rest; });
        return prev.filter((v) => v !== id);
      } else {
        setCustomQuantities((q) => ({ ...q, [id]: 1 }));
        return [...prev, id];
      }
    });
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCustomQuantities((prev) => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        setSelectedVariantIds((sel) => sel.filter((v) => v !== id));
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  }, []);

  const selectedVariants = useMemo(() => allVariants.filter((v) => selectedVariantIds.includes(v.id)), [allVariants, selectedVariantIds]);

  const customTotalMrp = useMemo(() => selectedVariants.reduce(
    (sum, v) => sum + Number(v.price.amount) * (customQuantities[v.id] || 1), 0
  ), [selectedVariants, customQuantities]);
  const customDiscountPercent = 32;
  const customYouSave = (customTotalMrp * customDiscountPercent) / 100;
  const customComboPrice = customTotalMrp - customYouSave;

  // Total items count for custom (sum of all quantities)
  const customTotalItems = useMemo(() => {
    return selectedVariants.reduce((sum, v) => sum + (customQuantities[v.id] || 1), 0);
  }, [selectedVariants, customQuantities]);

  // Add AUTO to cart
  const addAutoToCart = async () => {
    if (autoVariants.length === 0) { setMessage("No auto products available."); return; }
    startTransition(async () => {
      try {
        for (const variant of autoVariants) {
          await addToCart({ 
            variantId: variant.id, 
            quantity: 1, 
            title: variant.productTitle,
            variantTitle: variant.displayTitle || "Standard",
            price: variant.price.amount,
            image: variant.productImage || ""
          });
        }
        setMessage(`${autoVariants.length} items added to cart!`);
        setTimeout(() => { setMessage(null); window.location.href = "/cart"; }, 1500);
      } catch { setMessage("Failed to add to cart."); }
    });
  };

  // Buy AUTO Now
  const handleAutoBuyNow = async () => {
    if (autoVariants.length === 0) { setMessage("No auto products available."); return; }
    startTransition(async () => {
      try {
        const lines = autoVariants.map((v) => ({ merchandiseId: v.id, quantity: 1 }));
        const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines }) });
        const data = await response.json();
        if (data.cart?.checkoutUrl) window.location.href = data.cart.checkoutUrl;
        else setMessage("Checkout unavailable.");
      } catch { setMessage("Checkout failed."); }
    });
  };

  // Add CUSTOM to cart
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
            title: variant.productTitle,
            variantTitle: variant.displayTitle || "Standard",
            price: variant.price.amount,
            image: variant.productImage || ""
          });
        }
        setMessage(`${customTotalItems} items added to cart!`);
        setTimeout(() => { setMessage(null); window.location.href = "/cart"; }, 1500);
      } catch { setMessage("Failed to add to cart."); }
    });
  };

  // Buy CUSTOM Now
  const handleCustomBuyNow = async () => {
    if (selectedVariants.length === 0) { 
      setMessage("Please select at least one product."); 
      return; 
    }
    startTransition(async () => {
      try {
        const lines = selectedVariants.map((v) => ({ 
          merchandiseId: v.id, 
          quantity: customQuantities[v.id] || 1 
        }));
        const response = await fetch("/api/cart", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ lines }) 
        });
        const data = await response.json();
        if (data.cart?.checkoutUrl) window.location.href = data.cart.checkoutUrl;
        else setMessage("Checkout unavailable.");
      } catch { setMessage("Checkout failed."); }
    });
  };

  if (!isShopifyConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold">Shopify configuration missing</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-slate-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (loadError || !collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold">Error Loading Collection</p>
          <Link href="/" className="text-indigo-600 hover:underline mt-2 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* ============================================ */}
        {/* AUTO SELECT COMBO - IMPROVED MOBILE CAROUSEL */}
        {/* ============================================ */}
        <section className="mb-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
                <Zap size={10} />
                Auto Select Combo
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">Buy 10 Products Combo <span className="text-amber-500">✨</span></h2>
              <p className="text-xs text-slate-500 mt-1">Best products handpicked for you automatically</p>
            </div>
            <div className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-center whitespace-nowrap">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">Best Value</p>
              <p className="text-sm font-black">SAVE ₹{formatINR(autoYouSave)}</p>
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-center my-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <ShoppingCart size={12} className="text-indigo-600" />
              10 Items Combo (Automatically Selected)
            </div>
            <p className="text-xs text-slate-500 mt-0.5">No customization. Best products, best savings!</p>
          </div>

          {/* CAROUSEL - WITH DRAG SUPPORT */}
          <div 
            className="relative"
            ref={carouselRef}
          >
            {/* Previous Button */}
            <button 
              onClick={prevSlide} 
              className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Carousel Container */}
            <div 
              className="overflow-hidden mx-6 sm:mx-10"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              style={{ touchAction: 'none' }}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(calc(-${autoSlideIndex * 100}% - ${dragOffset}px))`,
                  gap: '1rem',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                  <div key={slideIdx} className="w-full flex-shrink-0">
                    <div 
                      className={`grid gap-3 sm:gap-4`}
                      style={{ gridTemplateColumns: `repeat(${itemsPerSlide}, minmax(0, 1fr))` }}
                    >
                      {autoVariants.slice(slideIdx * itemsPerSlide, (slideIdx + 1) * itemsPerSlide).map((variant) => (
                        <div key={variant.id} className="bg-white rounded-xl border border-slate-100 p-2 sm:p-4 text-center hover:shadow-md transition">
                          <div className="aspect-square bg-slate-50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center p-2 sm:p-3">
                            {variant.productImage ? (
                              <img src={variant.productImage} alt={variant.productTitle} className="h-full w-full object-contain" />
                            ) : (
                              <span className="text-xs text-slate-400">No img</span>
                            )}
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">{variant.productTitle}</h3>
                          {variant.displayTitle && (
                            <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1">{variant.displayTitle}</p>
                          )}
                          <p className="text-sm sm:text-base font-black text-slate-900 mt-1">₹{formatINR(Number(variant.price.amount))}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button 
              onClick={nextSlide} 
              className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAutoSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === autoSlideIndex ? "w-5 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="ml-2 text-xs text-slate-400">{autoSlideIndex + 1} / {totalSlides}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            {[
              { icon: <ShoppingCart size={12} />, text: "10 Premium Items" },
              { icon: <Zap size={12} />, text: "All Skin Types" },
              { icon: <ShieldIcon />, text: "Dermatologically Tested" },
            ].map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-medium text-slate-600">
                {tag.icon}
                {tag.text}
              </span>
            ))}
          </div>

          {/* AUTO COMBO BUTTONS WITH MRP AND COMBO PRICE */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-5">
            {/* Add to Cart Button Group */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button
                onClick={addAutoToCart}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-indigo-600 bg-white px-6 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                {isPending ? "Adding..." : "Add to Cart"}
              </button>
              <div className="text-center">
                <span className="text-xs text-slate-400 line-through mr-2">
                  ₹{formatINR(autoTotalMrp)}
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  ₹{formatINR(autoComboPrice)}
                </span>
              </div>
            </div>

            {/* Buy Now Button Group */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button
                onClick={handleAutoBuyNow}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
              >
                <Zap size={16} />
                Buy Now
              </button>
              <div className="text-center">
                <span className="text-xs text-slate-400 line-through mr-2">
                  ₹{formatINR(autoTotalMrp)}
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  ₹{formatINR(autoComboPrice)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-slate-200"></div>
          <Leaf size={14} className="text-emerald-500" />
          <span className="text-xs text-slate-400">or customize your own</span>
          <Leaf size={14} className="text-emerald-500" />
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* ============================================ */}
        {/* CUSTOMIZE YOUR COMBO */}
        {/* ============================================ */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <Leaf size={10} />
                Customize Your Combo
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900">Build Your Own Combo <span className="text-emerald-500">🌿</span></h2>
              <p className="text-xs text-slate-500 mt-1">Choose any products from below</p>
            </div>
            {/* Selection count badge */}
            <div className="rounded-lg bg-emerald-100 px-3 py-1.5 text-center whitespace-nowrap">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selected</p>
              <p className="text-sm font-black text-emerald-700">
                {customTotalItems > 0 ? `${customTotalItems} items` : '0 items'}
              </p>
            </div>
          </div>

          {/* Product Grid - Click anywhere to select */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-4">
            {allVariants.map((variant) => {
              const isSelected = selectedVariantIds.includes(variant.id);
              const qty = customQuantities[variant.id] || 0;
              return (
                <div
                  key={variant.id}
                  className={`relative bg-white rounded-xl border p-2 sm:p-3 transition-all cursor-pointer ${
                    isSelected ? "border-emerald-300 shadow-md" : "border-slate-100 hover:border-slate-200"
                  }`}
                  onClick={() => toggleVariant(variant.id)}
                >
                  {isSelected ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVariant(variant.id); }}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10"
                    >
                      <Check size={12} strokeWidth={3} />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVariant(variant.id); }}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 hover:bg-emerald-600"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  )}
                  <div className="aspect-square bg-slate-50 rounded-lg mb-1 sm:mb-2 flex items-center justify-center p-2">
                    {variant.productImage ? (
                      <img src={variant.productImage} alt={variant.productTitle} className="h-full w-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400">No img</span>
                    )}
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 line-clamp-1">{variant.productTitle}</h3>
                  {variant.displayTitle && (
                    <p className="text-[9px] sm:text-[10px] text-slate-500 line-clamp-1">{variant.displayTitle}</p>
                  )}
                  <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">₹{formatINR(Number(variant.price.amount))}</p>

                  {/* Quantity controls - stop propagation */}
                  <div className="flex items-center justify-center gap-1 mt-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => updateQuantity(variant.id, -1)}
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 text-xs"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="w-4 sm:w-5 text-center text-xs font-bold">{qty}</span>
                    <button
                      onClick={() => updateQuantity(variant.id, 1)}
                      className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 text-xs"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CUSTOM BUTTONS WITH ONLY MRP */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-5 pt-4 border-t border-slate-200">
            {/* Add to Cart Button Group */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button
                onClick={addCustomToCart}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 bg-white px-6 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 transition"
              >
                <ShoppingCart size={16} />
                {isPending ? "Adding..." : "Add to Cart"}
              </button>
              {customTotalItems > 0 ? (
                <span className="text-xs text-slate-500 font-medium">
                  {customTotalItems} items · ₹{formatINR(customTotalMrp)}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  No items selected
                </span>
              )}
            </div>

            {/* Buy Now Button Group */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
              <button
                onClick={handleCustomBuyNow}
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                <Zap size={16} />
                Buy Now
              </button>
              {customTotalItems > 0 ? (
                <span className="text-xs text-slate-500 font-medium">
                  {customTotalItems} items · ₹{formatINR(customTotalMrp)}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  No items selected
                </span>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-emerald-600 mt-4 flex items-center justify-center gap-1">
            <Leaf size={12} /> Select products to create your perfect combo and save more!
          </p>
        </section>

        {/* Message Toast */}
        {message && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-toast-in px-4">
            <div className="rounded-xl bg-emerald-500 text-white px-5 py-2.5 shadow-xl font-bold text-sm flex items-center gap-2">
              <Check size={16} /> {message}
            </div>
          </div>
        )}

        {/* Trust Badges - With Proper Icons */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Truck className="h-5 w-5 text-indigo-600" />, title: "Free Shipping", copy: "Above ₹499" },
            { icon: <Shield className="h-5 w-5 text-indigo-600" />, title: "100% Original", copy: "Products" },
            { icon: <RotateCcw className="h-5 w-5 text-indigo-600" />, title: "Easy Returns", copy: "Hassle Free" },
            { icon: <Award className="h-5 w-5 text-indigo-600" />, title: "Best Value", copy: "Save More" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-2 sm:gap-3 rounded-lg border border-slate-100 bg-white p-2 sm:p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <p className="text-[10px] text-slate-500">{item.copy}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-toast-in {
          animation: toast-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}