"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Project } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProjects(data ?? []);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
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
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const completedProjects = projects.filter((p) => p.status === "live").length;
  const totalCost = projects.reduce((sum, p) => {
    const cost = (p.ai_response as any)?.cost_breakdown?.total_monthly_usd ?? 0;
    return sum + cost;
  }, 0);

  return (
    <div className="pt-24 pb-20 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slideUp">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-sm text-[#333] mt-0.5">
            {user?.email?.split("@")[0] && (
              <span className="text-[#444]">
                Welcome back, <span className="text-white">{user.email?.split("@")[0]}</span>
              </span>
            )}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New project
        </Link>
      </div>

      {/* Stats bar */}
      {projects.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8 animate-slideUp" style={{ animationDelay: "60ms" }}>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-2xl font-bold text-white mb-0.5">{projects.length}</p>
            <p className="text-xs text-[#333]">Total projects</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-2xl font-bold text-white mb-0.5">{completedProjects}</p>
            <p className="text-xs text-[#333]">Completed</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4">
            <p className="text-2xl font-bold text-white mb-0.5">
              {totalCost > 0 ? `$${totalCost.toFixed(0)}` : "—"}
            </p>
            <p className="text-xs text-[#333]">Est. monthly costs</p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-xs text-[#333] mb-4 animate-slideUp" style={{ animationDelay: "80ms" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  const QUICK = ["Landing page", "SaaS tool", "Mobile app", "Automation"];

  return (
    <div className="flex flex-col items-center justify-center py-28 text-center animate-scaleIn">
      <div className="w-16 h-16 rounded-2xl bg-[#0d0d0d] border border-[#1e1e1e] flex items-center justify-center mb-6 glow-accent-pulse">
        <svg className="w-7 h-7 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>

      <h2 className="text-white font-bold text-xl mb-2">No projects yet</h2>
      <p className="text-[#333] text-sm mb-8 max-w-xs leading-relaxed">
        Describe an idea and get a complete project plan with cost estimates and launch checklist in seconds.
      </p>

      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] transition-colors mb-10"
      >
        Build your first project
      </Link>

      <div className="space-y-2 text-center">
        <p className="text-[#222] text-xs mb-3">Or start with a template</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {QUICK.map((label, i) => (
            <Link
              key={label}
              href="/examples"
              className="px-3 py-1.5 text-xs text-[#333] border border-[#1a1a1a] rounded-full hover:border-[#38BDF8]/30 hover:text-[#888] transition-all animate-slideUp"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cost = (project.ai_response as any)?.cost_breakdown?.total_monthly_usd;
  const deliverableCount = (project.ai_response as any)?.deliverables?.length ?? 0;
  const taskCount = (project.ai_response as any)?.deliverables?.reduce(
    (sum: number, d: any) => sum + (d.tasks?.length ?? 0), 0
  ) ?? 0;
  const date = new Date(project.created_at);
  const isToday = Date.now() - date.getTime() < 1000 * 60 * 60 * 24;
  const dateStr = isToday
    ? "Today"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <Link href={`/project/${project.id}`}>
      <div
        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] hover-lift transition-all group animate-slideUp cursor-pointer h-full flex flex-col"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-white line-clamp-2 flex-1 pr-2 leading-snug">
            {project.title === "Generating..." ? (
              <span className="text-[#333] italic">Generating…</span>
            ) : project.title || "Untitled Project"}
          </h3>
          <Badge status={project.status} label={project.status} />
        </div>

        {/* Description */}
        <p className="text-xs text-[#333] line-clamp-2 mb-4 leading-relaxed flex-1">
          {project.description || project.raw_prompt}
        </p>

        {/* Meta chips */}
        {(deliverableCount > 0 || taskCount > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {deliverableCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#111] border border-[#1a1a1a] text-[10px] text-[#444]">
                {deliverableCount} deliverable{deliverableCount !== 1 ? "s" : ""}
              </span>
            )}
            {taskCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#111] border border-[#1a1a1a] text-[10px] text-[#444]">
                {taskCount} tasks
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#0f0f0f]">
          <div className="flex items-center gap-2">
            {cost != null && (
              <span className="text-xs text-[#38BDF8]/60 font-mono">${cost.toFixed(0)}/mo</span>
            )}
            {cost != null && <span className="text-[#1a1a1a]">·</span>}
            <span className="text-xs text-[#2a2a2a]">{dateStr}</span>
          </div>
          <span className="text-xs text-[#2a2a2a] group-hover:text-[#38BDF8] transition-colors flex items-center gap-1">
            Open
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
