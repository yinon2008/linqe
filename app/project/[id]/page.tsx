"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskCard } from "@/components/project/TaskCard";
import { CostSummary } from "@/components/project/CostSummary";
import { DeliverableList } from "@/components/project/DeliverableList";
import { GenerationLogs } from "@/components/project/GenerationLogs";
import { LaunchChecklist } from "@/components/project/LaunchChecklist";
import { DeviceToolbar } from "@/components/project/DeviceToolbar";
import { AutoFixBanner } from "@/components/project/AutoFixBanner";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase";
import type { ProjectPlan, DesignSettings, AutomationType } from "@/lib/types";
import type { DeviceMode } from "@/components/project/DeviceToolbar";

const DEVICE_MAX_WIDTHS: Record<DeviceMode, string> = {
  desktop: "80rem",
  tablet:  "768px",
  mobile:  "375px",
};

const ACCENT_COLORS = [
  { label: "Cyan",   value: "#38BDF8" },
  { label: "Purple", value: "#A78BFA" },
  { label: "Green",  value: "#34D399" },
  { label: "Orange", value: "#FB923C" },
  { label: "Pink",   value: "#F472B6" },
];

const FONT_OPTIONS: { label: string; value: DesignSettings["font"]; css: string }[] = [
  { label: "Default", value: "default", css: "inherit" },
  { label: "Mono",    value: "mono",    css: "'Geist Mono', monospace" },
  { label: "Serif",   value: "serif",   css: "Georgia, serif" },
];

