"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import type { Task, TaskStatus } from "@/lib/types";

interface LaunchStep {
  task: Task;
  label: string;
  description: string;
  icon: React.ReactNode;
  critical: boolean;
}

interface LaunchChecklistProps {
  tasks: Task[];
  projectId: string;
}

const STEP_META: Record<string, { label: string; description: string; critical: boolean }> = {
  domain:  { label: "Connect Domain",     description: "Point your custom domain to this project",   critical: true  },
  payment: { label: "Payment Gateway",    description: "Accept payments via Stripe",                  critical: true  },
  hosting: { label: "Deploy to Vercel",   description: "Make your project live on the internet",      critical: true  },
  email:   { label: "Email Service",      description: "Set up transactional emails via Resend",      critical: false },
  database:{ label: "Database",           description: "Connect your Supabase database",              critical: false },
  api:     { label: "External API",       description: "Configure third-party API access",            critical: false },
};

const BUTTON_LABELS: Record<string, string> = {
  domain:  "Connect Domain",
  payment: "Connect Stripe",
  hosting: "Deploy to Vercel",
  email:   "Connect Resend",
  database:"Setup Supabase",
  api:     "Connect API",
};

function StepRow({
  step,
  onConnect,
}: {
  step: LaunchStep;
  onConnect: (taskId: string) => void;
}) {
  const { task, label, description, critical } = step;

  return (
    <div className={`flex items-center justify-between gap-4 py-4 border-b border-[#111] last:border-0 ${task.status === "connected" ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Status icon */}
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
          {task.status === "connected" ? (
            <svg className="w-4 h-4 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : task.status === "connecting" ? (
            <Spinner size="sm" className="text-[#38BDF8]" />
          ) : task.status === "failed" ? (
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            step.icon
          )}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${task.status === "connected" ? "text-[#555] line-through" : "text-white"}`}>
              {label}
            </p>
            {critical && task.status !== "connected" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-medium">
                required
              </span>
            )}
          </div>
          <p className="text-xs text-[#444] truncate">{description}</p>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        {task.status === "connected" ? (
          <span className="text-xs text-[#38BDF8] font-medium">Connected</span>
        ) : task.status === "connecting" ? (
          <span className="text-xs text-[#555]">Connecting…</span>
        ) : task.status === "failed" ? (
          <button
            onClick={() => onConnect(task.id)}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Retry
          </button>
        ) : (
          <button
            onClick={() => onConnect(task.id)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 hover:bg-[#38BDF8]/20 transition-colors whitespace-nowrap"
          >
            {BUTTON_LABELS[task.automation_type] ?? "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}

export function LaunchChecklist({ tasks, projectId }: LaunchChecklistProps) {
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() =>
    Object.fromEntries(tasks.map((t) => [t.id, t.status]))
  );
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  // Only show tasks that have a real automation type
  const launchTasks = tasks.filter((t) => t.automation_type !== "none");
  if (launchTasks.length === 0) return null;

  const steps: LaunchStep[] = launchTasks.map((task) => {
    const meta = STEP_META[task.automation_type] ?? {
      label: task.title,
      description: task.description,
      critical: false,
    };
    return {
      task: { ...task, status: statuses[task.id] },
      label: meta.label,
      description: meta.description,
      critical: meta.critical,
      icon: <AutomationIcon type={task.automation_type} />,
    };
  });

  const connectedCount = steps.filter((s) => statuses[s.task.id] === "connected").length;
  const criticalSteps = steps.filter((s) => s.critical);
  const allCriticalDone = criticalSteps.every((s) => statuses[s.task.id] === "connected");
  const progressPct = launchTasks.length > 0 ? (connectedCount / launchTasks.length) * 100 : 0;

  async function handleConnect(taskId: string) {
    setStatuses((prev) => ({ ...prev, [taskId]: "connecting" }));

    try {
      const res = await fetch(`/api/tasks/${taskId}/connect`, { method: "POST" });
      if (!res.ok) {
        setStatuses((prev) => ({ ...prev, [taskId]: "failed" }));
        return;
      }

      const start = Date.now();
      const interval = setInterval(async () => {
        if (Date.now() - start > 15_000) {
          clearInterval(interval);
          setStatuses((prev) => ({ ...prev, [taskId]: "failed" }));
          return;
        }
        try {
          const check = await fetch(`/api/tasks/${taskId}/status`);
          if (check.ok) {
            const { status: dbStatus } = await check.json();
            if (dbStatus === "connected" || dbStatus === "failed") {
              clearInterval(interval);
              setStatuses((prev) => ({ ...prev, [taskId]: dbStatus }));
            }
          }
        } catch {
          // ignore transient errors
        }
      }, 1000);
    } catch {
      setStatuses((prev) => ({ ...prev, [taskId]: "failed" }));
    }
  }

  async function handleLaunch() {
    if (launching || launched) return;
    setLaunching(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/launch`, { method: "POST" });
      if (res.ok) {
        setLaunched(true);
      }
    } finally {
      setLaunching(false);
    }
  }

  return (
    <div
      className="mt-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden"
      style={{ animation: "slideUp 0.5s ease-out" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#111]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">Launch checklist</h2>
            <p className="text-xs text-[#444] mt-0.5">
              {connectedCount} of {launchTasks.length} steps complete
            </p>
          </div>
          {launched ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#38BDF8]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Live
            </span>
          ) : null}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-[#111] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#38BDF8] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="px-6">
        {steps.map((step) => (
          <StepRow key={step.task.id} step={step} onConnect={handleConnect} />
        ))}
      </div>

      {/* Launch button */}
      {!launched && (
        <div className="px-6 pb-6 pt-4">
          <button
            onClick={handleLaunch}
            disabled={launching || !allCriticalDone}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              allCriticalDone
                ? "bg-[#38BDF8] text-black hover:bg-[#7DD3FC]"
                : "bg-[#111] text-[#333] border border-[#1a1a1a] cursor-not-allowed"
            }`}
          >
            {launching ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Launching…
              </span>
            ) : allCriticalDone ? (
              "Launch Project"
            ) : (
              "Complete required steps to launch"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function AutomationIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 text-[#333]";
  switch (type) {
    case "domain":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );
    case "payment":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    case "hosting":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
        </svg>
      );
    case "email":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      );
    case "database":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}
