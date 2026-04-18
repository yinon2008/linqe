import { Badge } from "@/components/ui/Badge";
import { TaskStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  const labels: Record<TaskStatus, string> = {
    pending: "Pending",
    connecting: "Connecting...",
    connected: "Connected",
    failed: "Failed",
  };
  return <Badge status={status} label={labels[status]} />;
}
