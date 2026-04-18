"use client";

export type DeviceMode = "desktop" | "tablet" | "mobile";

const DEVICES: { id: DeviceMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "desktop",
    label: "Desktop",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

interface DeviceToolbarProps {
  mode: DeviceMode;
  onChange: (mode: DeviceMode) => void;
}

export function DeviceToolbar({ mode, onChange }: DeviceToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-1">
      {DEVICES.map((device) => {
        const active = mode === device.id;
        return (
          <button
            key={device.id}
            type="button"
            onClick={() => onChange(device.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              active
                ? "bg-[#111] border border-[#38BDF8]/30 text-white shadow-[0_0_8px_rgba(56,189,248,0.08)]"
                : "text-[#555] hover:text-[#888] border border-transparent"
            }`}
          >
            {device.icon}
            <span className="hidden sm:inline">{device.label}</span>
          </button>
        );
      })}
    </div>
  );
}
