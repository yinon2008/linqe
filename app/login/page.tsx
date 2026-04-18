"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [shaking, setShaking]   = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 450);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-scaleIn">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="text-white font-bold text-2xl inline-block hover:opacity-80 transition-opacity">
            Linqe<span className="text-[#333]">✦</span>
          </Link>
          <h1 className="text-xl font-semibold text-white mt-4">Welcome back</h1>
          <p className="text-[#555] text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className={`space-y-3 ${shaking ? "animate-shake" : ""}`}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            required
            autoComplete="email"
            className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#444] text-sm focus:outline-none transition-colors ${
              error ? "border-red-500/40 focus:border-red-500/60" : "border-[#222] focus:border-[#444]"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
            autoComplete="current-password"
            className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#444] text-sm focus:outline-none transition-colors ${
              error ? "border-red-500/40 focus:border-red-500/60" : "border-[#222] focus:border-[#444]"
            }`}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs animate-slideDown px-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-[#444]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
