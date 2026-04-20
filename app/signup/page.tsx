"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

const PERKS = [
  "5 free project plans every month",
  "Full deliverables, tasks & cost estimates",
  "Launch checklist for every project",
  "No credit card required",
];

function StrengthBar({ password }: { password: string }) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (len >= 6) score++;
  if (len >= 10) score++;
  if (hasUpper || hasNum) score++;
  if (hasSpecial) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-400", "bg-[#34D399]"];
  const textColors = ["", "text-red-400", "text-yellow-400", "text-blue-400", "text-[#34D399]"];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-[#1a1a1a]"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs ${textColors[score]}`}>{labels[score]} password</p>
      )}
    </div>
  );
}

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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm animate-bounceIn">
          <div className="w-16 h-16 rounded-full bg-[#34D399]/8 border border-[#34D399]/20 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
            <p className="text-[#555] text-sm leading-relaxed">
              We sent a confirmation link to{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-left space-y-2">
            <p className="text-white text-xs font-semibold">Next steps:</p>
            {["Check your email (and spam folder)", "Click the confirmation link", "Start building your first project"].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#444]">
                <span className="w-4 h-4 rounded-full bg-[#111] border border-[#1e1e1e] flex items-center justify-center text-[#333] text-[10px]">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
          <Link href="/login" className="text-sm text-[#555] hover:text-white transition-colors inline-block">
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#050505] border-r border-[#0f0f0f] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 80% 50%, rgba(56,189,248,0.04) 0%, transparent 70%)",
        }} />

        <Link href="/" className="relative z-10 text-white font-bold text-xl inline-flex items-center gap-0.5">
          Linqe
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginBottom: 8 }}>
            <path d="M6 0L6.55 4.8L12 6L6.55 7.2L6 12L5.45 7.2L0 6L5.45 4.8Z" fill="#C9A84C" />
          </svg>
        </Link>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">Start building today.</h2>
          <p className="text-[#444] text-sm leading-relaxed mb-8 max-w-xs">
            Your free account includes everything you need to plan your next project.
          </p>

          <ul className="space-y-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-[#555]">
                <svg className="w-4 h-4 text-[#38BDF8] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { value: "5+", label: "Project types" },
            { value: "<30s", label: "Generation time" },
            { value: "Free", label: "To start" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-3 text-center">
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-[#333] text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-6 animate-scaleIn">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-2">
            <Link href="/" className="text-white font-bold text-xl inline-flex items-center gap-0.5">
              Linqe
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" style={{ marginBottom: 7 }}>
                <path d="M6 0L6.55 4.8L12 6L6.55 7.2L6 12L5.45 7.2L0 6L5.45 4.8Z" fill="#C9A84C" />
              </svg>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-[#444] text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={async () => {
                const { createClient } = await import("@/lib/supabase");
                const sb = createClient();
                await sb.auth.signInWithOAuth({
                  provider: "google",
                  options: { redirectTo: `${window.location.origin}/auth/callback` },
                });
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white text-sm font-medium hover:border-[#333] hover:bg-[#111] transition-all"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={async () => {
                const { createClient } = await import("@/lib/supabase");
                const sb = createClient();
                await sb.auth.signInWithOAuth({
                  provider: "github",
                  options: { redirectTo: `${window.location.origin}/auth/callback` },
                });
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white text-sm font-medium hover:border-[#333] hover:bg-[#111] transition-all"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#111]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-black px-3 text-[#333]">or continue with email</span>
            </div>
          </div>

          <form
            onSubmit={handleSignup}
            className={`space-y-4 ${shaking ? "animate-shake" : ""}`}
          >
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                required
                autoComplete="email"
                className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#333] text-sm focus:outline-none transition-colors ${
                  error ? "border-red-500/40 focus:border-red-500/60" : "border-[#1e1e1e] focus:border-[#38BDF8]/30"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required
                minLength={8}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-[#0d0d0d] border rounded-xl text-white placeholder-[#333] text-sm focus:outline-none transition-colors ${
                  error ? "border-red-500/40 focus:border-red-500/60" : "border-[#1e1e1e] focus:border-[#38BDF8]/30"
                }`}
              />
              {password.length > 0 && <StrengthBar password={password} />}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs animate-slideDown px-3 py-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Create free account
            </Button>

            <p className="text-center text-xs text-[#333] leading-relaxed">
              By signing up, you agree to our{" "}
              <a href="#" className="text-[#444] hover:text-white transition-colors">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-[#444] hover:text-white transition-colors">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-sm text-[#444]">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-medium hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
