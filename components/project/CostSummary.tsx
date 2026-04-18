"use client";

import { useState } from "react";
import { CostBreakdown } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";

interface CostSummaryProps {
  cost: CostBreakdown;
  projectId: string;
}

export function CostSummary({ cost, projectId }: CostSummaryProps) {
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const toast = useToast();

  async function handleLaunch() {
    if (launching || launched) return;
    setLaunching(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/launch`, { method: "POST" });
      if (res.ok) {
        setLaunched(true);
      } else {
        const { error } = await res.json().catch(() => ({ error: "Launch failed" }));
        toast(error ?? "Launch failed", "error");
      }
    } catch {
      toast("Network error — please try again.", "error");
    } finally {
      setLaunching(false);
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">Cost Summary</h3>

      {cost.monthly_recurring.length > 0 && (
        <div>
          <p className="text-[10px] text-[#333] uppercase tracking-widest mb-2.5 font-medium">Monthly</p>
          <div className="space-y-2">
            {cost.monthly_recurring.map((item) => (
              <div key={item.item} className="flex justify-between items-center text-sm">
                <span className="text-[#555]">{item.item}</span>
                <span className="text-white font-mono text-xs">${item.cost_usd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cost.one_time.length > 0 && (
        <div>
          <p className="text-[10px] text-[#333] uppercase tracking-widest mb-2.5 font-medium">One-time</p>
          <div className="space-y-2">
            {cost.one_time.map((item) => (
              <div key={item.item} className="flex justify-between items-center text-sm">
                <span className="text-[#555]">{item.item}</span>
                <span className="text-white font-mono text-xs">${item.cost_usd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-[#111] pt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#555]">Monthly total</span>
          <span className="text-white font-mono text-xs font-semibold">${cost.total_monthly_usd.toFixed(2)}/mo</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#555]">One-time total</span>
          <span className="text-white font-mono text-xs font-semibold">${cost.total_one_time_usd.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleLaunch}
        disabled={launching || launched}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          launched
            ? "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 cursor-default"
            : "bg-white text-black hover:bg-gray-100 disabled:opacity-40"
        }`}
      >
        {launching ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Launching…
          </span>
        ) : launched ? (
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Project launched
          </span>
        ) : (
          "Launch Project"
        )}
      </button>
    </div>
  );
}
