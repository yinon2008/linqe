"use client";

import { Suspense } from "react";
import Link from "next/link";
import { HeroInput } from "@/components/home/HeroInput";

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Instant project plan",
    desc: "Describe your idea in plain language. Get a full breakdown of deliverables, tasks, and timelines — generated in seconds by Claude AI.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real cost estimates",
    desc: "No surprises. See monthly recurring and one-time costs for every tool, service, and integration your project needs before you start.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Launch checklist",
    desc: "Every project comes with a step-by-step launch checklist: domain, database, hosting, payments, email, and more — all pre-configured.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Describe your idea",
    desc: "Write a sentence or paragraph about what you want to build. Be as specific or vague as you like — Linqe figures out the rest.",
  },
  {
    number: "02",
    title: "Get your full plan",
    desc: "Within seconds, receive a complete project blueprint: deliverables, tasks, timeline, cost breakdown, and launch checklist.",
  },
  {
    number: "03",
    title: "Build with confidence",
    desc: "Use your plan to brief a developer, start building yourself, or launch directly from your dashboard with one click.",
  },
];

const EXAMPLES = [
  {
    prompt: "A SaaS tool for freelancers to track time and invoice clients automatically",
    tags: ["Web App", "Stripe", "Supabase"],
    tasks: 14,
    cost: "$47",
    days: 21,
  },
  {
    prompt: "Landing page for my new e-commerce store selling handmade jewelry",
    tags: ["Landing Page", "Shopify", "Email"],
    tasks: 6,
    cost: "$18",
    days: 5,
  },
  {
    prompt: "Mobile app for local restaurants to manage reservations and waitlists",
    tags: ["Mobile", "React Native", "Database"],
    tasks: 18,
    cost: "$89",
    days: 28,
  },
];

const TESTIMONIALS = [
  {
    quote: "Linqe saved me hours of back-and-forth with clients. I paste the plan directly into proposals — it's incredibly detailed.",
    name: "Sarah K.",
    role: "Freelance Developer",
    avatar: "S",
    color: "#38BDF8",
  },
  {
    quote: "As a non-technical founder, I finally understand what it actually takes to build my idea. The cost breakdown alone is worth it.",
    name: "Marcus T.",
    role: "Startup Founder",
    avatar: "M",
    color: "#C9A84C",
  },
  {
    quote: "I use it every time a new client comes in with an idea. Generates in seconds and the plans are surprisingly accurate.",
    name: "Priya M.",
    role: "Product Manager",
    avatar: "P",
    color: "#34D399",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-black relative overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(56,189,248,0.06) 0%, transparent 65%)",
          width: "100%",
          height: "100%",
        }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center pt-28 pb-20">
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
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-5 leading-[1.05] animate-slideUp"
          style={{ animationDelay: "80ms" }}
        >
          From idea to plan
          <br className="hidden md:block" />
          <span style={{ color: "#38BDF8" }}>in seconds</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#777] text-lg mb-10 max-w-lg animate-slideUp leading-relaxed"
          style={{ animationDelay: "160ms" }}
        >
          Describe what you want to build. Get a{" "}
          <span className="text-[#aaa]">complete plan</span>,{" "}
          <span className="text-[#aaa]">real cost estimates</span>, and a step-by-step{" "}
          <span className="text-[#aaa]">launch checklist</span>{" "}
          — powered by Claude AI.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl animate-slideUp" style={{ animationDelay: "240ms" }}>
          <Suspense>
            <HeroInput />
          </Suspense>
        </div>

        {/* Social proof strip */}
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#333] animate-slideUp"
          style={{ animationDelay: "360ms" }}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Free to start
          </span>
          <span className="text-[#222]">·</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No credit card required
          </span>
          <span className="text-[#222]">·</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Powered by Claude AI
          </span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">What you get</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to build</h2>
          <p className="text-[#555] text-base max-w-md mx-auto">
            Linqe doesn&apos;t just brainstorm — it gives you an actionable, structured plan you can act on immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#2a2a2a] transition-all animate-slideUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8] mb-4">
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-[#444] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 px-6 py-20 border-t border-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Three steps to a complete plan</h2>
            <p className="text-[#555] text-base max-w-md mx-auto">
              No forms to fill, no templates to configure. Just describe your idea and let Linqe do the work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(100%_-_16px)] w-full h-px bg-gradient-to-r from-[#1e1e1e] to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-[#1a1a1a] mb-4 font-mono">{step.number}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-[#444] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE OUTPUT CARDS ── */}
      <section className="relative z-10 px-6 py-20 border-t border-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">Examples</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See what Linqe generates</h2>
            <p className="text-[#555] text-base max-w-md mx-auto">
              Real project plans generated from real prompts. Every output includes tasks, costs, and a launch checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] transition-all animate-slideUp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Prompt */}
                <p className="text-[#888] text-xs italic mb-4 leading-relaxed line-clamp-2">&ldquo;{ex.prompt}&rdquo;</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ex.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-[#111] border border-[#1e1e1e] text-[10px] text-[#555]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#111]">
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.tasks}</p>
                    <p className="text-[#333] text-[10px]">tasks</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.cost}<span className="text-[#333]">/mo</span></p>
                    <p className="text-[#333] text-[10px]">cost est.</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{ex.days}<span className="text-[#333] text-xs"> d</span></p>
                    <p className="text-[#333] text-[10px]">timeline</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/examples"
              className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors"
            >
              Browse all 12 templates
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 px-6 py-20 border-t border-[#0f0f0f]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-[#38BDF8] font-medium tracking-widest uppercase mb-3">Loved by builders</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What people are saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 animate-slideUp"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-3.5 h-3.5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[#666] text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-black"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-[#333] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 px-6 py-24 border-t border-[#0f0f0f]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Your next project starts here
          </h2>
          <p className="text-[#555] text-base mb-8 max-w-md mx-auto">
            Join builders, founders, and freelancers who use Linqe to plan smarter and ship faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-[#38BDF8] text-black font-semibold text-sm hover:bg-[#7DD3FC] transition-colors"
            >
              Start for free
            </Link>
            <Link
              href="/examples"
              className="px-6 py-3 rounded-full bg-transparent border border-[#1e1e1e] text-[#666] text-sm hover:border-[#333] hover:text-white transition-all"
            >
              Browse examples
            </Link>
          </div>
          <p className="text-[#333] text-xs mt-5">Free during early access · No credit card required</p>
        </div>
      </section>
    </div>
  );
}
