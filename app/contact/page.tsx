"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo: just show success message
    setSubmitted(true);
    // In production, send to API or email
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl sm:p-12">
          <h1 className="text-4xl font-black text-slate-950">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-500">
            We'd love to hear from you. Drop us a message and we'll respond as soon as possible.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-[#2FEBD8]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">support@duodrop.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 text-[#2FEBD8]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Phone</p>
                  <p className="text-sm text-slate-600">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 text-[#2FEBD8]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Address</p>
                  <p className="text-sm text-slate-600">
                    123 Beauty Lane, Mumbai, India
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#143255] p-6 text-white">
                <p className="text-sm font-bold text-[#2FEBD8]">Business Hours</p>
                <p className="mt-2 text-sm text-white/80">
                  Monday – Friday: 9:00 AM – 6:00 PM<br />
                  Saturday: 10:00 AM – 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="rounded-2xl bg-emerald-50 p-6 text-center">
                  <p className="text-lg font-bold text-emerald-700">Thank You!</p>
                  <p className="mt-2 text-sm text-emerald-600">
                    Your message has been sent. We'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2FEBD8] focus:ring-1 focus:ring-[#2FEBD8]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2FEBD8] focus:ring-1 focus:ring-[#2FEBD8]"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#2FEBD8] focus:ring-1 focus:ring-[#2FEBD8]"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#2FEBD8] px-8 py-3 text-sm font-bold text-[#143255] shadow-md transition hover:bg-[#2FEBD8]/80 hover:shadow-lg"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}