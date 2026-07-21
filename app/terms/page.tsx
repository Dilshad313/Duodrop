// app/terms/page.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl sm:p-12">
          <h1 className="text-4xl font-black text-slate-950">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: July 21, 2026</p>

          <div className="mt-8 space-y-8 text-slate-700">
            <section>
              <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Welcome to Duodrop. By using our website and services, you agree to comply with and be bound by the 
                following terms and conditions. Please read these terms carefully before using our services. If you 
                do not agree with any part of these terms, you must not use our website or services.
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                These Terms & Conditions apply to all users of the website, including without limitation users who are 
                browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">2. Definitions</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>"Duodrop"</strong> refers to our company, website, and services.</li>
                <li><strong>"User"</strong> refers to any individual or entity accessing or using our website and services.</li>
                <li><strong>"Products"</strong> refers to the beauty and grooming products available for purchase on our website.</li>
                <li><strong>"Services"</strong> refers to all features, tools, and functionalities provided by Duodrop.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">3. Products and Orders</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Product Descriptions:</strong> We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content are error-free.</li>
                <li><strong>Pricing:</strong> All prices are in Indian Rupees (INR) and are subject to change without notice. Taxes and shipping charges will be applied at checkout.</li>
                <li><strong>Order Acceptance:</strong> We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraud.</li>
                <li><strong>Order Confirmation:</strong> Once you place an order, you will receive an email confirmation. This does not constitute acceptance of your order.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">4. Pricing and Payment</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Payment Methods:</strong> We accept various payment methods including credit/debit cards, UPI, net banking, and Cash on Delivery (COD) where available.</li>
                <li><strong>Security:</strong> All payment transactions are processed through secure payment gateways. We do not store your payment information.</li>
                <li><strong>Discounts and Offers:</strong> Promotional offers and discounts are subject to specific terms and conditions. We reserve the right to modify or cancel offers at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">5. Shipping and Delivery</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li><strong>Delivery Timeline:</strong> Orders are typically delivered within <strong>5 to 7 business days</strong> after processing.</li>
                <li><strong>Shipping Charges:</strong> Free shipping is available on orders above ₹999. A nominal fee applies to orders below this amount.</li>
                <li><strong>Tracking:</strong> A tracking number will be provided once your order is shipped.</li>
                <li><strong>Delays:</strong> We are not responsible for delivery delays caused by factors beyond our control, including weather, customs, or carrier delays.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">6. Returns and Refunds</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Our Return Policy allows returns within <strong>7 days</strong> of receipt. For detailed information, please refer to our <Link href="/return-policy" className="text-indigo-600 hover:underline">Return Policy</Link> page.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li>Items must be unused and in original packaging.</li>
                <li>Return shipping is the responsibility of the customer unless the item is defective or incorrect.</li>
                <li>Refunds are processed within 5-7 business days after inspection.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">7. Intellectual Property</h2>
              <p className="mt-2 text-sm leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                Duodrop and is protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li>Reproduce, distribute, or modify any content without prior written consent.</li>
                <li>Use our trademarks or branding without authorization.</li>
                <li>Frame or mirror any part of our website on another site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">8. User Conduct</h2>
              <p className="mt-2 text-sm leading-relaxed">
                You agree to use our services only for lawful purposes and in a way that does not infringe the rights of, 
                restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited activities include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li>Posting false, misleading, or fraudulent information.</li>
                <li>Uploading malicious software or viruses.</li>
                <li>Attempting to gain unauthorized access to our systems.</li>
                <li>Engaging in any activity that disrupts the website's functionality.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">9. Privacy Policy</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Our <Link href="/return-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as outlined in that policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">10. Limitation of Liability</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Duodrop shall not be liable for any indirect, incidental, special, or consequential damages arising from:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                <li>Use or inability to use our services.</li>
                <li>Any errors or omissions in product information.</li>
                <li>Unauthorized access to or alteration of your data.</li>
                <li>Third-party actions or content.</li>
              </ul>
              <p className="mt-3 text-sm leading-relaxed">
                Our total liability is limited to the purchase price of the product you purchased.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">11. Indemnification</h2>
              <p className="mt-2 text-sm leading-relaxed">
                You agree to indemnify and hold Duodrop harmless from any claims, damages, liabilities, and expenses 
                (including legal fees) arising from your use of our services, violation of these terms, or infringement 
                of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">12. Third-Party Links</h2>
              <p className="mt-2 text-sm leading-relaxed">
                Our website may contain links to third-party websites. We do not endorse or assume responsibility for 
                the content, privacy policies, or practices of these sites. Your interactions with third-party sites are 
                at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">13. Termination</h2>
              <p className="mt-2 text-sm leading-relaxed">
                We reserve the right to terminate or suspend your account and access to our services without prior notice 
                if you violate these terms or engage in fraudulent or harmful behavior.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">14. Changes to Terms</h2>
              <p className="mt-2 text-sm leading-relaxed">
                We may update these Terms & Conditions from time to time. Any changes will be posted on this page with an 
                updated "Last updated" date. Your continued use of our services constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">15. Governing Law</h2>
              <p className="mt-2 text-sm leading-relaxed">
                These terms are governed by and construed in accordance with the laws of India. Any disputes arising from 
                these terms shall be subject to the exclusive jurisdiction of the courts in Palakkad, Kerala, India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">16. Contact Us</h2>
              <p className="mt-2 text-sm leading-relaxed">
                If you have any questions or concerns regarding these Terms & Conditions, please contact us:
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
              <h2 className="text-xl font-bold text-slate-900">Quick Summary</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg bg-indigo-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Shipping</p>
                  <p className="mt-1 text-lg font-black text-indigo-900">5-7 Days</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Returns</p>
                  <p className="mt-1 text-lg font-black text-emerald-900">7 Days</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Support</p>
                  <p className="mt-1 text-lg font-black text-amber-900">24/7</p>
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