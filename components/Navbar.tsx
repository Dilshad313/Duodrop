"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingBag, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/beauty-tools", label: "Beauty Tools" },
  { href: "/beauty-combos", label: "Beauty Combos" },
  { href: "/contact", label: "Contact" },
  { href: "/return-policy", label: "Return Policy" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#143255] backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand – text only, color #febd8 */}
        <Link href="/" className="text-2xl font-black tracking-tight text-[#febd8] transition hover:opacity-80">
          Duodrop
        </Link>

        {/* Desktop Nav Links – color #febd8 */}
        <div className="hidden items-center gap-6 text-sm font-semibold text-[#febd8] md:flex">
          <Link href="/" className="transition hover:text-white/90">
            Home
          </Link>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className="flex items-center gap-1 transition hover:text-white/90"
            >
              Shop <ChevronDown size={16} className={`transition-transform ${shopDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {shopDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#143255] p-2 shadow-xl backdrop-blur-xl">
                <Link
                  href="/beauty-tools"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-[#febd8] transition hover:bg-white/10 hover:text-white/90"
                  onClick={() => setShopDropdownOpen(false)}
                >
                  Beauty Tools
                </Link>
                <Link
                  href="/beauty-combos"
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-[#febd8] transition hover:bg-white/10 hover:text-white/90"
                  onClick={() => setShopDropdownOpen(false)}
                >
                  Beauty Combos
                </Link>
              </div>
            )}
          </div>

          <Link href="/contact" className="transition hover:text-white/90">
            Contact
          </Link>
          <Link href="/return-policy" className="transition hover:text-white/90">
            Return Policy
          </Link>
        </div>

        {/* Right side: Search + Icons */}
        <div className="flex items-center gap-2 text-white/80">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-40 rounded-full border border-white/20 bg-white/10 px-4 pr-10 text-sm text-white placeholder-white/50 outline-none transition focus:border-indigo-400 focus:shadow-md lg:w-56"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <Search size={18} />
            </button>
          </form>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            aria-label="Search"
            onClick={() => router.push("/search")}
          >
            <Search size={18} />
          </button>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
            aria-label="Account"
          >
            <User size={18} />
          </button>

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-indigo-500 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-[#143255]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}