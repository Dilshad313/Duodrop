// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-white/80 backdrop-blur-sm text-indigo-700 border border-indigo-200 shadow-sm mb-8">
          <span className="animate-pulse mr-2">🚀</span>
          Live Shopify Bundles Active
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
          Step Into Comfort, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Step Into Style
          </span>
        </h1>
        
        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mt-6 font-medium leading-relaxed">
          Discover our latest collection of premium sneakers, designed for everyday comfort and timeless style.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a 
            href="#featured" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
          >
            Shop Now <span className="text-xl">→</span>
          </a>
          <a 
            href="#collections" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:shadow-lg transition-all duration-300 text-lg"
          >
            Explore Collection
          </a>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="text-indigo-600">✓</span> Premium Quality
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="text-indigo-600">✓</span> Easy Returns
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="text-indigo-600">✓</span> Secure Payment
          </div>
        </div>
      </div>
    </section>
  );
}