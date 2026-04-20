import Link from "next/link";

export const metadata = {
  title: "Docs — Linqe",
  description: "Learn how to use Linqe to plan, cost, and launch your next project with AI.",
};

const SECTIONS = [
  {
    id: "getting-started",
    label: "Getting started",
    items: ["What is Linqe?", "Your first project", "Understanding the output"],
  },
  {
    id: "writing-prompts",
    label: "Writing prompts",
    items: ["What makes a good prompt", "Examples & tips", "Using templates"],
  },
  {
    id: "your-plan",
    label: "Your project plan",
    items: ["Deliverables", "Tasks & automation", "Cost breakdown", "Launch checklist"],
  },
  {
    id: "account",
    label: "Account & billing",
    items: ["Free vs Pro", "Managing projects", "Cancellation & refunds"],
  },
];

const GUIDES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "What is Linqe?",
    content: `Linqe is an AI-powered project planning tool built for founders, freelancers, and product teams. You describe what you want to build — in plain language — and Linqe uses Claude AI to generate a complete, structured project plan.

Every plan includes:
• **Deliverables** — the tangible outputs of your project (landing pages, databases, APIs, etc.)
• **Tasks** — individual actionable steps with estimated time
• **Cost breakdown** — monthly recurring and one-time costs for every tool and service
• **Launch checklist** — step-by-step setup for domain, payments, email, database, and more`,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: "Writing a great prompt",
    content: `The quality of your plan depends on the quality of your prompt. Here's what works:

**Be specific about what you're building:**
_"A SaaS tool for freelance designers to generate client proposals and track project status"_ — good.
_"A website"_ — too vague.

**Mention your target audience:**
Who will use this? Freelancers? Small business owners? Consumers? This helps Linqe tailor the stack and features.

**Include constraints if you have them:**
Budget limits, timeline, preferred technologies, or existing infrastructure all help produce a more accurate plan.

**Don't worry about being perfect:**
Linqe is designed to extract maximum value from imperfect prompts. If it needs more, it'll make smart assumptions and note them in the plan.`,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Understanding your plan",
    content: `Once Linqe generates your plan, here's how to read it:

**Deliverables** are the high-level outputs — think of them as the major milestones. Each deliverable contains multiple tasks.

**Tasks** are individual work items. Each one shows:
- A clear description of what needs to be done
- The estimated time or complexity
- The automation type (if applicable) — domain, database, payment, email, hosting, or API

**Cost breakdown** shows two categories:
- **Monthly recurring** — ongoing costs like hosting, databases, email services
- **One-time** — setup costs, design assets, integrations

**Launch checklist** is your go-to-market guide — the exact steps to take your project live, in order.`,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Plans & limits",
    content: `**Free plan** — 5 AI project plans per month, full features, no credit card required.

**Pro plan ($19/month)** — Unlimited plans, priority generation, export to PDF and Notion, and auto-connect integrations.

**Team plan ($49/month)** — Everything in Pro plus team collaboration, shared dashboards, and custom templates.

Your plan resets on the 1st of every month. Unused generations don't roll over. If you hit the limit, you can upgrade to Pro at any time from your dashboard or the pricing page.

Need more than Team? [Email us](mailto:hello@linqe.app) for custom enterprise pricing.`,
  },
];

const TIPS = [
  "Use the quick action buttons on the homepage to get started fast",
  "Browse the 12 built-in templates in the Examples section for inspiration",
  "Press Enter to submit — Shift+Enter for a new line in the prompt box",
  "If you're not logged in when you generate, your prompt is saved and processed after sign-up",
  "Use the model selector to choose between Claude Opus (most capable) and Claude Sonnet (faster)",
];

export default function DocsPage() {
  return (
    <div className="bg-black min-h-screen">
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium mb-5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Documentation
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Learn how Linqe works</h1>
            <p className="text-[#555] text-base max-w-xl">
              Everything you need to know to get from idea to a complete, actionable project plan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <nav className="lg:col-span-1">
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 sticky top-24">
                <p className="text-[#333] text-xs font-medium uppercase tracking-wider mb-3 px-1">Contents</p>
                <div className="space-y-4">
                  {SECTIONS.map((sec) => (
                    <div key={sec.id}>
                      <p className="text-[#555] text-xs font-semibold mb-1 px-1">{sec.label}</p>
                      <ul className="space-y-0.5">
                        {sec.items.map((item) => (
                          <li key={item}>
                            <a
                              href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                              className="block text-xs text-[#333] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[#111]"
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-[#111]">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xs text-[#38BDF8] hover:text-[#7DD3FC] transition-colors px-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                    Try Linqe now
                  </Link>
                </div>
              </div>
            </nav>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-4">
              {GUIDES.map((guide, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/15 flex items-center justify-center text-[#38BDF8]">
                      {guide.icon}
                    </div>
                    <h2 className="text-white font-semibold text-lg">{guide.title}</h2>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    {guide.content.split("\n\n").map((block, j) => {
                      if (block.startsWith("•")) {
                        const items = block.split("\n").filter(Boolean);
                        return (
                          <ul key={j} className="space-y-1 mb-4">
                            {items.map((item, k) => (
                              <li key={k} className="text-[#555] text-sm flex items-start gap-2">
                                <span className="text-[#38BDF8] mt-1">•</span>
                                <span dangerouslySetInnerHTML={{ __html: item.replace(/^•\s*/, "").replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>') }} />
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      if (block.startsWith("_") && block.endsWith("_")) {
                        return (
                          <p key={j} className="text-[#38BDF8]/70 text-sm italic mb-4 pl-3 border-l border-[#38BDF8]/20">
                            {block.slice(1, -1)}
                          </p>
                        );
                      }
                      return (
                        <p
                          key={j}
                          className="text-[#555] text-sm leading-relaxed mb-4"
                          dangerouslySetInnerHTML={{
                            __html: block
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#38BDF8] hover:underline">$1</a>'),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quick tips */}
              <div className="bg-[#38BDF8]/[0.03] border border-[#38BDF8]/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-white font-semibold">Quick tips</h3>
                </div>
                <ul className="space-y-2.5">
                  {TIPS.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#555]">
                      <svg className="w-4 h-4 text-[#34D399] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help footer */}
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-semibold mb-1">Still have questions?</p>
                  <p className="text-[#444] text-xs">We&apos;re happy to help. Drop us a line and we&apos;ll get back to you within 24 hours.</p>
                </div>
                <a
                  href="mailto:hello@linqe.app"
                  className="flex-shrink-0 px-4 py-2 rounded-xl bg-[#111] border border-[#1e1e1e] text-white text-sm hover:border-[#333] transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  hello@linqe.app
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
