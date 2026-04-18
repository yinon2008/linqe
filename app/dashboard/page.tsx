"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Project } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setProjects(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slideUp">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          {projects.length > 0 && (
            <p className="text-sm text-[#444] mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          )}
        </div>
        <Link href="/">
          <Button variant="primary" size="md">+ New Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center animate-scaleIn">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center mb-6 glow-accent-pulse">
        <svg className="w-7 h-7 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>

      <h2 className="text-white font-semibold text-lg mb-2">No projects yet</h2>
      <p className="text-[#444] text-sm mb-8 max-w-xs leading-relaxed">
        Describe your idea and get a complete project plan, cost estimate, and launch checklist in seconds.
      </p>

      <Link href="/">
        <Button variant="primary">Build your first project</Button>
      </Link>

      {/* Quick prompts */}
      <div className="mt-10 flex flex-wrap justify-center gap-2 max-w-sm">
        {["Landing page", "Web app", "Lead system", "Automation"].map((label, i) => (
          <Link
            key={label}
            href="/"
            className="px-3 py-1.5 text-xs text-[#444] border border-[#1a1a1a] rounded-full hover:border-[#38BDF8]/30 hover:text-[#888] transition-all animate-slideUp"
            style={{ animationDelay: `${200 + i * 60}ms` }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cost = (project.ai_response as any)?.cost_breakdown?.total_monthly_usd;
  const date = new Date(project.created_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isRecent = Date.now() - date.getTime() < 1000 * 60 * 60 * 24; // < 24h

  return (
    <div
      className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] hover-lift transition-all group animate-slideUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 flex-1 pr-2 leading-snug">
          {project.title === "Generating..." ? (
            <span className="text-[#444] italic">Generating…</span>
          ) : project.title}
        </h3>
        <Badge status={project.status} label={project.status} />
      </div>

      <p className="text-xs text-[#444] line-clamp-2 mb-5 leading-relaxed">
        {project.description || project.raw_prompt}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[#111]">
        <div className="flex items-center gap-2">
          {cost != null && (
            <span className="text-xs text-[#333] font-mono">${cost.toFixed(2)}/mo</span>
          )}
          <span className="text-xs text-[#2a2a2a]">
            {isRecent ? "Today" : dateStr}
          </span>
        </div>
        <Link href={`/project/${project.id}`}>
          <button className="text-xs text-[#444] hover:text-[#38BDF8] transition-colors group-hover:text-[#555] flex items-center gap-1">
            Open
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
