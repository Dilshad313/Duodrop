import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products", label: "Collections" },
  { href: "/products", label: "Categories" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/55">
      <div className="border-b border-slate-200/80 bg-slate-950 px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:px-6 lg:px-8">
        Free shipping on all orders above ₹999
      </div>
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-950 transition hover:opacity-80">
          COMBO<span className="text-indigo-600">.STORE</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" aria-label="Search">
            🔍
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" aria-label="Account">
            👤
          </button>
          <Link href="/products" className="relative grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-slate-950 text-lg text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" aria-label="Cart">
            🛒
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-indigo-500 text-[10px] font-black text-white">
              2
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
