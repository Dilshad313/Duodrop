// app/faq/page.tsx
"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, Search, Package, Truck, RotateCcw, CreditCard, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
  category: string;
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: "all", label: "All", icon: <HelpCircle size={14} /> },
    { id: "returns", label: "Returns", icon: <RotateCcw size={14} /> },
    { id: "payment", label: "Payment", icon: <CreditCard size={14} /> },
    { id: "products", label: "Products", icon: <Package size={14} /> },
    { id: "general", label: "General", icon: <Shield size={14} /> },
  ];

  const faqData: FAQItem[] = [
    // Returns
    {
      question: "What is your return policy?",
      answer: "You can return items within 7 days of receiving your order. Items must be unused, unopened, and in their original packaging. Please refer to our Return Policy page for more details.",
      category: "returns"
    },
    {
      question: "How do I initiate a return?",
      answer: "To initiate a return, please contact our customer support team at clickncartmarketplace@gmail.com with your order number and reason for return. We will provide you with return instructions and a return shipping address.",
      category: "returns"
    },
    {
      question: "Who pays for return shipping?",
      answer: "Return shipping costs are the responsibility of the customer unless the item received is damaged, defective, or incorrect. In such cases, we will cover the return shipping costs.",
      category: "returns"
    },
    {
      question: "How long does it take to process a refund?",
      answer: "Once we receive and inspect your returned item, we will process your refund within 5-7 business days. The refund will be credited to your original payment method.",
      category: "returns"
    },
    {
      question: "Can I exchange a product?",
      answer: "Yes, if you received a damaged, defective, or incorrect item, we offer exchanges at no additional cost. Please contact us within 48 hours of delivery with photos of the item.",
      category: "returns"
    },

    // Payment
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, UPI, net banking, and Cash on Delivery (COD) where available.",
      category: "payment"
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, all payment transactions are processed through secure payment gateways. We do not store your payment information on our servers.",
      category: "payment"
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes, Cash on Delivery is available for select locations. You can check availability at checkout. Additional charges may apply for COD orders.",
      category: "payment"
    },
    {
      question: "When will I be charged for my order?",
      answer: "For online payments, you will be charged at the time of placing the order. For COD orders, payment is collected at the time of delivery.",
      category: "payment"
    },

    // Products
    {
      question: "Are your products 100% original?",
      answer: "Yes, we source our products from authorized distributors and brands. All products are 100% genuine and authentic.",
      category: "products"
    },
    {
      question: "Can I cancel my order?",
      answer: "You may cancel your order within 24 hours of placing it, provided the order has not been shipped yet. Contact us immediately if you wish to cancel.",
      category: "products"
    },
    {
      question: "What if I receive a damaged product?",
      answer: "If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos of the damage. We will arrange for a replacement or refund.",
      category: "products"
    },
    {
      question: "Are the product images accurate?",
      answer: "We strive to provide accurate product images and descriptions. However, colors may vary slightly due to screen settings. Please refer to the product description for detailed information.",
      category: "products"
    },

    // General
    {
      question: "How do I contact customer support?",
      answer: (
        <span>
          You can reach us via email at <strong>clickncartmarketplace@gmail.com</strong> or call us at <strong>+91 90 7405 9164</strong>. We're here to help!
        </span>
      ),
      category: "general"
    },
    {
      question: "What are your business hours?",
      answer: "Our customer support team is available Monday to Saturday, 9:00 AM to 6:00 PM. We respond to emails within 24 hours.",
      category: "general"
    },
    {
      question: "Do you have a physical store?",
      answer: "We are an online-only store based in Palakkad, Kerala. Our address is: Noorjahan Mannaru Kunnath House, Vallapuzha (P.O) Pattambi (Via), Palakkad (Dist) Kerala - 679336, India.",
      category: "general"
    },
    {
      question: "How can I stay updated about new products and offers?",
      answer: "Subscribe to our newsletter or follow us on social media to stay updated about new products, exclusive offers, and promotions.",
      category: "general"
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Helper function to get plain text from React node for search
  const getPlainText = (node: string | React.ReactNode): string => {
    if (typeof node === 'string') {
      return node;
    }
    if (typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(getPlainText).join('');
    }
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      const children = element.props?.children;
      if (children) {
        return getPlainText(children);
      }
    }
    return '';
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqData.filter((item) => {
    const answerText = getPlainText(item.answer);
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          answerText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group filtered FAQs by category for display
  const groupedFaqs = filteredFaqs.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl sm:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-slate-950">Frequently Asked Questions</h1>
            <p className="mt-2 text-sm text-slate-500">
              Find answers to the most common questions about our products and services.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category.icon}
                {category.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-xs text-slate-400">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? "question" : "questions"} found
            </p>
          </div>

          {/* FAQ Accordion */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">No questions found.</p>
              <p className="text-sm text-slate-400">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedFaqs).map(([category, items]) => (
                <div key={category}>
                  {activeCategory === "all" && (
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6 first:mt-0">
                      {categories.find(c => c.id === category)?.label || category}
                    </h3>
                  )}
                  <div className="space-y-3">
                    {items.map((item, idx) => {
                      const globalIndex = faqData.indexOf(item);
                      const isOpen = openItems.includes(globalIndex);
                      return (
                        <div
                          key={globalIndex}
                          className="rounded-xl border border-slate-200 bg-white overflow-hidden transition hover:shadow-sm"
                        >
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                          >
                            <span className="text-sm font-semibold text-slate-900">{item.question}</span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 flex-shrink-0 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 flex-shrink-0 text-slate-400" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Still have questions? */}
          <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-center">
            <p className="text-sm font-semibold text-slate-900">Still have questions?</p>
            <p className="mt-1 text-sm text-slate-500">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
              >
                Contact Us
              </Link>
              <a
                href="mailto:clickncartmarketplace@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}