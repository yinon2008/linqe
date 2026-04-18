"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [shaking, setShaking]   = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm animate-bounceIn">
          <div className="w-14 h-14 rounded-full bg-green-500/8 border border-green-500/20 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Check your email</h2>
            <p className="text-[#555] text-sm mt-2 leading-relaxed">
              We sent a confirmation link to{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>
          <p className="text-xs text-[#333]">Didn&apos;t get it? Check your spam folder.</p>
          <Link href="/login" className="text-sm text-[#555] hover:text-white transition-colors inline-block">
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-scaleIn">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="text-white font-bold text-2xl inline-block hover:opacity-80 transition-opacity">
            Linqe<span className="text-[#333]">✦</span>
          </Link>
          <h1 className="text-xl font-semibold text-white mt-4">Create an account</h1>
          <p className="text-[#555] text-sm mt-1">Start building your ideas today</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className={`space-y-3 ${shaking ? "animate-shake" : ""}`}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            required
            className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#444] text-sm focus:outline-none transition-colors ${
              error ? "border-red-500/40 focus:border-red-500/60" : "border-[#222] focus:border-[#444]"
            }`}
          />
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              minLength={8}
              className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#444] text-sm focus:outline-none transition-colors ${
                error ? "border-red-500/40 focus:border-red-500/60" : "border-[#222] focus:border-[#444]"
              }`}
            />
            {password.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-2.5 rounded-sm transition-colors duration-300 ${
                      password.length >= (i + 1) * 2
                        ? password.length >= 10 ? "bg-green-400"
                        : password.length >= 6  ? "bg-yellow-500"
                        : "bg-red-500"
                        : "bg-[#222]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs animate-slideDown px-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#111]" />
          </div>
          <div className="relative flex justify-center text-xs text-[#333]">
            <span className="bg-black px-3">or</span>
          </div>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white text-sm hover:border-[#333] active:scale-[0.99] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-[#444]">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
