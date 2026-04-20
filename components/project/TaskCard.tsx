"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";

const ROUTING_URLS: Record<string, string> = {
  domain:   "https://www.namecheap.com/domains/",
  payment:  "https://dashboard.stripe.com/register",
  email:    "https://resend.com/signup",
  database: "https://supabase.com/dashboard",
  hosting:  "https://vercel.com/new",
  social:   "https://business.facebook.com/",
  api:      "",
};

const CONNECT_LABELS: Record<string, string> = {
  domain:   "Connect Domain",
  payment:  "Connect Stripe",
  database: "Setup Supabase",
  hosting:  "Deploy to Vercel",
  email:    "Setup Email",
  social:   "Connect Instagram",
  api:      "Connect API",
};

function ServiceIcon({ type }: { type: string }) {
  switch (type) {
    case "domain":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
        </svg>
      );
    case "payment":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "database":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      );
    case "hosting":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case "email":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "social":
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}

interface TaskCardProps {
  task: Task;
  index: number;
  projectId: string;
  budgetRemaining?: number | null;
  editMode?: boolean;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, index, projectId: _projectId, budgetRemaining, editMode, onDelete }: TaskCardProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const overBudget = budgetRemaining != null && task.estimated_cost_usd > budgetRemaining;
  const routeUrl = ROUTING_URLS[task.automation_type] ?? "";

  async function triggerConnect() {
    if (status !== "pending") return;
    setStatus("connecting");

    try {
      const res = await fetch(`/api/tasks/${task.id}/connect`, { method: "POST" });
      if (!res.ok) { setStatus("failed"); return; }

      const start = Date.now();
      const interval = setInterval(async () => {
        if (Date.now() - start > 15_000) {
          clearInterval(interval);
          setStatus("failed");
          return;
        }
        try {
          const check = await fetch(`/api/tasks/${task.id}/status`);
          if (check.ok) {
            const { status: dbStatus } = await check.json();
            if (dbStatus === "connected" || dbStatus === "failed") {
              clearInterval(interval);
              setStatus(dbStatus);
            }
          }
        } catch { /* ignore */ }
      }, 1000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div
      className={`border rounded-xl p-4 transition-all duration-200 hover-lift group ${
        overBudget
          ? "bg-[#0d0800] border-[#2a1a00]"
          : status === "connected"
          ? "bg-[#050d05] border-[#1a2a1a]"
          : status === "failed"
          ? "bg-[#0d0505] border-[#2a1a1a]"
          : "bg-[#0a0a0a] border-[#141414] hover:border-[#252525]"
      }`}
      style={{ animation: `slideUp 0.35s ease-out both`, animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {status === "connecting" ? (
            <Spinner size="sm" className="text-[#38BDF8]" />
          ) : status === "connected" ? (
            <div className="w-5 h-5 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : status === "failed" ? (
            <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerConnect}
              className="w-5 h-5 rounded-md border border-[#2a2a2a] bg-transparent hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/5 transition-all cursor-pointer"
              aria-label="Mark as complete"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className={`text-sm font-medium leading-snug transition-all duration-300 ${
              status === "connected" ? "text-[#333] line-through" : "text-white"
            }`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2">
              {overBudget && (
                <span className="text-[9px] text-amber-400/80 border border-amber-400/20 bg-amber-400/5 px-1.5 py-0.5 rounded">
                  over budget
                </span>
              )}
              <span className={`text-xs font-mono flex-shrink-0 tabular-nums ${overBudget ? "text-amber-400/60" : "text-[#2a2a2a]"}`}>
                ${task.estimated_cost_usd.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#3a3a3a] mt-1 leading-relaxed">{task.description}</p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Service connect button */}
            {task.automation_type !== "none" && status === "pending" && (
              routeUrl ? (
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#38BDF8]/6 border border-[#38BDF8]/12 text-[#38BDF8]/60 hover:text-[#38BDF8] hover:border-[#38BDF8]/25 hover:bg-[#38BDF8]/10 transition-all duration-150"
                >
                  <ServiceIcon type={task.automation_type} />
                  {CONNECT_LABELS[task.automation_type] ?? "Connect"}
                </a>
              ) : (
                <button
                  onClick={triggerConnect}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#38BDF8]/6 border border-[#38BDF8]/12 text-[#38BDF8]/60 hover:text-[#38BDF8] hover:border-[#38BDF8]/25 hover:bg-[#38BDF8]/10 active:scale-95 transition-all duration-150"
                >
                  <ServiceIcon type={task.automation_type} />
                  {CONNECT_LABELS[task.automation_type] ?? "Auto-connect"}
                </button>
              )
            )}

            {/* Edit mode delete */}
            {editMode && onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-400/50 hover:text-red-400 hover:bg-red-400/5 transition-all"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            )}
          </div>

          {status === "connecting" && (
            <p className="mt-2 text-xs text-[#38BDF8]/50" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}>
              Setting up...
            </p>
          )}
          {status === "connected" && (
            <p className="mt-2 text-xs text-green-500/50">Connected successfully</p>
          )}
          {status === "failed" && (
            <button
              onClick={() => setStatus("pending")}
              className="mt-2 text-xs text-red-400/60 hover:text-red-300 transition-colors underline underline-offset-2"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
