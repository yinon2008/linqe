"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const ALL_STEPS = [
  { label: "Analyzing your idea",     icon: "🔍" },
  { label: "Structuring deliverables", icon: "📐" },
  { label: "Calculating costs",        icon: "💰" },
  { label: "Writing task details",     icon: "✏️" },
  { label: "Finalizing your plan",     icon: "✨" },
];

const STEP_MESSAGES = ALL_STEPS.map((s) => s.label + "...");

interface GenerationLogsProps {
  logs: string[];
  streamedChars: number;
}

export function GenerationLogs({ logs, streamedChars }: GenerationLogsProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const completedSet = new Set(logs.slice(0, -1));
  const current = logs[logs.length - 1] ?? null;

  const completedCount = logs.length > 0 ? Math.min(logs.length - 1, ALL_STEPS.length) : 0;
  const progressPct = Math.round((completedCount / ALL_STEPS.length) * 100);

  const elapsedStr =
    elapsed < 60
      ? `${elapsed}s`
      : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;

  return (
    <div className="pt-24 px-6 max-w-xl mx-auto animate-fadeIn">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-0.5 bg-[#111] w-full">
          <div
            className="h-full bg-[#38BDF8] transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"
                    style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 200}ms infinite` }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#888] font-medium">Building your project plan</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#333] font-mono tabular-nums">{elapsedStr}</span>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-[#444] hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Cancel
              </Link>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-1">
            {ALL_STEPS.map((step, idx) => {
              const logMsg = STEP_MESSAGES[idx];
              const isDone    = completedSet.has(logMsg);
              const isActive  = current === logMsg;
              const isPending = !isDone && !isActive;
              const isNext    = !isDone && !isActive && idx === completedCount;

              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-colors duration-300 ${
                    isActive ? "bg-[#38BDF8]/5 border border-[#38BDF8]/10" : ""
                  }`}
                >
                  {/* Step indicator */}
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path className="check-draw" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center justify-center">
                        <span
                          className="w-2 h-2 rounded-full bg-[#38BDF8]"
                          style={{ animation: "pulse-dot 0.9s ease-in-out infinite" }}
                        />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isNext ? "border-[#2a2a2a]" : "border-[#1a1a1a]"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isNext ? "bg-[#333]" : "bg-[#1e1e1e]"}`} />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-sm transition-colors duration-500 ${
                      isDone   ? "text-[#38BDF8]" :
                      isActive ? "text-white font-medium" :
                      isNext   ? "text-[#444]" :
                                 "text-[#2a2a2a]"
                    }`}
                  >
                    {step.label}
                    {isActive && (
                      <span className="ml-1 text-[#38BDF8]/60" style={{ animation: "pulse-dot 1.2s ease-in-out infinite" }}>
                        ...
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer stats */}
          <div className="mt-8 pt-5 border-t border-[#111] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" style={{ animation: "pulse-dot 1.5s ease-in-out infinite" }} />
              <p className="text-xs text-[#444]">AI is thinking…</p>
            </div>
            {streamedChars > 0 && (
              <p className="text-xs text-[#333] font-mono tabular-nums">
                {streamedChars.toLocaleString()} chars
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[#2a2a2a] mt-4">
        This usually takes 15–30 seconds
      </p>
    </div>
  );
}
