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
      if (!res.ok) {
        setStatus("failed");
        return;
      }

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
        } catch {
          // ignore transient errors
        }
      }, 1000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div
      className="bg-[#0a0a0a] border border-[#141414] rounded-xl p-4 transition-all duration-200 hover:border-[#222]"
      style={{
        animationDelay: `${index * 40}ms`,
        animation: "slideUp 0.4s ease-out both",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {status === "connecting" ? (
            <Spinner size="sm" className="text-[#38BDF8]" />
          ) : status === "connected" ? (
            <div className="w-5 h-5 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
              className="w-5 h-5 rounded-md border border-[#2a2a2a] bg-transparent hover:border-[#38BDF8]/40 transition-colors cursor-pointer"
              aria-label="Mark as complete"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p
              className={`text-sm font-medium leading-snug ${
                status === "connected" ? "text-[#444] line-through" : "text-white"
              }`}
            >
              {task.title}
            </p>
            <span className="text-xs text-[#333] font-mono flex-shrink-0">
              ${task.estimated_cost_usd.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-[#444] mt-1 leading-relaxed">{task.description}</p>

          {/* Auto-connect button */}
          {task.automation_type !== "none" && status === "pending" && (
            <button
              onClick={triggerConnect}
              className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#38BDF8]/8 border border-[#38BDF8]/15 text-[#38BDF8]/70 hover:text-[#38BDF8] hover:border-[#38BDF8]/30 hover:bg-[#38BDF8]/12 transition-all"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {AUTO_CONNECT_LABELS[task.automation_type] ?? "Auto-connect"}
            </button>
          )}

          {status === "failed" && (
            <button
              onClick={() => setStatus("pending")}
              className="mt-2.5 text-xs text-red-400/70 hover:text-red-300 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
