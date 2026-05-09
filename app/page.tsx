"use client";

import { Suspense } from "react";
import { HeroInput } from "@/components/home/HeroInput";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(56,189,248,0.09) 0%, transparent 65%)",
          width: "100%", height: "100%",
        }} />
        <div style={{
          background: "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(56,189,248,0.04) 0%, transparent 70%)",
          width: "100%", height: "100%",
        }} />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        aria-hidden="true"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-24 pb-20">
        {/* Badge */}
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
          Bring your ideas
          <br className="hidden md:block" />
          <span style={{ color: "#38BDF8" }}>to life</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#777] text-lg font-light mb-10 max-w-md animate-slideUp"
          style={{ animationDelay: "160ms", lineHeight: "1.8" }}
        >
          Describe what you want to build. Get a{" "}
          <span className="text-[#ccc] font-normal">complete plan</span>,{" "}
          <span className="text-[#ccc] font-normal">costs</span>, and a{" "}
          <span className="text-[#ccc] font-normal">launch checklist</span>{" "}
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
