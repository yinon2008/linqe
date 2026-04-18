export type TaskStatus = "pending" | "connecting" | "connected" | "failed";

export type AutomationType =
  | "domain"
  | "payment"
  | "email"
  | "database"
  | "hosting"
  | "api"
  | "none";

export type DeliverableType =
  | "landing_page"
  | "web_app"
  | "lead_system"
  | "design"
  | "automation"
  | "integration";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  automation_type: AutomationType;
  estimated_cost_usd: number;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  type: DeliverableType;
  estimated_hours: number;
  tasks: Task[];
}

export interface CostBreakdown {
  monthly_recurring: Array<{ item: string; cost_usd: number }>;
  one_time: Array<{ item: string; cost_usd: number }>;
  total_monthly_usd: number;
  total_one_time_usd: number;
}

export interface ProjectPlan {
  project_title: string;
  project_description: string;
  deliverables: Deliverable[];
  cost_breakdown: CostBreakdown;
  timeline_days: number;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  raw_prompt: string;
  ai_response: ProjectPlan | null;
  status: "draft" | "building" | "live";
  created_at: string;
}

export interface DbTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  automation_type: AutomationType;
  estimated_cost_usd: number;
  completed_at: string | null;
}
