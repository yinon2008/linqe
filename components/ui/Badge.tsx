import { TaskStatus } from "@/lib/types";

interface BadgeProps {
  status?: TaskStatus | string;
  label?: string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-[#1a1a1a]", text: "text-[#888]", dot: "bg-[#555]" },
  connecting: { bg: "bg-blue-950", text: "text-blue-400", dot: "bg-blue-400" },
  connected: { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
  failed: { bg: "bg-red-950", text: "text-red-400", dot: "bg-red-400" },
  draft: { bg: "bg-[#1a1a1a]", text: "text-[#888]", dot: "bg-[#555]" },
  building: { bg: "bg-blue-950", text: "text-blue-400", dot: "bg-blue-400" },
  live: { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-400" },
};

export function Badge({ status = "pending", label, className = "" }: BadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {label ?? status}
    </span>
  );
}
