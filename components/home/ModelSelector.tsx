"use client";

import { useState } from "react";

const MODELS = [
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", speed: "Medium", dot: "bg-amber-400" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", speed: "Fast", dot: "bg-[#38BDF8]" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", speed: "Fastest", dot: "bg-emerald-400" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = MODELS.find((m) => m.id === value) ?? MODELS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-[#555] hover:text-[#888] transition-colors whitespace-nowrap px-1"
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selected.dot}`} />
        <span className="font-medium text-[#bbb]">{selected.label}</span>
        <span className="text-[#555]">({selected.speed})</span>
        <svg
          className={`w-3.5 h-3.5 text-[#444] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-[#111] border border-[#1e1e1e] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-sm z-50 overflow-hidden animate-scaleIn">
          {MODELS.map((model) => {
            const isSelected = model.id === value;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onChange(model.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                  isSelected ? "bg-[#0f1a1f]" : "hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${model.dot}`} />
                  <span className={`font-medium ${isSelected ? "text-white" : "text-[#ddd]"}`}>
                    {model.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#0d0d0d] border border-[#2a2a2a] text-[#555]">
                    {model.speed}
                  </span>
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
