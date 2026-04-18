"use client";

import { useState } from "react";

const MODELS = [
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", speed: "Medium" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", speed: "Fast" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", speed: "Fastest" },
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
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap px-1"
      >
        <span className="font-medium text-gray-700">{selected.label}</span>
        <span className="text-gray-400">({selected.speed})</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
          {MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onChange(model.id);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors ${
                model.id === value ? "bg-gray-50" : ""
              }`}
            >
              <span className="font-medium text-gray-800">{model.label}</span>
              <span className="text-gray-400 text-xs">{model.speed}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
