"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Category = "All" | "Web App" | "Landing Page" | "Dashboard" | "E-commerce" | "Portfolio" | "Tool" | "Game" | "Other";
const CATEGORIES: Category[] = ["All", "Web App", "Landing Page", "Dashboard", "E-commerce", "Portfolio", "Tool", "Game", "Other"];

interface PublicTemplate {
  id: string;
  title: string;
  description: string;
  raw_prompt: string;
  ai_response: { type?: string; content?: string } | null;
  category: string | null;
  published_at: string | null;
  views: number;
  remixes: number;
  author_name: string | null;
  created_at: string;
}

const COLORS = ["#38BDF8", "#A78BFA", "#34D399", "#FB923C", "#F472B6", "#FBBF24"];
function colorFor(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n += id.charCodeAt(i);
  return COLORS[n % COLORS.length];
}
function initials(title: string) {
  return title.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ExamplesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [templates, setTemplates] = useState<PublicTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [remixingId, setRemixingId] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, raw_prompt, ai_response, category, published_at, views, remixes, author_name, created_at")
        .eq("is_public", true)
        .order("published_at", { ascending: false })
        .limit(80);
      setTemplates((data as PublicTemplate[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.raw_prompt.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = filtered.filter((t) => (t.remixes ?? 0) > 0 || (t.views ?? 0) > 5).slice(0, 3);
  const rest = featured.length > 0 ? filtered.filter((t) => !featured.includes(t)) : filtered;

  async function handleRemix(t: PublicTemplate) {
    setRemixingId(t.id);
    try {
      // Increment view
      fetch(`/api/projects/${t.id}/view`, { method: "POST" });

      const res = await fetch(`/api/projects/${t.id}/remix`, { method: "POST" });
      const { projectId } = await res.json();
      if (projectId) router.push(`/project/${projectId}`);
    } catch {
      setRemixingId(null);
    }
  }

  function usePrompt(prompt: string) {
    sessionStorage.setItem("linqe-prefill", prompt);
    router.push("/?prefill=1");
  }

  const TemplateCard = ({ t, big = false }: { t: PublicTemplate; big?: boolean }) => {
    const color = colorFor(t.id);
    const isLivePreview = t.ai_response?.type === "html";
    const isRemixing = remixingId === t.id;

    return (
      <div
        className={`group bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl hover:border-[#252525] transition-all flex flex-col ${big ? "p-6" : "p-5"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: `${color}12`, border: `1px solid ${color}20`, color }}
          >
            {initials(t.title)}
          </div>
          <div className="flex items-center gap-2">
            {isLivePreview && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399]">
                Live app
              </span>
            )}
            {t.category && t.category !== "Other" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1a1a1a] text-[#444]">
                {t.category}
              </span>
            )}
          </div>
        </div>

        <h3 className={`font-semibold text-white mb-1.5 ${big ? "text-base" : "text-sm"}`}>{t.title}</h3>
        <p className="text-xs text-[#444] leading-relaxed mb-3 flex-1 line-clamp-2">
          {t.description || t.raw_prompt}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 text-[10px] text-[#2a2a2a]">
          {(t.views ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t.views}
            </span>
          )}
          {(t.remixes ?? 0) > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t.remixes} remixes
            </span>
          )}
          {t.author_name && (
            <span className="text-[#222]">by {t.author_name}</span>
          )}
          {(t.published_at || t.created_at) && (
            <span className="ml-auto text-[#1e1e1e]">{timeAgo(t.published_at || t.created_at)}</span>
          )}
        </div>

        {/* Prompt pill */}
        {showPrompt === t.id && (
          <div className="mb-3 p-2.5 bg-[#080808] border border-[#141414] rounded-xl">
            <p className="text-[11px] text-[#444] leading-relaxed">&ldquo;{t.raw_prompt}&rdquo;</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#111] flex gap-2">
          <button
            onClick={() => handleRemix(t)}
            disabled={isRemixing}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all active:scale-95"
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
            {isRemixing ? (
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {isRemixing ? "Opening…" : "Remix"}
          </button>

          <button
            onClick={() => usePrompt(t.raw_prompt)}
            className="px-3 py-2 rounded-lg text-xs text-[#333] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white transition-all"
            title="Use this prompt"
          >
            Use prompt
          </button>

          <button
            onClick={() => setShowPrompt(showPrompt === t.id ? null : t.id)}
            className="px-2 py-2 rounded-lg text-[#222] border border-[#141414] hover:border-[#1e1e1e] hover:text-[#444] transition-all"
            title="Show prompt"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 animate-slideUp">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block" />
          Community catalog
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Template Catalog</h1>
        <p className="text-[#555] max-w-md mx-auto text-sm leading-relaxed">
          Apps and projects shared by the community. Remix any of them and make it your own.
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
            placeholder="Search apps..."
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          {templates.length === 0 ? (
            <div>
              <p className="text-white text-sm font-medium mb-2">No apps published yet</p>
              <p className="text-[#444] text-xs">Be the first — build an app and click Publish.</p>
            </div>
          ) : (
            <p className="text-sm text-[#333]">No results for &ldquo;{search}&rdquo;</p>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured / trending */}
          {featured.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-3.5 h-3.5 text-[#FBBF24]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-xs font-semibold text-[#FBBF24]">Trending</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((t) => <TemplateCard key={t.id} t={t} big />)}
              </div>
            </div>
          )}

          {/* All */}
          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <p className="text-[11px] text-[#333] uppercase tracking-widest font-semibold mb-4">All apps</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map((t) => <TemplateCard key={t.id} t={t} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
