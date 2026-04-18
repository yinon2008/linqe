import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Get authenticated user (optional — allow anonymous generation)
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create a pending project record — streaming happens in /api/generate/stream
    const adminClient = createServiceRoleClient();
    const { data: project, error: projectError } = await adminClient
      .from("projects")
      .insert({
        user_id: user?.id ?? null,
        raw_prompt: prompt.trim(),
        title: "Generating...",
        description: "",
        status: "draft",
      })
      .select()
      .single();

    if (projectError) {
      console.error("Project insert error:", projectError);
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }

    return NextResponse.json({ projectId: project.id });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
