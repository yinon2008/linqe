"use client";

import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const EXAMPLES: {
  title: string;
  description: string;
  prompt: string;
  icon: JSX.Element;
}[] = [
  {
    title: "Web App",
    description: "Full-stack SaaS application with auth, billing, and core features.",
    prompt: "Build a project management SaaS app with user authentication, team collaboration, task boards, time tracking, and Stripe billing integration.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.038 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.038-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Landing Page",
    description: "High-converting landing page with hero, features, pricing, and CTA.",
    prompt: "Create a stunning landing page for an AI productivity tool with animated hero section, social proof, feature highlights, pricing tiers, and email capture.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0h.008v.008H9.75V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0h.008v.008H14.25V6zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    title: "Mobile App",
    description: "Cross-platform mobile application with modern UX.",
    prompt: "Build a React Native fitness tracking app with workout logging, progress charts, nutrition tracking, social challenges, and push notifications.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
      </svg>
    ),
  },
  {
    title: "Lead System",
    description: "Complete lead generation and nurturing pipeline.",
    prompt: "Build a lead generation system with landing page, email capture forms, automated drip campaigns, CRM integration, lead scoring, and analytics dashboard.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "E-commerce",
    description: "Full-featured online store with payments and inventory.",
    prompt: "Create a full e-commerce store with product catalog, shopping cart, Stripe checkout, order management, inventory tracking, and customer accounts.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    title: "Automation Pipeline",
    description: "Workflow automation connecting your tools and services.",
    prompt: "Build an automation pipeline that monitors Gmail, processes incoming requests with AI, creates tasks in Notion, sends Slack notifications, and logs everything to a Google Sheet.",
    icon: (
      <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

export default function ExamplesPage() {
  const router = useRouter();

  function handleTry(prompt: string) {
    // Store prompt in sessionStorage and redirect to home
    sessionStorage.setItem("linqe-prefill", prompt);
    router.push("/?prefill=1");
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Examples</h1>
        <p className="text-[#666]">See what you can build with Linqe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAMPLES.map((example) => (
          <div
            key={example.title}
            className="bg-[#0d0d0d] border border-[#222] rounded-2xl p-5 hover:border-[#444] hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-4">
              {example.icon}
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">{example.title}</h3>
            <p className="text-xs text-[#555] mb-5 leading-relaxed">{example.description}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTry(example.prompt)}
              className="w-full"
            >
              Try this
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
