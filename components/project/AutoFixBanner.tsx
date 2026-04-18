"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import type { ProjectPlan } from "@/lib/types";
import type { DeviceMode } from "./DeviceToolbar";

interface AutoFixBannerProps {
  deviceMode: Exclude<DeviceMode, "desktop">;
  plan: ProjectPlan;
  onFixApplied: (css: string) => void;
  onUndo: () => void;
  isApplied: boolean;
}

export function AutoFixBanner({
  deviceMode,
  plan,
  onFixApplied,
  onUndo,
  isApplied,
}: AutoFixBannerProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const deviceLabel = deviceMode === "mobile" ? "Mobile" : "Tablet";

  async function handleAutoFix() {
    setStatus("loading");
    try {
      const res = await fetch("/api/autofix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceMode, projectPlan: plan }),
      });
      if (!res.ok) throw new Error("Auto-fix failed");
      const { cssRules } = await res.json();
      onFixApplied(cssRules);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (isApplied) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border border-[#38BDF8]/20 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Auto-fix applied for {deviceLabel}
        </div>
        <button
          onClick={onUndo}
          className="text-[#555] hover:text-white transition-colors"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl text-xs">
      <span className="text-[#555]">
        Layout may not be optimized for {deviceLabel}
      </span>
      <div className="flex items-center gap-3">
        {status === "error" && (
          <span className="text-red-400">Failed — </span>
        )}
        <button
          onClick={handleAutoFix}
          disabled={status === "loading"}
          className="flex items-center gap-1.5 text-[#38BDF8] hover:text-[#7DD3FC] transition-colors disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Spinner size="sm" className="text-[#38BDF8]" />
              Analyzing…
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {status === "error" ? "Retry auto-fix" : `Auto-fix for ${deviceLabel}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
