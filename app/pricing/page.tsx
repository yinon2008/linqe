"use client";

import Link from "next/link";
import { useState } from "react";

const FAQ = [
  {
    q: "Is Linqe really free?",
    a: "Yes — Linqe is free to use during early access. The Free plan gives you 5 project plans per month with full features. No credit card required.",
  },
  {
    q: "What AI model does Linqe use?",
    a: "Linqe is powered by Claude, Anthropic's AI. You can choose between Claude Opus and Claude Sonnet when generating your plan.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Pro and Team plans are billed monthly and you can cancel anytime. You'll keep access until the end of your billing period.",
  },
  {
    q: "What does 'auto-connect integrations' mean?",
    a: "Pro users can have Linqe automatically connect tasks to real tools — like setting up a Stripe account, configuring a domain, or spinning up a database — with one click.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're not satisfied within your first 7 days on a paid plan, we'll issue a full refund. No questions asked.",
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Yes. You can upgrade to Pro or Team at any time from your dashboard. Downgrading takes effect at the end of your current billing cycle.",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="#2a2a2a" strokeWidth="1.5" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const PLANS = [
    {
      name: "Free Plan",
      price: "Free",
      priceSuffix: "",
      subtext: "5 plans per month",
      description: null,
      cta: "Get Started",
      ctaHref: "/signup",
      highlight: false,
      features: [
        "5 AI project plans per month",
        "Full deliverables & task breakdown",
        "Cost estimates",
        "Launch checklist",
        "12 built-in templates",
        "Save & revisit projects",
      ],
    },
    {
      name: "Pro Plan",
      price: annual ? "$15" : "$20",
      priceSuffix: "/m",
      subtext: annual ? "Billed $180/year" : "Billed monthly",
      description: null,
      cta: "Get Started",
      ctaHref: "/signup",
      highlight: true,
      features: [
        "Unlimited AI project plans",
        "Full deliverables & task breakdown",
        "Cost estimates",
        "Launch checklist",
        "12 built-in templates",
        "Save & revisit projects",
        "Priority AI generation",
        "Export to PDF / Notion",
        "Auto-connect integrations",
      ],
    },
    {
      name: "Team Plan",
      price: annual ? "$39" : "$49",
      priceSuffix: "/m",
      subtext: annual ? "Billed yearly" : "Billed monthly",
      description: null,
      cta: "Contact us",
      ctaHref: "mailto:hello@linqe.app",
      highlight: false,
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Shared project dashboard",
        "Team collaboration",
        "Custom templates",
        "Priority support",
        "Early feature access",
      ],
    },
  ];

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      {/* Giant background "Pricing" text */}
      <div className="relative pt-16 pb-4 select-none pointer-events-none">
        <p className="text-center font-bold text-white leading-none"
          style={{
            fontSize: "clamp(80px, 18vw, 220px)",
            opacity: 0.06,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}>
          Pricing
        </p>
      </div>

      {/* Cards — overlap the big text */}
      <div className="px-6 max-w-5xl mx-auto -mt-16 mb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl flex flex-col overflow-hidden"
              style={{
                background: plan.highlight
                  ? "linear-gradient(180deg, #161616 0%, #0d0d0d 100%)"
                  : "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
                border: plan.highlight ? "1px solid #2a2a2a" : "1px solid #1a1a1a",
              }}
            >
              {/* Glow at top of card */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
                style={{
                  background: plan.highlight
                    ? "radial-gradient(ellipse at top, rgba(255,255,255,0.12) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at top, rgba(255,255,255,0.06) 0%, transparent 70%)",
                }}
              />

              <div className="p-6 flex flex-col flex-1 relative z-10">
                {/* Plan name */}
                <p className="text-[#666] text-sm mb-3">{plan.name}</p>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-white font-bold leading-none" style={{ fontSize: "clamp(36px, 6vw, 52px)" }}>
                    {plan.price}
                  </span>
                  {plan.priceSuffix && (
                    <span className="text-[#444] text-xl font-semibold">{plan.priceSuffix}</span>
                  )}
                </div>
                <p className="text-[#333] text-xs mb-6">{plan.subtext}</p>

                {/* Features */}
                <div className="space-y-2.5 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span className="text-[#666] text-sm leading-snug">{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-[#e5e5e5]"
                      : "bg-[#161616] border border-[#2a2a2a] text-white hover:border-[#3a3a3a]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Annual toggle */}
        <div className="flex items-center gap-3 mt-6 px-1">
          <button
            type="button"
            onClick={() => setAnnual((v) => !v)}
            className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
              annual ? "bg-white" : "bg-[#222]"
            }`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-all duration-200 ${
                annual ? "translate-x-4 bg-black" : "translate-x-0 bg-[#555]"
              }`}
            />
          </button>
          <span className="text-sm text-[#666]">
            Billed Yearly{" "}
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium">
              Save 25%
            </span>
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 max-w-3xl mx-auto pb-24 border-t border-[#0f0f0f] pt-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Frequently asked questions</h2>
          <p className="text-[#444] text-sm">
            Can&apos;t find the answer?{" "}
            <a href="mailto:hello@linqe.app" className="text-[#38BDF8] hover:underline">
              Email us
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.q} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5">
              <p className="text-white text-sm font-semibold mb-2">{item.q}</p>
              <p className="text-[#555] text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-20 text-center border-t border-[#0f0f0f] pt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to build?</h2>
        <p className="text-[#444] text-sm mb-7">Start planning your project for free — no credit card needed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
        >
          Start building for free
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
