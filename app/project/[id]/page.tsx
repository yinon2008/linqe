"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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
  tablet: "768px",
  mobile: "375px",
};

const STREAM_TIMEOUT_MS = 90_000;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [status, setStatus] = useState<"streaming" | "done" | "error">("streaming");
  const [streamedChars, setStreamedChars] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [fixedCss, setFixedCss] = useState<string | null>(null);
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

        if (data.chunk) {
          setStreamedChars((n) => n + (data.chunk as string).length);
        }

        if (data.log) {
          setLogs((prev) => [...prev, data.log as string]);
        }

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
      } catch {
        // ignore parse errors on individual events
      }
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
      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="bg-[#0a0a0a] border border-red-900/50 rounded-2xl p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-white font-semibold mb-1">Generation failed</p>
          <p className="text-[#555] text-sm mb-6">{errorMsg}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] transition-colors"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  if (status === "streaming" || !plan) {
    return <GenerationLogs logs={logs} streamedChars={streamedChars} />;
  }

  const allTasks = plan.deliverables.flatMap((d) => d.tasks);

  function handleDeviceChange(mode: DeviceMode) {
    setDeviceMode(mode);
    setFixedCss(null);
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-6 mx-auto" style={{ maxWidth: DEVICE_MAX_WIDTHS[deviceMode], transition: "max-width 0.3s ease" }}>
      {fixedCss && <style>{fixedCss}</style>}

      {/* Header */}
      <div className="mb-6" style={{ animation: "slideUp 0.4s ease-out" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{plan.project_title}</h1>
            <p className="text-[#555] mt-2 max-w-2xl text-sm leading-relaxed">{plan.project_description}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-[#0d0d0d] border border-[#1a1a1a] text-xs text-[#666]">
              Ready in {plan.timeline_days} days
            </span>
            <Badge status="building" label="building" />
          </div>
        </div>

        {/* Device toolbar + auto-fix */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <DeviceToolbar mode={deviceMode} onChange={handleDeviceChange} />
            {deviceMode !== "desktop" && (
              <span className="text-[10px] text-[#333] uppercase tracking-wider">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Deliverables</h2>
            <DeliverableList deliverables={plan.deliverables} />
          </div>
          <CostSummary cost={plan.cost_breakdown} projectId={id} />
        </div>

        {/* Right panel — tasks */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Task Checklist</h2>
              <span className="text-xs text-[#444]">{allTasks.length} tasks</span>
            </div>

            <div className="space-y-2">
              {plan.deliverables.map((deliverable) => (
                <div key={deliverable.id}>
                  <p className="text-xs text-[#333] uppercase tracking-wider mb-2 mt-4 first:mt-0 font-medium">
                    {deliverable.title}
                  </p>
                  {deliverable.tasks.map((task, idx) => (
                    <TaskCard key={task.id} task={task} index={idx} projectId={id} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Launch checklist — the twist */}
          <LaunchChecklist tasks={allTasks} projectId={id} />
        </div>
      </div>
    </div>
  );
}
