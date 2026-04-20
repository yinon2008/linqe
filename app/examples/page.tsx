"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { ProjectPlan } from "@/lib/types";

type Category = "All" | "Web App" | "Marketing" | "Mobile" | "Automation" | "E-commerce";
const CATEGORIES: Category[] = ["All", "Web App", "Marketing", "Mobile", "Automation", "E-commerce"];

interface PublicTemplate {
  id: string;
  title: string;
  description: string;
  raw_prompt: string;
  ai_response: ProjectPlan | null;
  created_at: string;
}

function initials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const COLORS = ["#38BDF8", "#A78BFA", "#34D399", "#FB923C", "#F472B6", "#FBBF24"];
function colorFor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return COLORS[n % COLORS.length];
}

export default function ExamplesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, raw_prompt, ai_response, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(60);
      setTemplates((data as PublicTemplate[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.raw_prompt.toLowerCase().includes(q);
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
          Community templates
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Template Catalog</h1>
        <p className="text-[#555] max-w-md mx-auto text-sm leading-relaxed">
          Real project plans shared by the community. Pick one, customize, and generate your plan in seconds.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-slideUp" style={{ animationDelay: "80ms" }}>
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#333]">
          {templates.length === 0 ? (
            <div>
              <p className="text-white text-sm font-medium mb-2">No community templates yet</p>
              <p className="text-[#444] text-xs">Be the first — create a project and make it public.</p>
            </div>
          ) : (
            <p className="text-sm">No templates match &ldquo;{search}&rdquo;</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => {
            const color = colorFor(t.id);
            const plan = t.ai_response;
            const taskCount = plan?.deliverables.flatMap((d) => d.tasks).length ?? 0;
            const monthlyCost = plan?.cost_breakdown.total_monthly_usd;
            const days = plan?.timeline_days;

            return (
              <div
                key={t.id}
                className="group bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#252525] hover-lift transition-all animate-slideUp flex flex-col"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-wide flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}20`, color }}
                  >
                    {initials(t.title)}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1.5">{t.title}</h3>
                <p className="text-xs text-[#444] leading-relaxed mb-4 flex-1 line-clamp-2">
                  {t.description || t.raw_prompt}
                </p>

                {/* Stats */}
                {plan && (
                  <div className="flex items-center gap-3 mb-4 text-[10px] text-[#333]">
                    {taskCount > 0 && <span>{taskCount} tasks</span>}
                    {monthlyCost != null && monthlyCost > 0 && <span>${monthlyCost}/mo</span>}
                    {days && <span>~{days} days</span>}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-[#111]">
                  <button
                    onClick={() => useTemplate(t.raw_prompt)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150 active:scale-95"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}20`,
                      color,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${color}20`;
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `${color}12`;
                      (e.currentTarget as HTMLElement).style.borderColor = `${color}20`;
                    }}
                  >
                    Use this template
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
