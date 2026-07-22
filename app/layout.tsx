// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duodrop | Premium Shopify Bundles",
  description: "Modern premium storefront built with Next.js and Shopify Storefront API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            
            {/* Sticky WhatsApp Floating Icon */}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.49-5.388c1.61.955 3.197 1.458 4.793 1.458 5.277 0 9.571-4.294 9.574-9.573.002-2.556-.992-4.959-2.799-6.766-1.807-1.807-4.21-2.801-6.768-2.803-5.281 0-9.574 4.293-9.577 9.573-.001 1.708.455 3.375 1.32 4.857l-.995 3.637 3.733-.979zm11.233-4.887c-.267-.134-1.579-.779-1.823-.867-.243-.088-.42-.133-.596.134-.176.267-.681.867-.834 1.043-.153.177-.306.199-.573.066-.267-.134-1.127-.416-2.148-1.327-.793-.708-1.329-1.582-1.485-1.848-.156-.267-.017-.411.117-.544.12-.12.267-.311.4-.467.133-.156.178-.267.267-.444.089-.178.044-.333-.022-.467-.066-.134-.596-1.436-.816-1.97-.214-.515-.43-.445-.596-.453-.153-.007-.33-.008-.507-.008-.177 0-.464.066-.707.333-.243.267-.927.905-.927 2.206 0 1.3 1.0 2.556 1.137 2.734.137.178 1.91 2.917 4.628 4.091.646.279 1.15.446 1.543.57.65.207 1.242.177 1.71.107.52-.078 1.579-.645 1.801-1.233.222-.588.222-1.093.155-1.199-.066-.107-.244-.177-.511-.311z" />
              </svg>
            </a>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}