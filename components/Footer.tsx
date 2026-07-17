// components/Footer.tsx
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#143255] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#febd8]">
              Duodrop
            </Link>
            <p className="text-sm text-white/60">
              Premium beauty products curated for your everyday routine. Quality you can trust.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white/20 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/60 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/beauty-tools" className="text-white/60 transition hover:text-white">
                  Beauty Tools
                </Link>
              </li>
              <li>
                <Link href="/beauty-combos" className="text-white/60 transition hover:text-white">
                  Beauty Combos
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-white/60 transition hover:text-white">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-white/60 transition hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-white/60 transition hover:text-white">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 transition hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 transition hover:text-white">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Get in Touch</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>123 Beauty Lane, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail size={18} className="flex-shrink-0" />
                <span>support@duodrop.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone size={18} className="flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Duodrop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}