const STREAM_TIMEOUT_MS = 90_000;

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  // Streaming state
  const [plan, setPlan]                   = useState<ProjectPlan | null>(null);
  const [status, setStatus]               = useState<"streaming" | "done" | "error">("streaming");
  const [streamedChars, setStreamedChars] = useState(0);
  const [logs, setLogs]                   = useState<string[]>([]);
  const [errorMsg, setErrorMsg]           = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Device
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [fixedCss, setFixedCss]     = useState<string | null>(null);

  // Project metadata
  const [isPublic, setIsPublic]           = useState(false);
  const [budget, setBudget]               = useState<number | null>(null);
  const [designSettings, setDesignSettings] = useState<DesignSettings>({ color: "#38BDF8", font: "default" });
  const [projectStatus, setProjectStatus] = useState<string>("building");

  // Edit mode
  const [editMode, setEditMode]     = useState(false);
  const [editTitle, setEditTitle]   = useState("");
  const [editDesc, setEditDesc]     = useState("");
  const [saving, setSaving]         = useState(false);
  const [showAddTask, setShowAddTask] = useState<string | null>(null); // deliverable id
  const [newTaskTitle, setNewTaskTitle]   = useState("");
  const [newTaskDesc, setNewTaskDesc]     = useState("");
  const [newTaskType, setNewTaskType]     = useState<AutomationType>("none");
  const [newTaskCost, setNewTaskCost]     = useState("0");

  // Stream
  useEffect(() => {
    if (!id) return;
    const es = new EventSource(`/api/generate/stream?id=${id}`);
    timeoutRef.current = setTimeout(() => {
      es.close(); setStatus("error"); setErrorMsg("Generation timed out. Please try again.");
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
          es.close(); setStatus("error"); setErrorMsg(data.error);
        }
      } catch { /* ignore */ }
    };

    es.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      es.close(); setStatus("error"); setErrorMsg("Connection lost. Please refresh or try again.");
    };

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); es.close(); };
  }, [id]);

  // Fetch project metadata after streaming done
  useEffect(() => {
    if (status !== "done" || !id) return;
    supabase
      .from("projects")
      .select("is_public, budget_usd, design_settings, status")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setIsPublic(data.is_public ?? false);
        setBudget(data.budget_usd ?? null);
        setDesignSettings(data.design_settings ?? { color: "#38BDF8", font: "default" });
        setProjectStatus(data.status ?? "building");
      });
  }, [status, id]);

  // Init edit fields from plan
  useEffect(() => {
    if (plan) {
      setEditTitle(plan.project_title);
      setEditDesc(plan.project_description);
    }
  }, [plan]);

  const accentColor = designSettings.color;
  const fontFamily  = FONT_OPTIONS.find((f) => f.value === designSettings.font)?.css ?? "inherit";

  async function saveEdits() {
    if (!plan) return;
    setSaving(true);
    const updatedPlan: ProjectPlan = {
      ...plan,
      project_title: editTitle,
      project_description: editDesc,
    };
    await supabase.from("projects").update({
      title: editTitle,
      description: editDesc,
      is_public: isPublic,
      budget_usd: budget,
      design_settings: designSettings,
      ai_response: updatedPlan,
    }).eq("id", id);
    setPlan(updatedPlan);
    setSaving(false);
    setEditMode(false);
  }

  function deleteTask(taskId: string) {
    if (!plan) return;
    setPlan({
      ...plan,
      deliverables: plan.deliverables.map((d) => ({
        ...d,
        tasks: d.tasks.filter((t) => t.id !== taskId),
      })),
    });
  }

  function addTask(deliverableId: string) {
    if (!plan || !newTaskTitle.trim()) return;
    const newTask = {
      id: `manual_${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: "pending" as const,
      automation_type: newTaskType,
      estimated_cost_usd: parseFloat(newTaskCost) || 0,
    };
    setPlan({
      ...plan,
      deliverables: plan.deliverables.map((d) =>
        d.id === deliverableId ? { ...d, tasks: [...d.tasks, newTask] } : d
      ),
    });
    setNewTaskTitle(""); setNewTaskDesc(""); setNewTaskType("none"); setNewTaskCost("0");
    setShowAddTask(null);
  }

  const totalCost = plan
    ? (plan.cost_breakdown.total_monthly_usd + plan.cost_breakdown.total_one_time_usd)
    : 0;
  const budgetRemaining = budget != null ? budget - totalCost : null;

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

  return (
    <div
      className="pt-24 pb-20 px-4 md:px-6 mx-auto"
      style={{
        maxWidth: DEVICE_MAX_WIDTHS[deviceMode],
        transition: "max-width 0.35s cubic-bezier(0.4,0,0.2,1)",
        fontFamily,
      }}
    >
      {fixedCss && <style>{fixedCss}</style>}

      {/* Header */}
      <div className="mb-8 animate-slideUp">
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
            {editMode ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-bold bg-transparent text-white border-b border-[#2a2a2a] focus:border-[#38BDF8]/40 outline-none pb-1 mb-3"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {plan.project_title}
              </h1>
            )}
            {editMode ? (
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="w-full bg-transparent text-[#555] text-sm border border-[#1e1e1e] rounded-xl px-3 py-2 focus:outline-none focus:border-[#38BDF8]/30 resize-none mt-2"
              />
            ) : (
              <p className="text-[#444] mt-2 text-sm leading-relaxed max-w-2xl">{plan.project_description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <span className="px-3 py-1.5 rounded-full bg-[#0d0d0d] border border-[#1a1a1a] text-xs text-[#555]">
              ~{plan.timeline_days} days
            </span>
            <Badge status={projectStatus} label={projectStatus} />

            {/* Edit toggle */}
            {editMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditMode(false); setEditTitle(plan.project_title); setEditDesc(plan.project_description); }}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#555] border border-[#1e1e1e] hover:border-[#333] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdits}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-[#e5e5e5] disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {saving ? (
                    <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin inline-block" />
                  ) : null}
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1.5 rounded-lg text-xs text-[#555] border border-[#1e1e1e] hover:border-[#333] hover:text-white transition-all flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Edit mode panel */}
        {editMode && (
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 mb-5 space-y-5 animate-slideDown">
            {/* Public toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">Public template</p>
                <p className="text-xs text-[#444] mt-0.5">Show this project in the community Template Catalog</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic((v) => !v)}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${isPublic ? "bg-[#38BDF8]" : "bg-[#222]"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-all duration-200 ${isPublic ? "translate-x-4 bg-black" : "translate-x-0 bg-[#555]"}`} />
              </button>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs text-[#444] mb-1.5 font-medium">Budget (USD)</label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  placeholder="e.g. 500"
                  value={budget ?? ""}
                  onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full pl-7 pr-4 py-2.5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl text-white text-sm focus:outline-none focus:border-[#38BDF8]/30 transition-colors"
                />
              </div>
              {budget != null && (
                <p className={`text-xs mt-1.5 ${budgetRemaining != null && budgetRemaining < 0 ? "text-amber-400" : "text-[#444]"}`}>
                  Estimated total: ${totalCost.toFixed(0)} · {budgetRemaining != null && budgetRemaining >= 0 ? `$${budgetRemaining.toFixed(0)} remaining` : "Over budget"}
                </p>
              )}
            </div>

            {/* Accent color */}
            <div>
              <p className="text-xs text-[#444] mb-2 font-medium">Accent color</p>
              <div className="flex items-center gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setDesignSettings((s) => ({ ...s, color: c.value }))}
                    className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
                    style={{ background: c.value, outline: designSettings.color === c.value ? `2px solid ${c.value}` : "none", outlineOffset: "2px" }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <p className="text-xs text-[#444] mb-2 font-medium">Font style</p>
              <div className="flex items-center gap-2">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setDesignSettings((s) => ({ ...s, font: f.value }))}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      designSettings.font === f.value
                        ? "border-[#38BDF8]/40 text-white bg-[#38BDF8]/8"
                        : "border-[#1e1e1e] text-[#555] hover:border-[#333]"
                    }`}
                    style={{ fontFamily: f.css }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Task progress bar */}
        {allTasks.length > 0 && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-0.5 bg-[#111] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(completedTasks / allTasks.length) * 100}%`, background: accentColor }}
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
            <DeviceToolbar mode={deviceMode} onChange={(m) => { setDeviceMode(m); setFixedCss(null); }} />
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
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={idx}
                      projectId={id}
                      budgetRemaining={budgetRemaining}
                      editMode={editMode}
                      onDelete={deleteTask}
                    />
                  ))}

                  {/* Add task in edit mode */}
                  {editMode && (
                    showAddTask === deliverable.id ? (
                      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 mt-2 space-y-3">
                        <input
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task title"
                          className="w-full bg-transparent text-white text-sm border-b border-[#1e1e1e] focus:border-[#38BDF8]/30 outline-none pb-1"
                        />
                        <input
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Description (optional)"
                          className="w-full bg-transparent text-[#555] text-xs border-b border-[#1a1a1a] focus:border-[#333] outline-none pb-1"
                        />
                        <div className="flex items-center gap-2">
                          <select
                            value={newTaskType}
                            onChange={(e) => setNewTaskType(e.target.value as AutomationType)}
                            className="flex-1 bg-[#111] border border-[#1e1e1e] text-[#666] text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                          >
                            <option value="none">No automation</option>
                            <option value="domain">Domain</option>
                            <option value="payment">Payment (Stripe)</option>
                            <option value="email">Email</option>
                            <option value="database">Database</option>
                            <option value="hosting">Hosting</option>
                            <option value="social">Instagram / Social</option>
                            <option value="api">API</option>
                          </select>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                            <input
                              type="number"
                              min="0"
                              value={newTaskCost}
                              onChange={(e) => setNewTaskCost(e.target.value)}
                              className="w-20 bg-[#111] border border-[#1e1e1e] text-white text-xs rounded-lg pl-5 pr-2 py-1.5 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addTask(deliverable.id)}
                            disabled={!newTaskTitle.trim()}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-[#e5e5e5] disabled:opacity-40 transition-all"
                          >
                            Add task
                          </button>
                          <button
                            onClick={() => setShowAddTask(null)}
                            className="px-3 py-1.5 rounded-lg text-xs text-[#555] hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAddTask(deliverable.id)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-[#333] hover:text-[#666] transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add task
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slideUp" style={{ animationDelay: "140ms" }}>
            <LaunchChecklist tasks={allTasks} projectId={id} onLaunch={() => setProjectStatus("live")} />
          </div>
        </div>
      </div>
    </div>
  );
}
