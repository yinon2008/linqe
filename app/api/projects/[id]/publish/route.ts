import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, category } = await req.json();
    const projectId = params.id;

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const adminClient = createServiceRoleClient();

    // Verify ownership (allow anonymous projects)
    const { data: project } = await adminClient
      .from("projects")
      .select("user_id, title, description")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.user_id && project.user_id !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const authorName = user?.user_metadata?.full_name
      || user?.email?.split("@")[0]
      || "Anonymous";

    await adminClient
      .from("projects")
      .update({
        is_public: true,
        title: title || project.title,
        description: description || project.description,
        category: category || "Other",
        published_at: new Date().toISOString(),
        author_name: authorName,
      })
      .eq("id", projectId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createServiceRoleClient();
    await adminClient
      .from("projects")
      .update({ is_public: false, published_at: null })
      .eq("id", params.id)
      .eq("user_id", user.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to unpublish" }, { status: 500 });
  }
}
