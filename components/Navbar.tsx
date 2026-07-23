// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingBag, Menu, X, LogOut, User as UserIcon, HelpCircle, FileText } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { cartCount } = useCart();
  const { customer, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#143255] backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight text-[#2FEBD8] transition hover:opacity-80 flex-shrink-0">
          Duodrop
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-4 lg:gap-6 text-sm font-semibold text-[#2FEBD8] md:flex">
          <Link href="/" className="transition hover:text-white/90">Home</Link>
          <Link href="/collections" className="transition hover:text-white/90">Shop</Link>
          <Link href="/contact" className="transition hover:text-white/90">Contact</Link>
          <Link href="/return-policy" className="transition hover:text-white/90">Return Policy</Link>
          <Link href="/faq" className="transition hover:text-white/90 flex items-center gap-1">
            FAQ
          </Link>
          <Link href="/terms" className="transition hover:text-white/90 flex items-center gap-1">
            Terms
          </Link>
        </div>

        {/* Right side: Search + Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-white/80">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 sm:h-10 w-32 sm:w-44 lg:w-64 rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 pr-8 sm:pr-10 text-xs sm:text-sm text-white placeholder-white/50 outline-none transition focus:border-[#2FEBD8] focus:shadow-md"
            />
            <button type="submit" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
              <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </form>

          {/* Mobile Search - Fixed for all devices */}
          <div className="relative sm:hidden" ref={mobileSearchRef}>
            <button
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search size={18} />
            </button>

            {/* Mobile Search Overlay - Full width on mobile */}
            {mobileSearchOpen && (
              <div className="fixed left-0 right-0 top-16 z-50 px-3 py-2 bg-[#143255] border-b border-white/10 shadow-xl sm:hidden">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/50 outline-none focus:border-[#2FEBD8] focus:shadow-md"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-full bg-[#2FEBD8] px-4 py-2.5 text-sm font-bold text-[#143255]"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSearchOpen(false)}
                    className="flex-shrink-0 rounded-full p-2 text-white/60 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20"
              aria-label="Account"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <User size={18} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-11 sm:top-12 min-w-[180px] sm:min-w-[200px] rounded-xl border border-white/10 bg-[#143255] p-2 shadow-xl z-50">
                {customer ? (
                  <>
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-sm font-semibold text-white truncate">{customer.firstName} {customer.lastName}</p>
                      <p className="text-xs text-white/60 truncate">{customer.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserIcon size={16} />
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-white/10 transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#2FEBD8] hover:bg-white/10 transition"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/20 bg-indigo-500 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-600"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[10px] font-black text-[#143255]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/20 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#143255] px-4 py-4 md:hidden max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-3 text-sm font-semibold text-[#2FEBD8]">
            <Link href="/" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/collections" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/contact" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/return-policy" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
              Return Policy
            </Link>
            <Link href="/faq" className="transition hover:text-white/90 flex items-center gap-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </Link>
            <Link href="/terms" className="transition hover:text-white/90 flex items-center gap-2 py-1" onClick={() => setMobileMenuOpen(false)}>
              Terms & Conditions
            </Link>
            {customer ? (
              <>
                <Link href="/account" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
                  My Account
                </Link>
                <button onClick={handleLogout} className="text-left text-rose-400 transition hover:text-rose-300 py-1">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" className="transition hover:text-white/90 py-1" onClick={() => setMobileMenuOpen(false)}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}