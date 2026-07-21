// app/contact/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl sm:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-950">Contact Us</h1>
            <p className="mt-2 text-sm text-slate-500">
              We'd love to hear from you. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Email */}
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Mail size={28} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Email</h3>
              <p className="mt-1 text-sm text-slate-600">
                <a href="mailto:clickncartmarketplace@gmail.com" className="hover:text-indigo-600 transition">
                  clickncartmarketplace@gmail.com
                </a>
              </p>
              <p className="text-xs text-slate-400 mt-1">We respond within 24 hours</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Phone size={28} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Phone</h3>
              <p className="mt-1 text-sm text-slate-600">
                <a href="tel:+919074059164" className="hover:text-emerald-600 transition">
                  +91 90 7405 9164
                </a>
              </p>
              <p className="text-xs text-slate-400 mt-1">Mon-Sat, 9:00 AM - 6:00 PM</p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <MapPin size={28} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">Address</h3>
              <address className="mt-1 text-sm text-slate-600 not-italic leading-relaxed">
                Noorjahan Mannaru Kunnath House<br />
                Vallapuzha (P.O) Pattambi (Via)<br />
                Palakkad (Dist) Kerala - 679336<br />
                India
              </address>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
            <div className="flex items-center justify-center gap-3">
              <Clock size={20} className="text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-900">Business Hours</h3>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="font-medium">Monday - Friday:</span>
                <span>9:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Saturday:</span>
                <span>10:00 AM – 4:00 PM</span>
              </div>
              <div className="flex justify-between col-span-full">
                <span className="font-medium">Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>

          {/* Map / Location Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              We're located in Palakkad, Kerala. Feel free to reach out to us via email or phone.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}