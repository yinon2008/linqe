"use client";

import { Suspense, useState } from "react";
import { HeroInput } from "@/components/home/HeroInput";

const EXAMPLES = [
  "דף נחיתה לעסק הניקיון שלי עם טופס הזמנה ומחירים",
  "אפליקציה לניהול משימות לצוותים עם תשלומים",
  "חנות אונליין למוצרי יופי עם מערכת לידים",
];

const PILLS = [
  "Landing Page",
  "React App",
  "מערכת לידים",
  "חיבור דומיין",
  "Stripe",
  "Analytics",
];

export default function HomePage() {
  const [exampleValue, setExampleValue] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">

      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Primary glow */}
        <div style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 18%, rgba(56,189,248,0.10) 0%, transparent 65%)",
          width: "100%", height: "100%",
        }} />
        {/* Secondary soft glow */}
        <div style={{
          background: "radial-gradient(ellipse 40% 30% at 50% 55%, rgba(56,189,248,0.04) 0%, transparent 70%)",
          width: "100%", height: "100%",
        }} />
        {/* Subtle grid */}
        <div style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.018,
          width: "100%", height: "100%",
        }} />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-28 pb-20">

        {/* Live badge */}
        <div
          className="mb-7 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/25 text-[#38BDF8] text-xs font-medium animate-slideUp"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          AI-powered project planning
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-5 leading-[1.05] animate-slideUp"
          style={{ animationDelay: "80ms" }}
        >
          תאר לי את
          <br />
          <span style={{ color: "#38BDF8" }}>הרעיון שלך</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#777] text-base md:text-lg font-light mb-10 max-w-md animate-slideUp"
          style={{ animationDelay: "160ms", lineHeight: "1.8" }}
          dir="rtl"
        >
          ה-AI יבנה לך{" "}
          <span className="text-[#ccc] font-normal">Landing Page</span>,{" "}
          <span className="text-[#ccc] font-normal">אפליקציה</span> ו
          <span className="text-[#ccc] font-normal">מערכת לידים</span>{" "}
          — ויחבר הכל אוטומטית.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl animate-slideUp" style={{ animationDelay: "220ms" }}>
          <Suspense>
            <HeroInput exampleValue={exampleValue} />
          </Suspense>
        </div>

        {/* Example prompts */}
        <div
          className="w-full max-w-2xl mt-4 flex flex-col gap-2 animate-slideUp"
          style={{ animationDelay: "300ms" }}
        >
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setExampleValue(ex)}
              dir="rtl"
              className="w-full text-right px-4 py-2.5 bg-transparent border border-[#1e1e1e] rounded-xl text-sm text-[#555] hover:border-[#2e2e2e] hover:bg-[#0a0a0a] hover:text-[#999] transition-all duration-200 group flex items-center gap-3"
            >
              <span className="text-[#38BDF8]/50 text-xs group-hover:text-[#38BDF8]/80 transition-colors flex-shrink-0">↗</span>
              <span className="flex-1">{ex}</span>
            </button>
          ))}
        </div>

        {/* Capability pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-sm animate-slideUp"
          style={{ animationDelay: "380ms" }}
        >
          {PILLS.map((p, i) => (
            <span
              key={p}
              className="px-3 py-1 bg-[#0d0d0d] border border-[#1e1e1e] rounded-full text-xs text-[#444] animate-slideUp"
              style={{ animationDelay: `${400 + i * 50}ms` }}
            >
              {p}
            </span>
          ))}
        </div>

      </section>
    </div>
  );
}
