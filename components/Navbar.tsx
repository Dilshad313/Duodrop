// components/Navbar.tsx
"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products", label: "Collections" },
  { href: "/products", label: "Categories" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/55">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-950 transition hover:opacity-80">
          Duo<span className="text-indigo-600">drop</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-slate-700">
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-40 rounded-full border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:shadow-md lg:w-56"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Search size={18} />
            </button>
          </form>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:hidden"
            aria-label="Search"
            onClick={() => router.push("/search")}
          >
            <Search size={18} />
          </button>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Account"
          >
            <User size={18} />
          </button>

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-slate-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-indigo-500 text-[10px] font-black text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
} 