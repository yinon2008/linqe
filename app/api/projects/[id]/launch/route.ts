import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createServiceRoleClient } from "@/lib/supabase-server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminClient = createServiceRoleClient();

    // Verify ownership (or allow anonymous)
    const { data: project, error: fetchError } = await adminClient
      .from("projects")
      .select("user_id, status")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.user_id && project.user_id !== user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (project.status === "live") {
      return NextResponse.json({ success: true, already: true });
    }

    const { error: updateError } = await adminClient
      .from("projects")
      .update({ status: "live" })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Launch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
