// app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg backdrop-blur-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-950">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/forgot-password"
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold transition">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}