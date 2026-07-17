import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-950">Contact Us</h1>
        <p className="mt-4 text-lg text-slate-600">
          Have questions? We're here to help. Reach out to us via email or phone.
        </p>
        <div className="mt-8 space-y-4 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-md">
          <p><strong>Email:</strong> support@duodrop.com</p>
          <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          <p><strong>Hours:</strong> Mon–Fri, 9am–6pm EST</p>
        </div>
      </main>
    </div>
  );
}