// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-2xl font-black tracking-tight">
              COMBO<span className="text-indigo-400">.STORE</span>
            </span>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Live Shopify pipeline syncing variants into flexible line-item checkouts. Premium quality products at unbeatable prices.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xl">📱</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xl">🐦</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xl">📸</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-xl">▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Returns Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">Integrations</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">Shopify GraphQL Storefront</li>
              <li className="text-slate-400">Next.js App Router 16</li>
              <li className="text-slate-400">Tailwind CSS</li>
              <li className="text-slate-400">TypeScript</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 COMBO.STORE. All rights reserved. Made with ❤️
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>🌐 English</span>
            <span>💰 INR</span>
            <span className="flex items-center gap-1">
              <span>🔒</span> Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}