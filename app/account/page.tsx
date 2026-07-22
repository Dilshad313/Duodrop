// app/account/page.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Package, MapPin, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { customer, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login?redirect=/account');
    }
  }, [customer, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur-xl">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-indigo-600" />
                </div>
                <h2 className="mt-3 text-lg font-bold text-slate-950">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-sm text-slate-500">{customer.email}</p>
              </div>

              <div className="mt-6 space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 rounded-lg bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-600"
                >
                  <User size={18} />
                  Profile
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <Package size={18} />
                  Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <MapPin size={18} />
                  Addresses
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl">
              <h1 className="text-3xl font-black text-slate-950">My Account</h1>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back, {customer.firstName}!
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Email</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{customer.email}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-slate-900">Name</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
                >
                  <Package size={18} />
                  View Orders
                </Link>
                <Link
                  href="/account/addresses"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <MapPin size={18} />
                  Manage Addresses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}