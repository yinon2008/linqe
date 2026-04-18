"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskCard } from "@/components/project/TaskCard";
import { CostSummary } from "@/components/project/CostSummary";
import { DeliverableList } from "@/components/project/DeliverableList";
import { GenerationLogs } from "@/components/project/GenerationLogs";
import { LaunchChecklist } from "@/components/project/LaunchChecklist";
import { DeviceToolbar } from "@/components/project/DeviceToolbar";
import { AutoFixBanner } from "@/components/project/AutoFixBanner";
import { Badge } from "@/components/ui/Badge";
import type { ProjectPlan } from "@/lib/types";
import type { DeviceMode } from "@/components/project/DeviceToolbar";

const DEVICE_MAX_WIDTHS: Record<DeviceMode, string> = {
  desktop: "80rem",
  tablet:  "768px",
  mobile:  "375px",
};

const STREAM_TIMEOUT_MS = 90_000;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [plan, setPlan]               = useState<ProjectPlan | null>(null);
  const [status, setStatus]           = useState<"streaming" | "done" | "error">("streaming");
  const [streamedChars, setStreamedChars] = useState(0);
  const [logs, setLogs]               = useState<string[]>([]);
  const [errorMsg, setErrorMsg]       = useState("");
  const [deviceMode, setDeviceMode]   = useState<DeviceMode>("desktop");
  const [fixedCss, setFixedCss]       = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) return;

    const es = new EventSource(`/api/generate/stream?id=${id}`);

    timeoutRef.current = setTimeout(() => {
      es.close();
      setStatus("error");
      setErrorMsg("Generation timed out. Please try again.");
    }, STREAM_TIMEOUT_MS);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.chunk) setStreamedChars((n) => n + (data.chunk as string).length);
        if (data.log)   setLogs((prev) => [...prev, data.log as string]);
        if (data.done && data.plan) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          es.close();
          setPlan(data.plan as ProjectPlan);
          setStatus("done");
        }
        if (data.error) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          es.close();
          setStatus("error");
          setErrorMsg(data.error);
        }
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      es.close();
      setStatus("error");
      setErrorMsg("Connection lost. Please refresh or try again.");
    };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      es.close();
    };
  }, [id]);

  if (status === "error") {
    return (
      <div className="pt-24 px-6 max-w-lg mx-auto animate-scaleIn">
        <div className="bg-[#0a0a0a] border border-red-900/40 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-2">Generation failed</p>
          <p className="text-[#444] text-sm mb-7 leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (status === "streaming" || !plan) {
    return <GenerationLogs logs={logs} streamedChars={streamedChars} />;
  }

  const allTasks = plan.deliverables.flatMap((d) => d.tasks);
  const completedTasks = allTasks.filter((t) => t.status === "connected").length;

  function handleDeviceChange(mode: DeviceMode) {
    setDeviceMode(mode);
    setFixedCss(null);
  }

  return (
    <div
      className="pt-24 pb-20 px-4 md:px-6 mx-auto"
      style={{ maxWidth: DEVICE_MAX_WIDTHS[deviceMode], transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)" }}
    >
      {fixedCss && <style>{fixedCss}</style>}

      {/* Header */}
      <div className="mb-8 animate-slideUp">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5 text-xs text-[#444] hover:text-white transition-colors mb-5 group"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{plan.project_title}</h1>
            <p className="text-[#444] mt-2 text-sm leading-relaxed max-w-2xl">{plan.project_description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-[#0d0d0d] border border-[#1a1a1a] text-xs text-[#555]">
              ~{plan.timeline_days} days
            </span>
            <Badge status="building" label="building" />
          </div>
        </div>

        {/* Task progress bar */}
        {allTasks.length > 0 && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-0.5 bg-[#111] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#38BDF8] rounded-full transition-all duration-700"
                style={{ width: `${(completedTasks / allTasks.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#444] tabular-nums flex-shrink-0">
              {completedTasks}/{allTasks.length} tasks
            </span>
          </div>
        )}

        {/* Device toolbar */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <DeviceToolbar mode={deviceMode} onChange={handleDeviceChange} />
            {deviceMode !== "desktop" && (
              <span className="text-[10px] text-[#2a2a2a] uppercase tracking-wider">
                {deviceMode === "mobile" ? "375px" : "768px"} viewport
              </span>
            )}
          </div>
          {deviceMode !== "desktop" && (
            <AutoFixBanner
              deviceMode={deviceMode}
              plan={plan}
              onFixApplied={(css) => setFixedCss(css)}
              onUndo={() => setFixedCss(null)}
              isApplied={!!fixedCss}
            />
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-slideUp" style={{ animationDelay: "60ms" }}>
            <h2 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-4">Deliverables</h2>
            <DeliverableList deliverables={plan.deliverables} />
          </div>
          <div className="animate-slideUp" style={{ animationDelay: "120ms" }}>
            <CostSummary cost={plan.cost_breakdown} projectId={id} />
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 animate-slideUp" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-[#666] uppercase tracking-wider">Task Checklist</h2>
              <span className="text-xs text-[#333] tabular-nums">{allTasks.length} tasks</span>
            </div>

            <div className="space-y-2">
              {plan.deliverables.map((deliverable) => (
                <div key={deliverable.id}>
                  <p className="text-[10px] text-[#2a2a2a] uppercase tracking-widest mb-2 mt-5 first:mt-0 font-semibold">
                    {deliverable.title}
                  </p>
                  {deliverable.tasks.map((task, idx) => (
                    <TaskCard key={task.id} task={task} index={idx} projectId={id} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slideUp" style={{ animationDelay: "140ms" }}>
            <LaunchChecklist tasks={allTasks} projectId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
