"use client";

import { Suspense } from "react";
import { HeroInput } from "@/components/home/HeroInput";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Radial glow — decorative */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(56,189,248,0.08) 0%, transparent 70%)",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block" />
          AI-powered project planning
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 leading-[1.05]">
          Bring your ideas<br className="hidden md:block" /> to life
        </h1>
        <p className="text-[#888] text-lg mb-10 max-w-md">
          Describe what you want to build. Get a complete plan, costs, and a launch checklist — in seconds.
        </p>

        <Suspense>
          <HeroInput />
        </Suspense>
      </section>
    </div>
  );
}
