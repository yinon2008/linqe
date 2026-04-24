import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminClient = createServiceRoleClient();
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get the source project
    const { data: source } = await adminClient
      .from("projects")
      .select("raw_prompt, ai_response, title, description, is_public")
      .eq("id", params.id)
      .single();

    if (!source || !source.is_public) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Increment remix count on the original
    const { data: orig } = await adminClient
      .from("projects")
      .select("remixes")
      .eq("id", params.id)
      .single();
    if (orig) {
      await adminClient
        .from("projects")
        .update({ remixes: (orig.remixes ?? 0) + 1 })
        .eq("id", params.id);
    }

    // Create a new project as a copy
    const { data: newProject } = await adminClient
      .from("projects")
      .insert({
        user_id: user?.id ?? null,
        raw_prompt: source.raw_prompt,
        ai_response: source.ai_response,
        title: `${source.title} (remix)`,
        description: source.description,
        status: "building",
      })
      .select()
      .single();

    if (!newProject) {
      return NextResponse.json({ error: "Failed to create remix" }, { status: 500 });
    }

    return NextResponse.json({ projectId: newProject.id });
  } catch (err) {
    console.error("Remix error:", err);
    return NextResponse.json({ error: "Failed to remix" }, { status: 500 });
  }
}
