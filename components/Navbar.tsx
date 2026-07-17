import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight hover:opacity-90">
          COMBO<span className="text-indigo-600">.STORE</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="text-indigo-600">Home</Link>
          <Link href="/products" className="hover:text-slate-900 transition-colors">Products</Link>
          <a href="#bundles" className="hover:text-slate-900 transition-colors">All Bundles</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer p-2 bg-slate-100 rounded-full hover:bg-slate-250 transition-colors">
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              0
            </span>
            🛒
          </div>
        </div>
      </div>
    </nav>
  );
}
