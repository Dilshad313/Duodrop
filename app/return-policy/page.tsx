import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl sm:p-12">
          <h1 className="text-4xl font-black text-slate-950">Return & Shipping Policy</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: July 21, 2026</p>

          <div className="mt-8 space-y-8 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-slate-900">Shipping Policy</h2>
              <p className="mt-2 text-sm leading-relaxed">
                We strive to deliver your orders as quickly as possible. All orders are processed within 1-2 business days.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Delivery Timeline:</strong> Once your order is processed, delivery typically takes <strong>5 to 7 business days</strong> depending on your location.</li>
                <li><strong>Order Tracking:</strong> Once your order is shipped, you will receive a tracking number via email to monitor your delivery status.</li>
                <li><strong>Shipping Charges:</strong> We offer free shipping on all orders above ₹999. For orders below ₹999, a nominal shipping fee will be applied at checkout.</li>
                <li><strong>Delivery Address:</strong> Please ensure that the shipping address provided is accurate and complete. We are not responsible for delays or lost packages due to incorrect addresses.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Return Policy</h2>
              <p className="mt-2 text-sm leading-relaxed">
                We want you to be completely satisfied with your purchase. If you are not satisfied for any reason, we offer a hassle-free return policy.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Return Window:</strong> You may return items within <strong>7 days</strong> of receiving your order.</li>
                <li><strong>Condition:</strong> Items must be unused, unopened, and in their original packaging with all tags attached.</li>
                <li><strong>Return Process:</strong> To initiate a return, please contact our customer support team with your order number and reason for return. We will provide you with return instructions and a return shipping address.</li>
                <li><strong>Return Shipping:</strong> Return shipping costs are the responsibility of the customer unless the item received is damaged, defective, or incorrect.</li>
                <li><strong>Refund Processing:</strong> Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be credited to your original payment method.</li>
                <li><strong>Non-Returnable Items:</strong> Certain items such as opened beauty products, personal care items, and gift cards cannot be returned due to hygiene reasons.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Exchange Policy</h2>
              <p className="mt-2 text-sm leading-relaxed">
                If you received a damaged, defective, or incorrect item, we offer exchanges at no additional cost.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Eligibility:</strong> Items must be reported within 48 hours of delivery.</li>
                <li><strong>Process:</strong> Contact our support team with photos of the damaged/defective item and your order details. We will arrange for a replacement to be shipped to you.</li>
                <li><strong>Timeline:</strong> Replacement items will be shipped within 5-7 business days after we process your exchange request.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Cancellation Policy</h2>
              <p className="mt-2 text-sm leading-relaxed">
                You may cancel your order within 24 hours of placing it, provided the order has not been shipped yet.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Before Shipment:</strong> Contact us immediately if you wish to cancel. Full refund will be processed within 5-7 business days.</li>
                <li><strong>After Shipment:</strong> Once the order has been shipped, it cannot be canceled. You may initiate a return after receiving the product.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
              <p className="mt-2 text-sm leading-relaxed">
                If you have any questions or concerns regarding our Return & Shipping Policy, please don't hesitate to contact us:
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>Email:</strong> clickncartmarketplace@gmail.com</p>
                <p><strong>Phone:</strong> +91 90 7405 9164</p>
                <p><strong>Address:</strong><br />
                  Noorjahan Mannaru Kunnath House<br />
                  Vallapuzha (P.O) Pattambi (Via)<br />
                  Palakkad (Dist) Kerala - 679336<br />
                  India
                </p>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900">Summary</h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shipping</p>
                    <p className="mt-1 text-lg font-black text-slate-900">5-7 Days</p>
                    <p className="text-xs text-slate-400">Free above ₹999</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Returns</p>
                    <p className="mt-1 text-lg font-black text-slate-900">7 Days</p>
                    <p className="text-xs text-slate-400">Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}