"use client";

import { Suspense } from "react";
import { HeroInput } from "@/components/home/HeroInput";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Radial glow — decorative */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(56,189,248,0.07) 0%, transparent 70%)",
          width: "100%",
          height: "100%",
        }} />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium animate-slideUp"
          style={{ animationDelay: "0ms" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
          AI-powered project planning
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-[1.05] animate-slideUp"
          style={{ animationDelay: "80ms" }}
        >
          Bring your ideas
          <br className="hidden md:block" />
          to life
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#666] text-lg font-light tracking-wide mb-10 max-w-md animate-slideUp"
          style={{ animationDelay: "160ms", lineHeight: "1.75" }}
        >
          Describe what you want to build. Get a{" "}
          <span className="text-white font-normal">complete plan</span>,{" "}
          <span className="text-white font-normal">costs</span>, and a{" "}
          <span className="text-white font-normal">launch checklist</span>{" "}
          — in seconds.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl animate-slideUp" style={{ animationDelay: "240ms" }}>
          <Suspense>
            <HeroInput />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
