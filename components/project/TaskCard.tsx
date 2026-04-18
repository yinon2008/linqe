"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";

const AUTO_CONNECT_LABELS: Record<string, string> = {
  domain:   "Connect Domain",
  payment:  "Connect Stripe",
  database: "Setup Supabase",
  hosting:  "Deploy to Vercel",
  email:    "Setup Resend",
  api:      "Connect API",
};

const AUTO_CONNECT_ICONS: Record<string, string> = {
  domain:   "🌐",
  payment:  "💳",
  database: "🗄️",
  hosting:  "☁️",
  email:    "📧",
  api:      "🔌",
};

interface TaskCardProps {
  task: Task;
  index: number;
  projectId: string;
}

export function TaskCard({ task, index, projectId: _projectId }: TaskCardProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status);

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
        status === "connected"
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
                <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
            <span className="text-xs text-[#2a2a2a] font-mono flex-shrink-0 tabular-nums">
              ${task.estimated_cost_usd.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-[#3a3a3a] mt-1 leading-relaxed">{task.description}</p>

          {/* Auto-connect button */}
          {task.automation_type !== "none" && status === "pending" && (
            <button
              onClick={triggerConnect}
              className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#38BDF8]/6 border border-[#38BDF8]/12 text-[#38BDF8]/60 hover:text-[#38BDF8] hover:border-[#38BDF8]/25 hover:bg-[#38BDF8]/10 active:scale-95 transition-all duration-150"
            >
              <span className="text-[10px]">{AUTO_CONNECT_ICONS[task.automation_type] ?? "⚡"}</span>
              {AUTO_CONNECT_LABELS[task.automation_type] ?? "Auto-connect"}
            </button>
          )}

          {status === "connecting" && (
            <p className="mt-2 text-xs text-[#38BDF8]/50" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }}>
              Setting up…
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
