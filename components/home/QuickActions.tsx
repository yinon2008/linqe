"use client";

const ACTIONS = [
  { label: "Landing page",    prompt: "Build me a stunning landing page for a SaaS product with hero section, features, pricing, and CTA." },
  { label: "Business site",   prompt: "Create a complete business website with homepage, about page, services, and contact form." },
  { label: "Lead system",     prompt: "Build a lead generation system with email capture, CRM integration, automated follow-up sequences, and analytics dashboard." },
  { label: "Brand identity",  prompt: "Design a complete brand identity with logo concept, color palette, typography system, and UI component library." },
  { label: "Automation",      prompt: "Build a workflow automation system to handle email processing, task scheduling, notifications, and data sync between tools." },
];

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ACTIONS.map((action, i) => (
        <button
          key={action.label}
          type="button"
          onClick={() => onSelect(action.prompt)}
          className="px-3.5 py-1.5 bg-[#0d0d0d] text-[#666] text-xs rounded-full border border-[#222] hover:border-[#38BDF8]/40 hover:text-[#ddd] hover:bg-[#111] active:scale-95 transition-all duration-200 whitespace-nowrap animate-slideUp"
          style={{ animationDelay: `${300 + i * 60}ms` }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
