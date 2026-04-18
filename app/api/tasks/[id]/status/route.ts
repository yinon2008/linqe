import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;

  try {
    const adminClient = createServiceRoleClient();
    const { data, error } = await adminClient
      .from("tasks")
      .select("status")
      .eq("id", taskId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ status: data.status });
  } catch (err) {
    console.error("Task status error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
