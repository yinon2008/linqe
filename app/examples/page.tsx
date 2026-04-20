"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = "All" | "Web App" | "Marketing" | "Mobile" | "Automation" | "E-commerce";

interface Template {
  title: string;
  description: string;
  prompt: string;
  category: Category;
  tags: string[];
  complexity: "Starter" | "Medium" | "Advanced";
  est_days: number;
  color: string;
  icon: string;
}

const TEMPLATES: Template[] = [
  {
    title: "SaaS Starter",
    description: "Full-stack SaaS with auth, billing, dashboard, and team management.",
    prompt: "Build a project management SaaS app with user authentication, team collaboration, task boards, time tracking, and Stripe billing integration.",
    category: "Web App",
    tags: ["Next.js", "Supabase", "Stripe"],
    complexity: "Advanced",
    est_days: 21,
    color: "#38BDF8",
    icon: "SS",
  },
  {
    title: "Landing Page",
    description: "High-converting landing page with hero, features, pricing, and email capture.",
    prompt: "Create a stunning landing page for an AI productivity tool with animated hero section, social proof, feature highlights, pricing tiers, and email capture form.",
    category: "Marketing",
    tags: ["Next.js", "Tailwind", "Resend"],
    complexity: "Starter",
    est_days: 5,
    color: "#A78BFA",
    icon: "LP",
  },
  {
    title: "Fitness App",
    description: "Cross-platform mobile app with workout tracking and nutrition logging.",
    prompt: "Build a React Native fitness tracking app with workout logging, progress charts, nutrition tracking, social challenges, and push notifications.",
    category: "Mobile",
    tags: ["React Native", "Expo", "Supabase"],
    complexity: "Advanced",
    est_days: 28,
    color: "#34D399",
    icon: "FA",
  },
  {
    title: "Lead Machine",
    description: "Complete lead gen pipeline with CRM, drip campaigns, and analytics.",
    prompt: "Build a lead generation system with landing page, email capture forms, automated drip campaigns, CRM integration, lead scoring, and analytics dashboard.",
    category: "Marketing",
    tags: ["Next.js", "Resend", "Airtable"],
    complexity: "Medium",
    est_days: 14,
    color: "#FB923C",
    icon: "LM",
  },
  {
    title: "E-commerce Store",
    description: "Full online store with product catalog, cart, and Stripe checkout.",
    prompt: "Create a full e-commerce store with product catalog, shopping cart, Stripe checkout, order management, inventory tracking, and customer accounts.",
    category: "E-commerce",
    tags: ["Next.js", "Stripe", "Supabase"],
    complexity: "Advanced",
    est_days: 21,
    color: "#F472B6",
    icon: "ES",
  },
  {
    title: "Automation Pipeline",
    description: "Workflow automation connecting your tools — Gmail, Notion, Slack.",
    prompt: "Build an automation pipeline that monitors Gmail, processes incoming requests with AI, creates tasks in Notion, sends Slack notifications, and logs everything to a Google Sheet.",
    category: "Automation",
    tags: ["n8n", "OpenAI", "Zapier"],
    complexity: "Medium",
    est_days: 10,
    color: "#FBBF24",
    icon: "AP",
  },
  {
    title: "AI Chatbot",
    description: "Customer support bot with knowledge base and handoff to human.",
    prompt: "Build an AI customer support chatbot with custom knowledge base, multi-turn conversations, sentiment analysis, automatic escalation to human agents, and analytics dashboard.",
    category: "Web App",
    tags: ["Next.js", "Claude API", "Supabase"],
    complexity: "Medium",
    est_days: 12,
    color: "#38BDF8",
    icon: "AI",
  },
  {
    title: "Newsletter Platform",
    description: "Build and grow an email newsletter with subscriber management.",
    prompt: "Create a newsletter platform with subscriber management, email template builder, scheduling system, open rate analytics, and paid subscription tiers via Stripe.",
    category: "Marketing",
    tags: ["Next.js", "Resend", "Stripe"],
    complexity: "Medium",
    est_days: 14,
    color: "#A78BFA",
    icon: "NL",
  },
  {
    title: "Booking System",
    description: "Appointment scheduling with calendar sync and payment collection.",
    prompt: "Build an appointment booking system with real-time availability, calendar sync, automated reminders via SMS and email, Stripe payment collection, and admin dashboard.",
    category: "Web App",
    tags: ["Next.js", "Cal.com", "Stripe"],
    complexity: "Medium",
    est_days: 16,
    color: "#34D399",
    icon: "BS",
  },
  {
    title: "Job Board",
    description: "Niche job board with company profiles, applications, and alerts.",
    prompt: "Create a niche job board for remote developers with company profiles, job listings, one-click applications, email alerts, and a paid job posting model via Stripe.",
    category: "Web App",
    tags: ["Next.js", "Supabase", "Resend"],
    complexity: "Medium",
    est_days: 18,
    color: "#FB923C",
    icon: "JB",
  },
  {
    title: "Digital Marketplace",
    description: "Sell digital products — templates, ebooks, courses — with instant delivery.",
    prompt: "Build a digital products marketplace where creators can sell templates, ebooks, and courses. Include instant delivery, Stripe Connect for payouts, buyer reviews, and a creator dashboard.",
    category: "E-commerce",
    tags: ["Next.js", "Stripe Connect", "Supabase"],
    complexity: "Advanced",
    est_days: 25,
    color: "#F472B6",
    icon: "DM",
  },
  {
    title: "Data Dashboard",
    description: "Analytics dashboard pulling from multiple data sources with live charts.",
    prompt: "Create a business analytics dashboard that connects to Google Analytics, Stripe, and Supabase, displays live charts with revenue, user growth, and churn metrics, and supports custom date ranges.",
    category: "Web App",
    tags: ["Next.js", "Recharts", "Supabase"],
    complexity: "Medium",
    est_days: 12,
    color: "#FBBF24",
    icon: "DD",
  },
];

