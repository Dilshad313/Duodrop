import Navbar from "@/components/Navbar";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-950">Return Policy</h1>
        <div className="mt-6 space-y-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-md text-slate-700">
          <p>
            We want you to love your purchase. If you're not completely satisfied,
            you can return items within 30 days of delivery for a full refund.
          </p>
          <p>
            <strong>Conditions:</strong> Items must be unused, in original packaging,
            and with all tags attached.
          </p>
          <p>
            To initiate a return, please contact our support team with your order number.
          </p>
          <p className="text-sm text-slate-500">*Shipping fees are non-refundable.</p>
        </div>
      </main>
    </div>
  );
}