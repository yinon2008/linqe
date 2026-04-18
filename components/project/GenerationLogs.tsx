"use client";

import Link from "next/link";

const ALL_STEPS = [
  "Analyzing your idea...",
  "Structuring deliverables...",
  "Calculating costs...",
  "Writing task details...",
  "Finalizing your plan...",
];

interface GenerationLogsProps {
  logs: string[];
  streamedChars: number;
}

export function GenerationLogs({ logs, streamedChars }: GenerationLogsProps) {
  // Determine which steps are done vs in progress
  const completedSet = new Set(logs.slice(0, -1)); // everything except the last = done
  const current = logs[logs.length - 1] ?? null;

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"
                  style={{
                    animation: `pulse-dot 1.2s ease-in-out ${i * 200}ms infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-sm text-[#888]">Generating your project plan</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {ALL_STEPS.map((step) => {
            const isDone = completedSet.has(step);
            const isActive = current === step;
            const isPending = !isDone && !isActive;

            return (
              <div key={step} className="flex items-center gap-3">
                {/* Icon */}
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  {isDone ? (
                    <svg className="w-4 h-4 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <span
                      className="w-2 h-2 rounded-full bg-[#38BDF8] block"
                      style={{ animation: "pulse-dot 1s ease-in-out infinite" }}
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#222] block" />
                  )}
                </div>

                {/* Label */}
                <p
                  className={`text-sm transition-colors duration-300 ${
                    isDone
                      ? "text-[#38BDF8]"
                      : isActive
                      ? "text-white"
                      : isPending
                      ? "text-[#333]"
                      : "text-[#555]"
                  }`}
                >
                  {step.replace("...", isDone ? "" : isActive ? "..." : "")}
                </p>
              </div>
            );
          })}
        </div>

        {/* Char counter */}
        {streamedChars > 0 && (
          <p className="mt-8 text-xs text-[#333] font-mono tabular-nums">
            {streamedChars.toLocaleString()} characters received
          </p>
        )}
      </div>
    </div>
  );
}
