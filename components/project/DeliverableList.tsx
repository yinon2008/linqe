import { Deliverable } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const TYPE_LABELS: Record<string, string> = {
  landing_page: "Landing Page",
  web_app: "Web App",
  lead_system: "Lead System",
  design: "Design",
  automation: "Automation",
  integration: "Integration",
};

export function DeliverableList({ deliverables }: { deliverables: Deliverable[] }) {
  return (
    <div className="space-y-3">
      {deliverables.map((d) => (
        <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl border border-[#1a1a1a] bg-[#050505]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-white">{d.title}</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#1a1a1a] text-[#888]">
                {TYPE_LABELS[d.type] ?? d.type}
              </span>
            </div>
            <p className="text-xs text-[#555] mt-1">{d.description}</p>
            <p className="text-xs text-[#444] mt-1">{d.estimated_hours}h • {d.tasks.length} tasks</p>
          </div>
        </div>
      ))}
    </div>
  );
}
