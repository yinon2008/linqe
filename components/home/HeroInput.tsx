"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ModelSelector } from "./ModelSelector";
import { QuickActions } from "./QuickActions";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase";

export function HeroInput() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("claude-opus-4-6");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (searchParams.get("prefill")) {
      const prefill = sessionStorage.getItem("linqe-prefill");
      if (prefill) {
        setPrompt(prefill);
        sessionStorage.removeItem("linqe-prefill");
      }
    }
  }, [searchParams]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        localStorage.setItem(
          "linqe-pending-project",
          JSON.stringify({ prompt: prompt.trim(), model })
        );
        router.push("/login");
        return;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Failed to start generation" }));
        throw new Error(error ?? "Failed to start generation");
      }

      const { projectId } = await res.json();
      router.push(`/project/${projectId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast(msg, "error");
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <form onSubmit={handleSubmit}>
        <div
          className={`flex items-end gap-3 bg-[#0d0d0d] rounded-2xl px-4 py-3 border transition-all duration-200 ${
            focused
              ? "border-[#38BDF8]/40 shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_0_24px_rgba(56,189,248,0.08)]"
              : "border-[#1e1e1e] hover:border-[#2a2a2a]"
          }`}
        >
          {/* Model selector */}
          <div className="flex-shrink-0 pb-0.5">
            <ModelSelector value={model} onChange={setModel} />
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-[#2a2a2a] flex-shrink-0 mb-0.5" />

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe what you want to build..."
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-[#444] text-sm resize-none outline-none leading-6 py-0.5 max-h-40"
            style={{ overflow: "hidden" }}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = "auto";
              const capped = Math.min(target.scrollHeight, 160);
              target.style.height = `${capped}px`;
              target.style.overflow = capped >= 160 ? "auto" : "hidden";
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={!prompt.trim() || loading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-[#38BDF8] text-black disabled:opacity-25 hover:bg-[#7DD3FC] transition-colors mb-0.5"
          >
            {loading ? (
              <Spinner size="sm" className="text-black" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </form>

      <QuickActions onSelect={(p) => setPrompt(p)} />
    </div>
  );
}
