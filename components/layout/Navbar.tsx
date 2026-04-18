"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/examples", label: "Examples" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN" && session?.user) {
        const raw = localStorage.getItem("linqe-pending-project");
        if (raw) {
          try {
            localStorage.removeItem("linqe-pending-project");
            const { prompt, model } = JSON.parse(raw);
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt, model }),
            });
            if (res.ok) {
              const { projectId } = await res.json();
              router.push(`/project/${projectId}`);
            }
          } catch {
            // silently discard malformed intent
          }
        }
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-white font-bold text-xl tracking-tight inline-flex items-center gap-0.5 select-none"
        >
          Linqe
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginBottom: 8 }}>
            <path d="M6 0L6.55 4.8L12 6L6.55 7.2L6 12L5.45 7.2L0 6L5.45 4.8Z" fill="#C9A84C" />
          </svg>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 text-sm text-[#555]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-[#111] border border-[#2a2a2a] flex items-center justify-center text-white text-xs font-semibold hover:border-[#38BDF8]/40 transition-colors"
              >
                {user.email?.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-[#555] hover:text-white transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#666] hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium px-4 py-1.5 rounded-full bg-[#38BDF8] text-black hover:bg-[#7DD3FC] transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-16 bg-black/98 flex flex-col px-6 py-8 gap-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-[#666] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-[#111] pt-6 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-[#888] hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-[#666] hover:text-white text-left transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[#666] hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium px-4 py-2 rounded-full bg-[#38BDF8] text-black text-center hover:bg-[#7DD3FC] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