const CATEGORIES: Category[] = ["All", "Web App", "Marketing", "Mobile", "Automation", "E-commerce"];

const COMPLEXITY_COLORS = {
  Starter:  "text-green-400 bg-green-400/8 border-green-400/15",
  Medium:   "text-yellow-400 bg-yellow-400/8 border-yellow-400/15",
  Advanced: "text-red-400 bg-red-400/8 border-red-400/15",
};

export default function ExamplesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  function useTemplate(prompt: string) {
    sessionStorage.setItem("linqe-prefill", prompt);
    router.push("/?prefill=1");
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-slideUp">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block" />
          {TEMPLATES.length} templates
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Template Catalog</h1>
        <p className="text-[#555] max-w-md mx-auto text-sm leading-relaxed">
          Start from a proven template. Pick one, customize the prompt, and get your full project plan in seconds.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-slideUp" style={{ animationDelay: "80ms" }}>
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#333] transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? "bg-[#38BDF8] text-black"
                  : "bg-[#0d0d0d] text-[#555] border border-[#1e1e1e] hover:border-[#38BDF8]/30 hover:text-[#888]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#333] animate-fadeIn">
          <p className="text-sm">No templates match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <TemplateCard key={t.title} template={t} index={i} onUse={useTemplate} />
          ))}
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template: t,
  index,
  onUse,
}: {
  template: Template;
  index: number;
  onUse: (prompt: string) => void;
}) {
  return (
    <div
      className="group bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#252525] hover-lift transition-all animate-slideUp flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon + complexity */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[11px] font-bold tracking-wide"
          style={{ background: `${t.color}12`, border: `1px solid ${t.color}20`, color: t.color }}
        >
          {t.icon}
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${COMPLEXITY_COLORS[t.complexity]}`}>
          {t.complexity}
        </span>
      </div>

      {/* Title + description */}
      <h3 className="text-sm font-semibold text-white mb-1.5">{t.title}</h3>
      <p className="text-xs text-[#444] leading-relaxed mb-4 flex-1">{t.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {t.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-[10px] rounded-md bg-[#111] border border-[#1e1e1e] text-[#555]">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#111]">
        <span className="text-[10px] text-[#333] tabular-nums">~{t.est_days} days</span>
        <button
          onClick={() => onUse(t.prompt)}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95"
          style={{
            background: `${t.color}12`,
            border: `1px solid ${t.color}20`,
            color: t.color,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${t.color}20`;
            (e.currentTarget as HTMLElement).style.borderColor = `${t.color}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${t.color}12`;
            (e.currentTarget as HTMLElement).style.borderColor = `${t.color}20`;
          }}
        >
          Use template
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
