"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskCard } from "@/components/project/TaskCard";
import { GenerationLogs } from "@/components/project/GenerationLogs";
import { LaunchChecklist } from "@/components/project/LaunchChecklist";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { createClient } from "@/lib/supabase";
import type { ProjectPlan, DesignSettings, AutomationType } from "@/lib/types";

const STREAM_TIMEOUT_MS = 90_000;
const LIVE_PREVIEW_MODE = process.env.NEXT_PUBLIC_LIVE_PREVIEW_MODE === "true";
const DELIVERABLE_COLORS = [
  "#38BDF8", "#A78BFA", "#34D399", "#FB923C",
  "#F472B6", "#FBBF24", "#60A5FA", "#F87171",
];

const EXAMPLE_PROMPTS = [
  "Build a todo app with dark mode",
  "Create a landing page for a coffee shop",
  "Make a pomodoro timer with sound",
];

const PUBLISH_CATEGORIES = ["Web App", "Landing Page", "Dashboard", "E-commerce", "Portfolio", "Tool", "Game", "Other"];

// ── HTML preview generator (legacy / non-live mode) ───────────────────────────
function generateProjectHtml(plan: ProjectPlan, accent: string): string {
  const initial = plan.project_title.trim().charAt(0).toUpperCase();

  const featureCards = plan.deliverables.slice(0, 6).map((d, i) => {
    const icons = [
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
      `<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="${accent}" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    ];
    return `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:1rem;padding:1.5rem;transition:box-shadow .2s"
           onmouseover="this.style.boxShadow='0 4px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='none'">
        <div style="width:2.5rem;height:2.5rem;border-radius:.625rem;background:${accent}12;
             display:flex;align-items:center;justify-content:center;margin-bottom:1rem;">
          ${icons[i % icons.length]}
        </div>
        <div style="font-weight:600;font-size:.9375rem;color:#111827;margin-bottom:.4rem;">${d.title}</div>
        <div style="color:#6b7280;font-size:.8125rem;line-height:1.65;">${d.description.slice(0, 120)}${d.description.length > 120 ? "…" : ""}</div>
      </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${plan.project_title}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;background:#f9fafb;color:#111827;line-height:1.6}
  nav{position:fixed;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;
      padding:.875rem 2rem;border-bottom:1px solid #e5e7eb;background:rgba(255,255,255,.92);
      backdrop-filter:blur(12px);z-index:100}
  .logo{font-weight:700;font-size:1rem;color:#111827;letter-spacing:-.01em}
  .nav-cta{padding:.5rem 1.25rem;border-radius:9999px;background:${accent};
            color:#fff;font-weight:600;font-size:.8125rem;border:none;cursor:pointer}
  .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;
        justify-content:center;padding:7rem 2rem 5rem;text-align:center;background:#fff}
  .logo-circle{width:5rem;height:5rem;border-radius:9999px;background:${accent}18;
               border:2px solid ${accent}30;display:flex;align-items:center;justify-content:center;
               font-size:2rem;font-weight:700;color:${accent};margin:0 auto 1.75rem;letter-spacing:-.02em}
  h1{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;line-height:1.08;
     letter-spacing:-.03em;color:#111827;margin-bottom:.875rem;max-width:34rem}
  .tagline{color:#6b7280;font-size:1rem;max-width:30rem;margin:0 auto .375rem;font-weight:400}
  .sub{color:#9ca3af;font-size:.875rem;max-width:28rem;margin:0 auto 2.25rem;line-height:1.7}
  .hero-cta{display:inline-flex;align-items:center;gap:.5rem;padding:.8125rem 2rem;
            border-radius:9999px;background:${accent};color:#fff;font-weight:600;
            font-size:.9375rem;border:none;cursor:pointer;box-shadow:0 4px 14px ${accent}40;transition:.15s}
  .hero-cta:hover{opacity:.9;transform:translateY(-1px)}
  .features{padding:5rem 2rem;background:#f9fafb}
  .features-inner{max-width:62rem;margin:0 auto}
  .section-eyebrow{text-align:center;font-size:.6875rem;font-weight:700;letter-spacing:.1em;
                   text-transform:uppercase;color:${accent};margin-bottom:.875rem}
  .section-title{text-align:center;font-size:1.75rem;font-weight:800;color:#111827;margin-bottom:.5rem;letter-spacing:-.02em}
  .section-sub{text-align:center;color:#9ca3af;font-size:.875rem;margin-bottom:3rem}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
  .cta-section{padding:5rem 2rem;text-align:center;background:#fff;border-top:1px solid #f3f4f6}
  .cta-section h2{font-size:2rem;font-weight:800;color:#111827;margin-bottom:.875rem;letter-spacing:-.025em}
  .cta-section p{color:#6b7280;margin-bottom:2rem;font-size:.9375rem;max-width:26rem;margin-left:auto;margin-right:auto}
  footer{border-top:1px solid #f3f4f6;padding:1.75rem 2rem;text-align:center;color:#d1d5db;font-size:.75rem}
</style>
</head>
<body>
<nav>
  <span class="logo">${plan.project_title.split(" ").slice(0, 2).join(" ")}</span>
  <div style="display:flex;gap:1.5rem;align-items:center">
    <span style="color:#9ca3af;font-size:.8125rem;cursor:pointer">Features</span>
    <span style="color:#9ca3af;font-size:.8125rem;cursor:pointer">Pricing</span>
    <button class="nav-cta">Get Started</button>
  </div>
</nav>

<section class="hero">
  <div class="logo-circle">${initial}</div>
  <h1>${plan.project_title}</h1>
  <p class="tagline">${plan.project_description.split(".")[0].trim()}.</p>
  <p class="sub">${plan.project_description.slice(0, 130)}${plan.project_description.length > 130 ? "…" : ""}</p>
  <button class="hero-cta">Get Started Free →</button>
</section>

<section class="features">
  <div class="features-inner">
    <div class="section-eyebrow">Why choose ${plan.project_title.split(" ")[0]}?</div>
    <h2 class="section-title">Everything you need to launch</h2>
    <p class="section-sub">${plan.deliverables.length} deliverables · ${plan.deliverables.reduce((s, d) => s + d.tasks.length, 0)} tasks · ~${plan.timeline_days} days to go live</p>
    <div class="grid">${featureCards}</div>
  </div>
</section>

<section class="cta-section">
  <h2>Ready to get started?</h2>
  <p>Launch your project in ${plan.timeline_days} days or less.</p>
  <button class="hero-cta">Start Building →</button>
</section>

<footer>${plan.project_title} · Built with Linqe</footer>
</body>
</html>`;
}

// ── Inject an error reporter into iframe HTML ─────────────────────────────────
function injectErrorListener(html: string): string {
  const script = `<script>window.onerror=function(msg,src,line){window.parent.postMessage({type:'iframe-error',message:msg,line:line},'*');return true;};<\/script>`;
  const idx = html.lastIndexOf("</body>");
  if (idx !== -1) return html.slice(0, idx) + script + html.slice(idx);
  return html + script;
}

// ── Chat message type ─────────────────────────────────────────────────────────
interface ChatMsg {
  role: "user" | "ai";
  content: string;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  // Streaming / generation
  const [plan, setPlan]                   = useState<ProjectPlan | null>(null);
  const [status, setStatus]               = useState<"streaming" | "done" | "error">("streaming");
  const [streamedChars, setStreamedChars] = useState(0);
  const [logs, setLogs]                   = useState<string[]>([]);
  const [errorMsg, setErrorMsg]           = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Project metadata
  const [designSettings, setDesignSettings] = useState<DesignSettings>({ color: "#38BDF8", font: "default" });
  const [projectStatus, setProjectStatus]   = useState<string>("building");

  // IDE tabs
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "tasks">("preview");

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput]       = useState("");
  const [chatLoading, setChatLoading]   = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Tasks edit (non-live mode)
  const [editMode, setEditMode]         = useState(false);
  const [showAddTask, setShowAddTask]   = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc]   = useState("");
  const [newTaskType, setNewTaskType]   = useState<AutomationType>("none");
  const [newTaskCost, setNewTaskCost]   = useState("0");
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);

  // Publish modal
  const [publishOpen, setPublishOpen]           = useState(false);
  const [publishTitle, setPublishTitle]         = useState("");
  const [publishDesc, setPublishDesc]           = useState("");
  const [publishCategory, setPublishCategory]   = useState("Other");
  const [publishLoading, setPublishLoading]     = useState(false);
  const [publishDone, setPublishDone]           = useState(false);

  // Live preview state
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [iframeHtml, setIframeHtml]       = useState<string>("");
  const [htmlVersions, setHtmlVersions]   = useState<string[]>([]);
  const [iframeError, setIframeError]     = useState<string>("");
  const [codeCopied, setCodeCopied]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Draggable divider
  const [chatWidth, setChatWidth] = useState(300);
  const dragStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const updatePreview = useCallback((html: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setIframeHtml(html), 400);
  }, []);

  // ── Effects ───────────────────────────────────────────────────────────────

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Draggable divider
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragStartRef.current) return;
      const delta = e.clientX - dragStartRef.current.startX;
      const w = Math.max(200, Math.min(600, dragStartRef.current.startWidth + delta));
      setChatWidth(w);
    }
    function onMouseUp() {
      if (!dragStartRef.current) return;
      dragStartRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Iframe error listener
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "iframe-error") {
        setIframeError(String(e.data.message ?? "Unknown error"));
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setChatCollapsed(false);
        setTimeout(() => chatInputRef.current?.focus(), 50);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Stream — initial generation
  useEffect(() => {
    if (!id) return;
    const es = new EventSource(`/api/generate/stream?id=${id}`);
    timeoutRef.current = setTimeout(() => {
      es.close(); setStatus("error"); setErrorMsg("Generation timed out. Please try again.");
    }, STREAM_TIMEOUT_MS);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (LIVE_PREVIEW_MODE) {
          // ── live preview events ──────────────────────────────────────────
          if (data.log) setLogs((prev) => [...prev, data.log as string]);
          // htmlChunk ignored during streaming — show result only when done
          if (data.done && data.html) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            es.close();
            const html = data.html as string;
            if (debounceRef.current) clearTimeout(debounceRef.current);
            setGeneratedHtml(html);
            setHtmlVersions([html]);
            setIframeHtml(html);
            setStatus("done");
            setChatMessages([{
              role: "ai",
              content: `Your app is live in the preview! Try clicking around.\n\nTell me what to change — "add dark mode", "make the button bigger", or anything else.`,
            }]);
          }
          if (data.error) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            es.close(); setStatus("error"); setErrorMsg(data.error);
          }
        } else {
          // ── project plan events ──────────────────────────────────────────
          if (data.chunk) setStreamedChars((n) => n + (data.chunk as string).length);
          if (data.log)   setLogs((prev) => [...prev, data.log as string]);
          if (data.done && data.plan) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            es.close();
            const p = data.plan as ProjectPlan;
            setPlan(p);
            setStatus("done");
            setChatMessages([{
              role: "ai",
              content: `I've built your **${p.project_title}** plan — ${p.deliverables.length} deliverables, ${p.deliverables.reduce((s: number, d: { tasks: unknown[] }) => s + d.tasks.length, 0)} tasks, ~${p.timeline_days} days to launch. The preview is live on the right.\n\nTell me what to change — add a feature, adjust the scope, or refine the cost breakdown.`,
            }]);
          }
          if (data.error) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            es.close(); setStatus("error"); setErrorMsg(data.error);
          }
        }
      } catch { /* ignore */ }
    };

    es.onerror = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      es.close(); setStatus("error"); setErrorMsg("Connection lost. Please refresh or try again.");
    };

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); es.close(); };
  }, [id, updatePreview]);

  // Fetch metadata (non-live mode)
  useEffect(() => {
    if (status !== "done" || !id || LIVE_PREVIEW_MODE) return;
    supabase
      .from("projects")
      .select("design_settings, status")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setDesignSettings(data.design_settings ?? { color: "#38BDF8", font: "default" });
        setProjectStatus(data.status ?? "building");
      });
  }, [status, id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // ── Publish ───────────────────────────────────────────────────────────────
  async function handlePublish() {
    setPublishLoading(true);
    try {
      await fetch(`/api/projects/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: publishTitle,
          description: publishDesc,
          category: publishCategory,
        }),
      });
      setPublishDone(true);
    } catch {
      // silent — user can retry
    } finally {
      setPublishLoading(false);
    }
  }

  function openPublishModal() {
    setPublishTitle(LIVE_PREVIEW_MODE ? (plan?.project_title ?? "My App") : (plan?.project_title ?? "My App"));
    setPublishDesc(plan?.project_description ?? "");
    setPublishDone(false);
    setPublishOpen(true);
  }

  // ── sendChat ──────────────────────────────────────────────────────────────
  const sendChat = useCallback(async (overrideMsg?: string) => {
    const msg = (overrideMsg ?? chatInput).trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);
    setIframeError("");

    if (LIVE_PREVIEW_MODE) {
      // Save current as previous version before overwriting
      if (generatedHtml) {
        setHtmlVersions((prev) => [...prev, generatedHtml]);
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: msg, html: generatedHtml, projectId: id }),
        });

        if (!res.ok || !res.body) throw new Error("Chat request failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.htmlChunk) {
                updatePreview(data.htmlChunk as string);
              }
              if (data.done && data.html) {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                const html = data.html as string;
                setGeneratedHtml(html);
                setIframeHtml(html);
                setChatMessages((prev) => [...prev, {
                  role: "ai",
                  content: "Done! The app has been updated.",
                }]);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }
      } catch (err) {
        setChatMessages((prev) => [...prev, {
          role: "ai",
          content: "Something went wrong. Please try again.",
        }]);
      } finally {
        setChatLoading(false);
      }
    } else {
      // Placeholder for non-live mode
      await new Promise((r) => setTimeout(r, 1200));
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: `Got it! I've noted: "${msg}". Full AI editing coming soon — for now use Edit mode in the Tasks tab to manually adjust tasks.` },
      ]);
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, generatedHtml, id, updatePreview]);

  // ── Task helpers (non-live mode) ──────────────────────────────────────────
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
    setPlan({
      ...plan,
      deliverables: plan.deliverables.map((d) =>
        d.id === deliverableId
          ? { ...d, tasks: [...d.tasks, {
              id: `manual_${Date.now()}`,
              title: newTaskTitle.trim(),
              description: newTaskDesc.trim(),
              status: "pending" as const,
              automation_type: newTaskType,
              estimated_cost_usd: parseFloat(newTaskCost) || 0,
            }]}
          : d
      ),
    });
    setNewTaskTitle(""); setNewTaskDesc(""); setNewTaskType("none"); setNewTaskCost("0");
    setShowAddTask(null);
  }

  function undoHtml() {
    if (htmlVersions.length < 2) return;
    const prev = htmlVersions[htmlVersions.length - 2];
    setHtmlVersions((vs) => vs.slice(0, -1));
    setGeneratedHtml(prev);
    setIframeHtml(prev);
    setIframeError("");
  }

  // ── Copy + Download helpers ───────────────────────────────────────────────
  async function copyCode() {
    await navigator.clipboard.writeText(generatedHtml);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function downloadCode() {
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "app.html"; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="pt-24 px-6 max-w-lg mx-auto">
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
            className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Streaming state (non-live mode only) ──────────────────────────────────
  if ((status === "streaming" && !LIVE_PREVIEW_MODE) || (!plan && !LIVE_PREVIEW_MODE)) {
    return <GenerationLogs logs={logs} streamedChars={streamedChars} />;
  }

  // ── Non-live mode derived values ──────────────────────────────────────────
  const allTasks       = plan ? plan.deliverables.flatMap((d) => d.tasks) : [];
  const completedTasks = allTasks.filter((t) => t.status === "connected").length;
  const accentColor    = designSettings.color;
  const previewHtml    = !LIVE_PREVIEW_MODE && plan ? generateProjectHtml(plan, accentColor) : "";
  const visibleDeliverables = selectedDeliverable && plan
    ? plan.deliverables.filter((d) => d.id === selectedDeliverable)
    : (plan?.deliverables ?? []);

  // ── Tab options ───────────────────────────────────────────────────────────
  const tabs = LIVE_PREVIEW_MODE
    ? [
        { id: "preview" as const, label: "Preview", icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )},
        { id: "code" as const, label: "Code", icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        )},
      ]
    : [
        { id: "preview" as const, label: "Preview", icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )},
        { id: "tasks" as const, label: "Tasks", icon: (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )},
      ];

  // ── IDE layout ────────────────────────────────────────────────────────────
  return (
    <div className="fixed left-0 right-0 bottom-0 flex flex-col" style={{ top: "61px", zIndex: 10, background: "#080808" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0 border-b border-[#141414]"
        style={{ height: "48px", background: "#0a0a0a" }}
      >
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-[#2a2a2a] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[#1e1e1e] text-sm">/</span>
          <span className="text-sm font-medium text-white truncate max-w-[220px]">
            {LIVE_PREVIEW_MODE ? "Live Preview" : (plan?.project_title ?? "Building…")}
          </span>
          <Badge status={projectStatus} label={projectStatus} />
        </div>

        {/* Center tabs */}
        <div className="flex items-center gap-0.5 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#1a1a1a] text-white shadow-sm"
                  : "text-[#333] hover:text-[#666]"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "tasks" && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1e1e1e] text-[#444] tabular-nums">
                  {allTasks.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Undo (live mode, multiple versions) */}
          {LIVE_PREVIEW_MODE && htmlVersions.length > 1 && (
            <button
              onClick={undoHtml}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#333] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white transition-all"
              title="Undo last change"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </button>
          )}

          {/* Progress (non-live) */}
          {!LIVE_PREVIEW_MODE && (
            <>
              <span className="text-[11px] text-[#2a2a2a] tabular-nums hidden md:inline">
                {completedTasks}/{allTasks.length} done
              </span>
              <div className="w-16 h-0.5 bg-[#111] rounded-full overflow-hidden hidden md:block">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0}%`, background: accentColor }}
                />
              </div>
            </>
          )}

          {/* Publish */}
          {(iframeHtml || generatedHtml || plan) && (
            <button
              onClick={openPublishModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] hover:bg-[#38BDF8]/20 transition-all"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Publish
            </button>
          )}

          {/* Open in new tab */}
          {activeTab === "preview" && (iframeHtml || previewHtml) && (
            <button
              onClick={() => {
                const html = LIVE_PREVIEW_MODE ? iframeHtml : previewHtml;
                const win = window.open("", "_blank");
                win?.document.write(html);
                win?.document.close();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#333] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white transition-all"
              title="Open preview in new tab"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open
            </button>
          )}

          {/* Code tab: copy + download */}
          {activeTab === "code" && generatedHtml && (
            <>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#333] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white transition-all"
              >
                {codeCopied ? (
                  <svg className="w-3 h-3 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {codeCopied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadCode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#333] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white transition-all"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </>
          )}

          {/* Edit mode (tasks tab, non-live) */}
          {activeTab === "tasks" && !LIVE_PREVIEW_MODE && (
            <button
              onClick={() => setEditMode((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                editMode
                  ? "bg-[#1a1a1a] text-white border-[#2a2a2a]"
                  : "text-[#333] border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-white"
              }`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {editMode ? "Done" : "Edit"}
            </button>
          )}
        </div>
      </div>

      {/* ── Main split ───────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Chat panel ─────────────────────────────────────────────────── */}
        {chatCollapsed ? (
          <div
            className="flex flex-col items-center py-3 border-r border-[#141414] flex-shrink-0"
            style={{ width: "40px", background: "#090909" }}
          >
            <button
              onClick={() => setChatCollapsed(false)}
              className="text-[#222] hover:text-white transition-colors p-1"
              title="Open chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col border-r border-[#141414] flex-shrink-0"
            style={{ width: `${chatWidth}px`, background: "#090909" }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#111] flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white">Linqe AI</span>
              </div>
              <button
                onClick={() => setChatCollapsed(true)}
                className="text-[#1e1e1e] hover:text-[#555] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {/* Generation progress (live mode, streaming) */}
              {LIVE_PREVIEW_MODE && chatMessages.length === 0 && status === "streaming" && (
                <div className="flex flex-col gap-2 pt-2">
                  {(logs.length === 0 ? ["Generating your app..."] : logs).map((log, i) => (
                    <div key={i} className="flex justify-start">
                      <div className="w-5 h-5 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                        {i === logs.length - 1 ? (
                          <svg className="w-3 h-3 text-[#38BDF8] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-[#38BDF8]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className={`max-w-[85%] rounded-xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed bg-[#0d0d0d] border border-[#1a1a1a] ${
                        i === logs.length - 1 ? "text-[#888]" : "text-[#333]"
                      }`}>
                        {log}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {chatMessages.length === 0 && status === "done" && LIVE_PREVIEW_MODE && (
                <div className="flex flex-col items-center gap-3 pt-4 pb-2">
                  <p className="text-[11px] text-[#333] text-center px-2">
                    Try asking me to modify the app:
                  </p>
                  <div className="flex flex-col gap-1.5 w-full">
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendChat(p)}
                        className="w-full text-left text-[11px] text-[#444] bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2 hover:border-[#2a2a2a] hover:text-white transition-all"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-5 h-5 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                      <svg className="w-3 h-3 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1a1a1a] text-white rounded-tr-sm"
                        : "bg-[#0d0d0d] border border-[#1a1a1a] text-[#888] rounded-tl-sm"
                    }`}
                  >
                    {msg.content.split("**").map((part, pi) =>
                      pi % 2 === 1
                        ? <strong key={pi} className="text-white font-semibold">{part}</strong>
                        : <span key={pi}>{part}</span>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded-md bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <svg className="w-3 h-3 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl rounded-tl-sm px-3 py-2.5 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full bg-[#38BDF8]/50"
                        style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 200}ms infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[#111] p-3 flex-shrink-0">
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-2.5 focus-within:border-[#38BDF8]/25 transition-colors">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault(); sendChat();
                    } else if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); sendChat();
                    }
                  }}
                  placeholder={LIVE_PREVIEW_MODE ? "Ask me to change anything..." : "Ask me to change anything..."}
                  rows={2}
                  className="w-full bg-transparent text-white text-xs resize-none focus:outline-none placeholder-[#2a2a2a] leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-[#1e1e1e]">⌘↵ to send · ⌘K to focus</span>
                  <button
                    onClick={() => sendChat()}
                    disabled={!chatInput.trim() || chatLoading}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] hover:bg-[#38BDF8]/20 disabled:opacity-30 transition-all"
                  >
                    {chatLoading ? <Spinner size="sm" /> : (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Draggable divider */}
        {!chatCollapsed && (
          <div
            className="w-1 flex-shrink-0 cursor-col-resize hover:bg-[#38BDF8]/20 transition-colors"
            style={{ background: "transparent" }}
            onMouseDown={(e) => {
              e.preventDefault();
              dragStartRef.current = { startX: e.clientX, startWidth: chatWidth };
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          />
        )}

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* iframe error banner */}
          {iframeError && activeTab === "preview" && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border-b border-red-900/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-xs text-red-400 truncate max-w-xs">{iframeError}</span>
              </div>
              <button
                onClick={() => sendChat(`Fix this error: ${iframeError}`)}
                className="flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-[#7DD3FC] transition-colors flex-shrink-0 ml-3"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Fix this
              </button>
            </div>
          )}

          {/* Preview tab */}
          {activeTab === "preview" && (
            <>
              {LIVE_PREVIEW_MODE && !iframeHtml && status === "streaming" ? (
                /* Loading state while HTML builds up */
                <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ background: "#060606" }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#38BDF8] animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-[#333]">
                      {logs[logs.length - 1] ?? "Launching preview…"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-64">
                    <Skeleton className="h-6 w-full rounded" />
                    <Skeleton className="h-3 w-4/5 rounded" />
                    <Skeleton className="h-3 w-3/5 rounded" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Skeleton className="h-20 rounded" />
                      <Skeleton className="h-20 rounded" />
                      <Skeleton className="h-20 rounded" />
                    </div>
                  </div>
                </div>
              ) : LIVE_PREVIEW_MODE && !iframeHtml && status === "done" ? (
                /* Empty state — app not yet started */
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6" style={{ background: "#060606" }}>
                  <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-white font-medium">What do you want to build?</p>
                  <p className="text-xs text-[#444] text-center max-w-xs">
                    Describe an app and it will appear here live as it generates.
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {EXAMPLE_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => sendChat(p)}
                        className="text-left text-xs text-[#555] bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl px-4 py-3 hover:border-[#2a2a2a] hover:text-white transition-all"
                      >
                        {p} →
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <iframe
                  srcDoc={LIVE_PREVIEW_MODE ? injectErrorListener(iframeHtml) : previewHtml}
                  className="flex-1 w-full border-0"
                  sandbox="allow-scripts allow-forms"
                  title="App preview"
                />
              )}
            </>
          )}

          {/* Code tab (live mode only) */}
          {activeTab === "code" && LIVE_PREVIEW_MODE && (
            <div className="flex-1 overflow-auto" style={{ background: "#060606" }}>
              {generatedHtml ? (
                <pre
                  className="text-xs leading-relaxed p-6 min-h-full"
                  style={{
                    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                    color: "#cdd6f4",
                    counterReset: "line",
                  }}
                >
                  {generatedHtml.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span
                        className="select-none text-right flex-shrink-0 text-[#313244]"
                        style={{ minWidth: "2.5rem" }}
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 whitespace-pre-wrap break-all text-[#cdd6f4]">
                        {line || " "}
                      </span>
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-[#333]">Generate an app to see its code here.</p>
                </div>
              )}
            </div>
          )}

          {/* Tasks tab (non-live mode) */}
          {activeTab === "tasks" && !LIVE_PREVIEW_MODE && (
            <div className="flex flex-1 min-h-0">
              {/* Deliverable sidebar */}
              <div
                className="border-r border-[#141414] flex flex-col flex-shrink-0 overflow-hidden"
                style={{ width: "200px", background: "#090909" }}
              >
                <div className="px-3 py-2.5 border-b border-[#111]">
                  <span className="text-[10px] font-semibold text-[#222] uppercase tracking-widest">Sections</span>
                </div>
                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
                  <button
                    onClick={() => setSelectedDeliverable(null)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                      !selectedDeliverable ? "bg-[#1a1a1a] text-white" : "text-[#333] hover:text-[#666] hover:bg-[#0d0d0d]"
                    }`}
                  >
                    <svg className="w-3 h-3 flex-shrink-0 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span className="text-[11px] font-medium flex-1">All tasks</span>
                    <span className="text-[10px] text-[#2a2a2a] tabular-nums">{allTasks.length}</span>
                  </button>

                  <div className="h-px bg-[#0f0f0f] mx-1 my-1" />

                  {(plan?.deliverables ?? []).map((d, idx) => {
                    const color = DELIVERABLE_COLORS[idx % DELIVERABLE_COLORS.length];
                    const done  = d.tasks.filter((t) => t.status === "connected").length;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDeliverable(d.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                          selectedDeliverable === d.id ? "bg-[#1a1a1a] text-white" : "text-[#333] hover:text-[#666] hover:bg-[#0d0d0d]"
                        }`}
                      >
                        <div
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ background: color + "20", border: `1px solid ${color}40` }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full" style={{ background: color }} />
                          </div>
                        </div>
                        <span className="text-[11px] truncate flex-1">{d.title}</span>
                        <span className="text-[10px] text-[#2a2a2a] tabular-nums flex-shrink-0">
                          {done > 0 ? `${done}/` : ""}{d.tasks.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Cost footer */}
                {plan && (
                  <div className="border-t border-[#111] p-3 flex-shrink-0">
                    <p className="text-[10px] text-[#222] uppercase tracking-widest mb-1.5">Est. cost</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-white font-semibold text-base tabular-nums">
                        ${plan.cost_breakdown.total_monthly_usd.toFixed(0)}
                      </span>
                      <span className="text-[#2a2a2a] text-[11px]">/mo</span>
                    </div>
                    {plan.cost_breakdown.total_one_time_usd > 0 && (
                      <p className="text-[#2a2a2a] text-[10px] mt-0.5">
                        + ${plan.cost_breakdown.total_one_time_usd.toFixed(0)} once
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Task list */}
              <div className="flex-1 overflow-y-auto" style={{ background: "#060606" }}>
                <div className="max-w-2xl mx-auto px-6 py-5 space-y-6">
                  {visibleDeliverables.map((deliverable) => {
                    const idx   = (plan?.deliverables ?? []).indexOf(deliverable);
                    const color = DELIVERABLE_COLORS[idx % DELIVERABLE_COLORS.length];
                    return (
                      <div key={deliverable.id}>
                        {!selectedDeliverable && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            <p className="text-[10px] text-[#2a2a2a] uppercase tracking-widest font-semibold">{deliverable.title}</p>
                            <div className="flex-1 h-px bg-[#0d0d0d]" />
                          </div>
                        )}
                        <div className="space-y-2">
                          {deliverable.tasks.map((task, i) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={i}
                              projectId={id}
                              budgetRemaining={null}
                              editMode={editMode}
                              onDelete={deleteTask}
                            />
                          ))}
                        </div>
                        {editMode && (
                          showAddTask === deliverable.id ? (
                            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl p-4 mt-3 space-y-3 animate-slideDown">
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
                                className="w-full bg-transparent text-[#555] text-xs border-b border-[#1a1a1a] outline-none pb-1"
                              />
                              <div className="flex items-center gap-2">
                                <select
                                  value={newTaskType}
                                  onChange={(e) => setNewTaskType(e.target.value as AutomationType)}
                                  className="flex-1 bg-[#111] border border-[#1e1e1e] text-[#666] text-xs rounded-lg px-2 py-1.5"
                                >
                                  <option value="none">No automation</option>
                                  <option value="domain">Domain</option>
                                  <option value="payment">Payment (Stripe)</option>
                                  <option value="email">Email</option>
                                  <option value="database">Database</option>
                                  <option value="hosting">Hosting</option>
                                  <option value="social">Social</option>
                                  <option value="api">API</option>
                                </select>
                                <div className="relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#444] text-xs">$</span>
                                  <input
                                    type="number" min="0"
                                    value={newTaskCost}
                                    onChange={(e) => setNewTaskCost(e.target.value)}
                                    className="w-20 bg-[#111] border border-[#1e1e1e] text-white text-xs rounded-lg pl-5 pr-2 py-1.5"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => addTask(deliverable.id)} disabled={!newTaskTitle.trim()}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-[#e5e5e5] disabled:opacity-40">
                                  Add task
                                </button>
                                <button onClick={() => setShowAddTask(null)} className="px-3 py-1.5 text-xs text-[#555] hover:text-white">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setShowAddTask(deliverable.id)}
                              className="mt-3 flex items-center gap-1.5 text-[10px] text-[#1e1e1e] hover:text-[#444] transition-colors">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              Add task
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}

                  {plan && <LaunchChecklist tasks={allTasks} projectId={id} onLaunch={() => setProjectStatus("live")} />}
                  <div className="h-6" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Publish Modal ────────────────────────────────────────────────── */}
      {publishOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setPublishOpen(false); }}
        >
          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl w-full max-w-md mx-4 overflow-hidden">
            {publishDone ? (
              /* Success state */
              <div className="p-8 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Published to the catalog!</p>
                  <p className="text-[#444] text-xs">Your app is now visible to everyone in the Linqe community.</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <a
                    href="/examples"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-medium hover:bg-[#38BDF8]/20 transition-all"
                  >
                    View in catalog →
                  </a>
                  <button
                    onClick={() => setPublishOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#1a1a1a] text-[#555] text-xs hover:text-white transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Publish form */
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-white font-semibold text-sm">Publish to Catalog</h2>
                    <p className="text-[#444] text-xs mt-0.5">Share your app with the Linqe community</p>
                  </div>
                  <button onClick={() => setPublishOpen(false)} className="text-[#333] hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wide">App name</label>
                    <input
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      placeholder="My awesome app"
                      className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#38BDF8]/30 transition-colors"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wide">Description</label>
                    <textarea
                      value={publishDesc}
                      onChange={(e) => setPublishDesc(e.target.value)}
                      placeholder="What does this app do?"
                      rows={2}
                      className="w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl px-3 py-2 text-white text-sm placeholder-[#333] focus:outline-none focus:border-[#38BDF8]/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] text-[#555] mb-1.5 uppercase tracking-wide">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {PUBLISH_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPublishCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                            publishCategory === cat
                              ? "bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]"
                              : "bg-[#0d0d0d] border border-[#1a1a1a] text-[#444] hover:text-[#666]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deploy checklist */}
                  <div className="bg-[#080808] border border-[#141414] rounded-xl p-3">
                    <p className="text-[11px] text-[#444] mb-2.5 uppercase tracking-wide">After publishing</p>
                    <div className="space-y-2">
                      {[
                        { icon: "🌐", label: "Add a custom domain", hint: "Namecheap, GoDaddy, Google Domains" },
                        { icon: "🚀", label: "Deploy to the web", hint: "Netlify Drop, GitHub Pages, Vercel" },
                        { icon: "📊", label: "Add analytics", hint: "Google Analytics, Plausible" },
                        { icon: "📧", label: "Set up email capture", hint: "Mailchimp, ConvertKit, Resend" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-2.5">
                          <span className="text-sm mt-0.5">{item.icon}</span>
                          <div>
                            <p className="text-xs text-[#555]">{item.label}</p>
                            <p className="text-[10px] text-[#333]">{item.hint}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handlePublish}
                    disabled={!publishTitle.trim() || publishLoading}
                    className="w-full py-2.5 rounded-xl bg-[#38BDF8] text-black text-sm font-semibold hover:bg-[#7DD3FC] disabled:opacity-40 transition-all"
                  >
                    {publishLoading ? "Publishing…" : "Publish to catalog →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
